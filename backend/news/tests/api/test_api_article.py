from datetime import datetime
from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse
from news.models.article import Article


class ArticleAPITestCase(APITestCase):

    databases = {"default", "mongodb"}

    def setUp(self):
        # Create sample articles
        self.article1 = Article.objects.create(
            post_title="Test Article 1",
            image_link="http://example.com/image1.jpg",
            author_name="Author 1",
            published_date=datetime(2023, 9, 1),
            content_paragraphs=["Paragraph 1", "Paragraph 2"]
        )
        self.article2 = Article.objects.create(
            post_title="Test Article 2",
            image_link="http://example.com/image2.jpg",
            author_name="Author 2",
            published_date=datetime(2023, 9, 2),
            content_paragraphs=["Paragraph 1", "Paragraph 2"]
        )
        self.article3 = Article.objects.create(
            post_title="Test Article 3",
            image_link="No image",
            author_name="Author 3",
            published_date=datetime(2023, 9, 3),
            content_paragraphs=["Paragraph 1"]
        )

    def tearDown(self):
        Article.objects.all().delete()

    def test_get_articles_by_date(self):
        url = reverse('articles_by_date')
        valid_date_str = '2025-09-01'

        Article.objects.create(
            post_title='Test Article 1',
            image_link='http://example.com/image1.jpg',
            author_name='Author 1',
            published_date='2025-09-01',
            content_paragraphs=['Paragraph 1', 'Paragraph 2']
        )
        response = self.client.get(url, {'date': valid_date_str})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['post_title'], 'Test Article 1')

    def test_get_articles_exclude_no_image(self):
        # Test that articles with 'No image' are excluded
        url = reverse('articles_by_date')
        date_str = '2023-09-03'

        response = self.client.get(url, {'date': date_str})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 0)

    def test_get_articles_by_invalid_date(self):
        # Test an invalid date format
        url = reverse('articles_by_date')
        invalid_date_str = "2020-94-03"

        response = self.client.get(f'{url}?date={invalid_date_str}')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], 'Invalid date format')

    def test_get_distinct_article_dates(self):
        # Test fetching distinct article dates
        url = reverse('article-date-list')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('dates', response.data)
        self.assertEqual(len(response.data['dates']), 3)
        self.assertIn('2023-09-01', response.data['dates'])
        self.assertIn('2023-09-02', response.data['dates'])

    def test_get_article_detail(self):
        # Test fetching the details of an article
        url = reverse('article-detail', kwargs={'article_id': self.article1.post_title})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['post_title'], 'Test Article 1')
        self.assertEqual(response.data['author_name'], 'Author 1')

    def test_get_article_detail_not_found(self):
        # Test article detail with non-existent article
        url = reverse('article-detail', kwargs={'article_id': 'Non-Existent Article'})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['error'], 'Article not found')