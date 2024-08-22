from rest_framework import serializers
from ..models.article import Article



class ArticleSerializer(serializers.ModelSerializer):
    content_paragraphs = serializers.ListField(child=serializers.CharField(), required=False)

    class Meta:
        model = Article
        fields = '__all__'


class DateValidatorSerializer(serializers.Serializer):
    date = serializers.DateField(input_formats=['%Y-%m-%d'])

    def get_filtered_articles(self):
        date_str = self.validated_data.get('date')
        return (Article.objects.filter(published_date=date_str)
                .exclude(image_link='No image')
                )
