from django.urls import path
from news.api.register import RegisterUserView
from news.api.signin import LoginUserView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from news.api.article import ArticleListByDateView, ArticleDateListView

urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register'),
    path('signin/', LoginUserView.as_view(), name='signin'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view, name='token_refresh'),
    path('articles/', ArticleListByDateView.as_view(), name='articles_by_date'),
    path('article-dates/', ArticleDateListView.as_view(), name='article-date-list'),
]
