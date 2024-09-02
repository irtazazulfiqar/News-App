from django.utils.dateparse import parse_date
from rest_framework import serializers
from news.models.article import Article


class ArticleSerializer(serializers.ModelSerializer):
    content_paragraphs = serializers.ListField(child=serializers.CharField(), required=False)

    class Meta:
        model = Article
        fields = '__all__'


class ArticleDateSerializer(serializers.Serializer):
    dates = serializers.ListField(
        child=serializers.DateField(),
        allow_empty=False
    )
