from datetime import date

from django.test import TestCase
from news.models.article import Article
from news.serializers.article import ArticleSerializer, ArticleDateSerializer, ArticleDetailSerializer


class TestArticleSerializer(TestCase):

    databases = {"default", "mongodb"}

    def setUp(self):
        self.article = Article.objects.create(
            post_title='Test Article',
            author_name='John Doe',
            published_date='2022-01-01',
            content_paragraphs=['Paragraph 1', 'Paragraph 2'],
            image_link='https://example.com/image.jpg'
        )

    def test_article_serializer(self):
        serializer = ArticleSerializer(self.article)
        self.assertEqual(serializer.data['post_title'], 'Test Article')
        self.assertEqual(serializer.data['author_name'], 'John Doe')
        self.assertEqual(serializer.data['published_date'], '2022-01-01')
        self.assertEqual(eval(serializer.data['content_paragraphs']), ['Paragraph 1', 'Paragraph 2'])
        self.assertEqual(serializer.data['image_link'], 'https://example.com/image.jpg')

    def test_article_date_serializer(self):
        dates = ['2022-01-01', '2022-01-02']
        expected_dates = [date(2022, 1, 1), date(2022, 1, 2)]
        serializer = ArticleDateSerializer(data={'dates': dates})
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.validated_data['dates'], expected_dates)

    def test_article_detail_serializer(self):
        serializer = ArticleDetailSerializer(self.article)
        self.assertEqual(serializer.data['post_title'], 'Test Article')
        self.assertEqual(serializer.data['author_name'], 'John Doe')
        self.assertEqual(serializer.data['published_date'], '2022-01-01')
        self.assertEqual(serializer.data['content_paragraphs'], ['Paragraph 1', 'Paragraph 2'])
        self.assertEqual(serializer.data['image_link'], 'https://example.com/image.jpg')
