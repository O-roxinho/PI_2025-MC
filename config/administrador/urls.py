from rest_framework import routers
from django.urls import path, include
from .views import ProdutoViewSet, CategoriaViewSet, TelefoneViewSet, adicionar_categoria,remover_categoria

router = routers.DefaultRouter()
router.register(r'produtos', ProdutoViewSet)
router.register(r'categorias', CategoriaViewSet)
router.register(r'telefones', TelefoneViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/adicionar_categoria/', adicionar_categoria, name='adicionar_categoria'),
    path('api/remover_categoria/', remover_categoria, name='remover_categoria'),
]