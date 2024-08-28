from django.urls import path
from news.api.register import RegisterUserView

urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register'),
]
