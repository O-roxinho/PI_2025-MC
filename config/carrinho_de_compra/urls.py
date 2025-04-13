from django.urls import path
from .views import CarrinhoView, ItemCarrinhoView

urlpatterns = [
    path('api/carrinho/', CarrinhoView.as_view(), name='carrinho'),
    path('api/carrinho/itens/<int:item_id>/', ItemCarrinhoView.as_view(), name='item-carrinho'),
]
