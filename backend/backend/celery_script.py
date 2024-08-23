import requests
from bs4 import BeautifulSoup
from datetime import datetime
import re
from news.models.article import Article


class ArticleScraper:
    def __init__(self, start_url, target_date=None):
        self.start_url = start_url
        self.target_date = target_date or datetime.today().strftime('%B %d, %Y')

    @staticmethod
    def convert_to_date(date_string):
        date_formats = [
            "%B %d, %Y",  # e.g., August 21, 2024
            "%d %B %Y",  # e.g., 21 August 2024
            "%Y-%m-%d"  # e.g., 2024-08-21
        ]
        for fmt in date_formats:
            try:
                date_obj = datetime.strptime(date_string, fmt)
                return date_obj.strftime("%Y-%m-%d")
            except ValueError:
                continue
        raise ValueError(f"Date format for '{date_string}' is not recognized.")

    @staticmethod
    def fetch_and_parse(url):
        try:
            response = requests.get(url)
            response.raise_for_status()
            return BeautifulSoup(response.content, 'html.parser')
        except requests.exceptions.RequestException as e:
            print(f"Error fetching the URL: {url}\nError: {e}")
            return None

    @staticmethod
    def extract_text_from_tag(tag, default_text='No data'):
        return tag.text.strip() if tag else default_text

    @staticmethod
    def extract_post_date(post_soup):
        detail_left_tittle = post_soup.find('div', class_='detail-left-tittle')
        if detail_left_tittle:
            date_tag = detail_left_tittle.find('div', class_='category-date')
            return ArticleScraper.extract_text_from_tag(date_tag, 'No date')
        return 'No date'

    @staticmethod
    def extract_image_link(post_soup):
        image_div = post_soup.find('div', class_='medium-insert-images')
        if not image_div:
            return 'No image'
        image_tag = image_div.find('img')
        return image_tag['src'] if image_tag else 'No image'

    @staticmethod
    def extract_metadata(post_soup):
        metadata = {}
        detail_heading = post_soup.find('div', class_='detail-heading')
        if detail_heading:
            metadata['post_title'] = ArticleScraper.extract_text_from_tag(detail_heading.find('h1'), 'No title')
        else:
            metadata['post_title'] = 'No title'

        detail_left_tittle = post_soup.find('div', class_='detail-left-tittle')
        if detail_left_tittle:
            author_tag = detail_left_tittle.find('div', class_='category-source')
            metadata['author_name'] = ArticleScraper.extract_text_from_tag(author_tag, 'No author').replace('By',
                                                                                                            '').strip()
            date_tag = detail_left_tittle.find('div', class_='category-date')
            metadata['published_date'] = ArticleScraper.extract_text_from_tag(date_tag, 'No date')
        else:
            metadata['author_name'] = 'No author'
            metadata['published_date'] = 'No date'

        return metadata

    @staticmethod
    def clean_text(text):
        text = text.replace('â\x80\x9d', '"').replace('â\x80\x9c', '"').replace('â\x80\x98', "'").replace('â\x80\x99',
                                                                                                          "'")
        text = text.replace('\\', "")
        text = text.replace('â\x80\x93', '-').replace('â\x80¦', '...')
        text = re.sub(r'[^\x00-\x7F]+', '', text)
        return text

    @staticmethod
    def extract_clean_content(post_soup):
        if not post_soup:
            return []

        for div_class in ['print_more', 'print_story_more', 'copyright']:
            for div in post_soup.find_all('div', class_=div_class):
                div.decompose()

        paragraphs = post_soup.find_all('p')
        cleaned_paragraphs = [ArticleScraper.clean_text(p.text) for p in paragraphs]
        return cleaned_paragraphs

    @staticmethod
    def save_article(post_details):
        if not post_details:
            return

        try:
            if not Article.objects.filter(post_title=post_details['post_title']).exists():
                article = Article(
                    post_title=post_details['post_title'],
                    image_link=post_details.get('image_link', 'No image'),
                    author_name=post_details.get('author_name', 'No author'),
                    published_date=ArticleScraper.convert_to_date(post_details.get('published_date', 'No date')),
                    content_paragraphs=post_details.get('content_paragraphs', [])
                )
                article.save()

        except Exception as e:
            pass

    def extract_post_details(self, post_soup):
        """
        Extract all details of a post.
        """
        if not post_soup:
            return None

        post_details = {
            'image_link': self.extract_image_link(post_soup),
            **self.extract_metadata(post_soup),
            'content_paragraphs': self.extract_clean_content(post_soup)
        }

        if post_details['post_title'] == 'No title':
            """
            Skip this post due to missing title.
            This might be some live broadcast, 
            that we don't want.
            """
            return None
        return post_details

    def process_story_links(self, story_items):
        processed_links = set()
        all_tags = []
        for item in story_items:
            a_tags = item.find_all('a')
            all_tags.extend(a_tags)

        for a_tag in all_tags:
            link = a_tag.get('href')

            if link and link not in processed_links:
                processed_links.add(link)
                post_soup = self.fetch_and_parse(link)
                post_date = self.extract_post_date(post_soup)

                try:
                    # Checking the post-date before processing it
                    post_date_converted = self.convert_to_date(post_date)
                    if post_date_converted == self.target_date:
                        post_details = self.extract_post_details(post_soup)
                        self.save_article(post_details)

                except ValueError as e:
                    pass

    @staticmethod
    def find_links(soup):
        if not soup:
            return []

        nav_items = soup.find_all('li')
        links = []
        for i, link in enumerate(nav_items):
            second_nav_item = nav_items[i]
            a_tag = second_nav_item.find('a', class_='open-section')
            if a_tag:
                links.append(a_tag['href'])
        return links

    def crawl(self):
        soup = self.fetch_and_parse(self.start_url)
        links = self.find_links(soup)
        for link in links:
            page_soup = self.fetch_and_parse(link)
            if page_soup:
                story_items = page_soup.find_all('div', class_='writter-list-item-story')
                self.process_story_links(story_items)
