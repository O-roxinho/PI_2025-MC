from django.urls import path
from .views import LoginView, LogoutView, RegisterAPI, UserInfoAPI
from rest_framework.authtoken.views import ObtainAuthToken

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('api/logout/', LogoutView.as_view(), name='logout'),
    path("api/register/", RegisterAPI.as_view(), name="api-register"),
    path('api-token-auth/', ObtainAuthToken.as_view(), name='api_token_auth'),
    path('api/user-info/', UserInfoAPI.as_view(), name='user-info'),
]