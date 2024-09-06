from django.test import TestCase
from unittest.mock import patch, MagicMock
from bs4 import BeautifulSoup
from backend.celery_script import ArticleScraper
import requests


class TestArticleScraper(TestCase):

    databases = {"default", "mongodb"}

    @patch('backend.celery_script.requests.get')
    def test_fetch_and_parse_success(self, mock_get):
        # Arrange: Mock a successful HTTP response
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.content = '<html><body><div class="test">Test Content</div></body></html>'
        mock_get.return_value = mock_response

        # Act: Call the fetch_and_parse method
        scraper = ArticleScraper()
        soup = scraper.fetch_and_parse('https://example.com')

        # Assert: Check if BeautifulSoup parsed correctly
        self.assertIsInstance(soup, BeautifulSoup)
        self.assertEqual(soup.find('div', class_='test').text, 'Test Content')

    @patch('backend.celery_script.requests.get')
    def test_fetch_and_parse_failure(self, mock_get):
        # Arrange: Mock a failed HTTP response
        mock_get.side_effect = requests.exceptions.RequestException()

        # Act: Call the fetch_and_parse method with a bad URL
        scraper = ArticleScraper()
        soup = scraper.fetch_and_parse('https://badurl.com')

        # Assert: Soup should be None due to the exception
        self.assertIsNone(soup)

    @patch('backend.celery_script.ArticleScraper.fetch_and_parse')
    def test_crawl_and_process_links(self, mock_fetch_and_parse):
        # Arrange: Mock a response from fetch_and_parse
        mock_soup = BeautifulSoup('<html><div class="writter-list-item-story"><a '
                                  'href="https://example.com"></a></div></html>', 'html.parser')
        mock_fetch_and_parse.return_value = mock_soup

        scraper = ArticleScraper()

        # Act: Call the crawl method
        scraper.crawl()

        # Assert: Ensure fetch_and_parse was called for the main URL
        self.assertTrue(mock_fetch_and_parse.called)

    @patch('backend.celery_script.ArticleScraper.save_article')
    @patch('backend.celery_script.ArticleScraper.fetch_and_parse')
    def test_process_story_links(self, mock_fetch_and_parse, mock_save_article):
        # Arrange: Mock a successful page soup with story links and a matching date
        post_soup = BeautifulSoup('''
            <html>
                <div class="detail-heading"><h1>Test Article</h1></div>
                <div class="detail-left-tittle">
                    <div class="category-date">September 06, 2024</div>
                </div>
            </html>
        ''', 'html.parser')
        mock_fetch_and_parse.return_value = post_soup

        scraper = ArticleScraper(target_date='2024-09-06')
        story_items = [BeautifulSoup('<div class="writter-list-item-story"><a href="https://example.com"></a></div>',
                                     'html.parser')]

        # Act: Call process_story_links with mocked data
        scraper.process_story_links(story_items)

        # Assert: Ensure save_article is called with post details
        self.assertTrue(mock_save_article.called)
