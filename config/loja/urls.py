from django.urls import path
from . import views

urlpatterns = [   
    path('produto/<int:produto_id>/', views.produto_detalhes, name='produto_detalhes'),
    path('produto/<int:produto_id>/avaliar/', views.avaliar_produto, name='avaliar_produto'),
    path('produto/<int:produto_id>/carregar_avaliacoes/', views.carregar_avaliacoes, name='carregar_avaliacoes'),
    path('excluir_comentario/<int:comentario_id>/', views.excluir_comentario, name='excluir_comentario'),
    path('',views.main),
    path('ajax/sugestoes/', views.buscar_sugestoes_ajax, name='buscar_sugestoes_ajax'),
    path('enviar-produto/<int:produto_id>/', views.enviar_produto_whatsapp, name='enviar_produto_whatsapp'),
]
