from django.urls import path
from .views import CarrinhoView, ItemCarrinhoView, Reduzir_quantidade, WhatsAppCarrinhoAPI

urlpatterns = [
    path('api/carrinho/', CarrinhoView.as_view(), name='carrinho'),
    path('api/carrinho/itens/<int:item_id>/', ItemCarrinhoView.as_view(), name='item-carrinho'),
    path('api/Reduzir_quantidade/', Reduzir_quantidade.as_view(), name='remover_quantidade'),
    path('api/carrinho/whatsapp/', WhatsAppCarrinhoAPI.as_view(), name='whatsapp-carrinho')
]
