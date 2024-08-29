from djongo import models


class Article(models.Model):
    post_title = models.CharField(max_length=255, primary_key=True)
    image_link = models.URLField(max_length=255)
    author_name = models.CharField(max_length=100)
    published_date = models.DateField()
    content_paragraphs = models.JSONField()

    def __str__(self):
        return self.post_title

    @staticmethod
    def get_filtered_articles(date_str):
        return (Article.objects.filter(published_date=date_str)
                .exclude(image_link='No image')
                )

    @staticmethod
    def fetch_articles_by_date_range(start_date, end_date):
        # Use the date objects directly to filter the articles
        articles = (Article.objects
                    .filter(published_date__gte=start_date, published_date__lte=end_date)
                    .exclude(image_link='No image'))

        return articles
