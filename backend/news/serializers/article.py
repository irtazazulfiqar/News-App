from django.utils.dateparse import parse_date
from rest_framework import serializers
from news.models.article import Article


class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = ['post_title', 'image_link', 'author_name', 'published_date']


class ArticleDateSerializer(serializers.Serializer):
    dates = serializers.ListField(
        child=serializers.DateField(),
        allow_empty=False
    )


class ArticleDetailSerializer(serializers.ModelSerializer):
    content_paragraphs = serializers.ListField(
        child=serializers.CharField(),
        allow_empty=True
    )

    class Meta:
        model = Article
        fields = '__all__'
