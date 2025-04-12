from django.urls import path
from .views import (
    MainAPI,
    BuscarProdutosAPI,
    ProdutoDetalhesAPI,
    WhatsAppAPI,
    AvaliacaoAPI,   
    ComentariosAPI,
    CategoriaProdutosAPI,
    UsuarioAtualAPI
)

urlpatterns = [
    path('api/main/', MainAPI.as_view(), name='main-api'),
    path('api/buscar/', BuscarProdutosAPI.as_view(), name='buscar-api'),
    path('api/produto/<int:produto_id>/', ProdutoDetalhesAPI.as_view(), name='produto-detalhes-api'),
    path('api/whatsapp/<int:produto_id>/', WhatsAppAPI.as_view(), name='whatsapp-api'),
    # Endpoint para avaliar um produto
    path('api/avaliar/<int:produto_id>/', AvaliacaoAPI.as_view(), name='avaliar-api'),
    # Endpoint para excluir avaliação
    path('api/comentarios/<int:comentario_id>/', ComentariosAPI.as_view(), name='excluir-comentario-api'),
    path('api/categoria/<str:categoria_nome>/', CategoriaProdutosAPI.as_view(), name='categoria-produtos-api'),
    path('api/usuario-atual/', UsuarioAtualAPI.as_view(), name='usuario-atual'),
]