from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FavoritoViewSet

router = DefaultRouter()
router.register(r'favoritos', FavoritoViewSet, basename='favorito')

urlpatterns = [
    path('', include(router.urls)),
] 