from djongo import models


class Article(models.Model):
    post_title = models.CharField(max_length=255, primary_key=True)
    image_link = models.URLField(max_length=255)
    author_name = models.CharField(max_length=100)
    published_date = models.DateField()
    content_paragraphs = models.JSONField()

    def __str__(self):
        return self.post_title
