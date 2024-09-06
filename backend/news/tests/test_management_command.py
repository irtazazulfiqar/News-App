from django.core.management import call_command
from django.test import TestCase
from unittest.mock import patch
from io import StringIO
from datetime import datetime
from news.models.article import Article


class TestFetchArticlesCommand(TestCase):
    databases = {"default", "mongodb"}

    @patch('news.models.article.Article.fetch_articles_by_date_range')
    def test_fetch_articles_by_date_range_command(self, mock_fetch_articles):
        # Arrange: Mock articles and define start/end date
        mock_articles = [
            Article(post_title="Article 1", published_date=datetime(2024, 9, 1)),
            Article(post_title="Article 2", published_date=datetime(2024, 9, 5))
        ]
        mock_fetch_articles.return_value = mock_articles
        out = StringIO()

        # Act: Call the management command with start and end dates
        call_command('fetch_articles', '2024-09-01', '2024-09-10', stdout=out)

        # Assert: Check if fetch_articles_by_date_range was called with the correct dates
        mock_fetch_articles.assert_called_once_with(datetime(2024, 9, 1).date(),
                                                    datetime(2024, 9, 10).date())

        # Check the output
        self.assertIn("Total articles fetched: 2", out.getvalue())

    @patch('news.models.article.Article.fetch_articles_by_date_range')
    def test_no_articles_found(self, mock_fetch_articles):
        # Arrange: Mock an empty list for no articles
        mock_fetch_articles.return_value = []
        out = StringIO()

        # Act: Call the management command with dates that will fetch no articles
        call_command('fetch_articles', '2024-09-01', '2024-09-10', stdout=out)

        # Assert: Check if the appropriate message is printed
        self.assertIn("No articles found for the given date range.", out.getvalue())
