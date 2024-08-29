from django.core.management.base import BaseCommand
from datetime import datetime
from news.models.article import Article


class Command(BaseCommand):
    help = 'Fetch details of articles between two dates'

    def add_arguments(self, parser):
        # Add arguments for the start and end dates
        parser.add_argument('start_date', type=str, help='Start date in the format YYYY-MM-DD')
        parser.add_argument('end_date', type=str, help='End date in the format YYYY-MM-DD')

    def handle(self, *args, **kwargs):
        start_date_str = kwargs['start_date']
        end_date_str = kwargs['end_date']

        try:
            # Validate and convert the date strings to date objects
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
        except ValueError:
            self.stdout.write(self.style.ERROR('Invalid date format. Please use YYYY-MM-DD.'))
            return

        # Pass the date objects directly to the fetch_articles_by_date_range function
        articles = Article.fetch_articles_by_date_range(start_date, end_date)

        # Print the details of the fetched articles
        if articles:
            for article in articles:
                self.stdout.write(self.style.SUCCESS(f"Article: {article.post_title}, Published on: {article.published_date}"))
        else:
            self.stdout.write(self.style.WARNING("No articles found for the given date range."))
