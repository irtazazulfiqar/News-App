from django.urls import path
from news.views.register import RegisterUserView
from news.views.signin import LoginUserView
from news.views.verify_token import CustomTokenVerifyView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views.article import ArticleListByDateView, ArticleDateListView

urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register'),
    path('signin/', LoginUserView.as_view(), name='signin'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view, name='token_refresh'),
    path('token/verify/', CustomTokenVerifyView.as_view(), name='token_verify'),
    path('articles/', ArticleListByDateView.as_view(), name='articles_by_date'),
    path('article-dates/', ArticleDateListView.as_view(), name='article-date-list'),
]
