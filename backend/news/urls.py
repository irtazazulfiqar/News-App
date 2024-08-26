from django.urls import path
from .views.register import RegisterUserView
# from .views.signin import LoginUserView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register'),
    path('signin/', LoginUserView.as_view(), name='signin'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view, name='token_refresh'),
    path('token/verify/', CustomTokenVerifyView.as_view(), name='token_verify'),

]
