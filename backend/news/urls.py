from django.urls import path
from news.api.register import RegisterUserView
from news.api.signin import LoginUserView

urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register'),
    path('signin/', LoginUserView.as_view(), name='signin'),
]
