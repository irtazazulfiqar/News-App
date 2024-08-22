from django.core.exceptions import ValidationError
from rest_framework import generics, status
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

from ..models.article import Article
from ..serializers.article import ArticleSerializer, DateValidatorSerializer


class CustomPagination(PageNumberPagination):
    page_size = 6
    page_size_query_param = 'page_size'
    max_page_size = 100


class ArticleListByDateView(generics.ListAPIView):
    serializer_class = ArticleSerializer
    pagination_class = CustomPagination

    def get_queryset(self):
        # Get the date from query params
        date_str = self.request.query_params.get('date')

        # Validate the date using the DateValidatorSerializer
        serializer = DateValidatorSerializer(data={'date': date_str})
        if not serializer.is_valid():
            # Return a response with validation errors if date is invalid
            return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        # Get filtered articles using the custom method in the serializer
        return serializer.get_filtered_articles()
