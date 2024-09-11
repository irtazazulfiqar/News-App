from django.test import TestCase
from news.models.article import Article
from datetime import date


class ArticleModelTest(TestCase):
    databases = {'default', 'mongodb'}

    def tearDown(self):
        Article.objects.all().delete()

    def test_create_article(self):
        article = Article.objects.create(
            post_title='Test Article',
            image_link='https://example.com/image.jpg',
            author_name='John Doe',
            published_date=date(2024, 9, 4),
            content_paragraphs=['This is a test article.']
        )
        self.assertEqual(article.post_title, 'Test Article')
        self.assertEqual(article.image_link, 'https://example.com/image.jpg')
        self.assertEqual(article.author_name, 'John Doe')
        self.assertEqual(article.published_date, date(2024, 9, 4))
        self.assertEqual(article.content_paragraphs, ['This is a test article.'])

    def test_get_filtered_articles(self):
        article1 = Article.objects.create(
            post_title='Test Article 1',
            image_link='https://example.com/image1.jpg',
            author_name='John Doe',
            published_date=date(2024, 9, 4),
            content_paragraphs=['This is a test article 1.']
        )
        article2 = Article.objects.create(
            post_title='Test Article 2',
            image_link='No image',
            author_name='Jane Doe',
            published_date=date(2024, 9, 4),
            content_paragraphs=['This is a test article 2.']
        )
        filtered_articles = Article.get_filtered_articles(
            date(2024, 9, 4))
        self.assertEqual(len(filtered_articles), 1)
        self.assertEqual(filtered_articles[0].post_title, 'Test Article 1')

    def test_fetch_articles_by_date_range(self):
        article1 = Article.objects.create(
            post_title='Test Article 1',
            image_link='https://example.com/image1.jpg',
            author_name='John Doe',
            published_date=date(2024, 9, 3),
            content_paragraphs=['This is a test article 1.']
        )
        article2 = Article.objects.create(
            post_title='Test Article 2',
            image_link='https://example.com/image2.jpg',
            author_name='Jane Doe',
            published_date=date(2024, 9, 4),
            content_paragraphs=['This is a test article 2.']
        )
        article3 = Article.objects.create(
            post_title='Test Article 3',
            image_link='https://example.com/image3.jpg',
            author_name='John Doe',
            published_date=date(2024, 9, 5),
            content_paragraphs=['This is a test article 3.']
        )
        start_date = date(2024, 9, 3)
        end_date = date(2024, 9, 5)
        articles = Article.fetch_articles_by_date_range(start_date, end_date)
        self.assertEqual(len(articles), 3)
        self.assertEqual(articles[0].post_title, 'Test Article 1')
        self.assertEqual(articles[1].post_title, 'Test Article 2')
        self.assertEqual(articles[2].post_title, 'Test Article 3')