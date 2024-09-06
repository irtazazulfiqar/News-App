from django.utils.dateparse import parse_date
from rest_framework import serializers
from news.models.article import Article


class ArticleSerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()

    class Meta:
        model = Article
        fields = ['_id', 'post_title', 'author_name', 'published_date', 'image_link']

    def get__id(self, obj):
        return str(obj.pk)


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
