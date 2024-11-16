from django.urls import path
from . import views

urlpatterns = [
    path('cadastrar', views.cadastrar),
    path('excluir/<int:id>', views.excluir, name='excluir'),
    path('atualizar/<int:id>', views.atualizar, name='atualizar'),
    path('produtos', views.tabela),   
    path('numeros', views.numeros),  
    
]
