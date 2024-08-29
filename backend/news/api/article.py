from datetime import datetime

from rest_framework import generics, status
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView
from news.models.article import Article
from news.serializers.article import (ArticleSerializer,
                                      ArticleDateSerializer)


class CustomPagination(PageNumberPagination):
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 100


class ArticleListByDateView(generics.ListAPIView):
    serializer_class = ArticleSerializer
    pagination_class = CustomPagination

    def get_queryset(self):
        # Get the date from query params
        date_str = self.request.query_params.get('date')

        try:
            date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except (TypeError, ValueError):
            return Response({'error': 'Invalid date format'}, status=status.HTTP_400_BAD_REQUEST)

        # Get filtered articles using the custom method in Article Model
        return Article.get_filtered_articles(date_str)


class ArticleDateListView(APIView):
    def get(self, request, *args, **kwargs):
        # Fetch the distinct published dates from the Article model

        article_dates = Article.objects.values_list('published_date',
                                                    flat=True).distinct()

        # Pass the dates to the serializer as a list of dates
        serializer = ArticleDateSerializer({'dates': article_dates})

        return Response(serializer.data, status=status.HTTP_200_OK)
