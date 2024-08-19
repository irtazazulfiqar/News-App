from django.urls import path
from .views.register import RegisterUserView
from .views.signin import LoginUserView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register'),

]
