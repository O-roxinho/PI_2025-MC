from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from django.shortcuts import get_object_or_404
from .models import Carrinho, ItemCarrinho
from administrador.models import Produtos, Telefone
from .serializers import CarrinhoSerializer, ProdutoSerializer
from urllib.parse import quote

class CarrinhoView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    def get(self, request):
        carrinho, created = Carrinho.objects.get_or_create(usuario=request.user)
        serializer = CarrinhoSerializer(carrinho, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        produto_id = request.data.get('produto_id')
        if not produto_id:
            return Response({'error': 'produto_id é obrigatório'}, status=status.HTTP_400_BAD_REQUEST)

        produto = get_object_or_404(Produtos, id=produto_id)
        carrinho, created = Carrinho.objects.get_or_create(usuario=request.user)
        
        item, created = ItemCarrinho.objects.get_or_create(
            carrinho=carrinho,
            produto=produto,
            defaults={'quantidade': 1}
        )

        if not created:
            item.quantidade += 1
            item.save()

        serializer = CarrinhoSerializer(carrinho, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class Reduzir_quantidade(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def post(self, request):
        produto_id = request.data.get('produto_id')
        if not produto_id:
            return Response({'error': 'produto_id é obrigatório'}, status=status.HTTP_400_BAD_REQUEST)

        produto = get_object_or_404(Produtos, id=produto_id)
        carrinho, created = Carrinho.objects.get_or_create(usuario=request.user)
        
        item, created = ItemCarrinho.objects.get_or_create(
            carrinho=carrinho,
            produto=produto,
            defaults={'quantidade': 1}
        )

        if not created:
            item.quantidade -= 1
            item.save()

        serializer = CarrinhoSerializer(carrinho, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ItemCarrinhoView(APIView):
    permission_classes = [IsAuthenticated]
    

    def delete(self, request, item_id):
        item = get_object_or_404(ItemCarrinho, id=item_id, carrinho__usuario=request.user)
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class ProdutoDetalhesAPI(APIView):
    def get(self, request, produto_id):
        produto = get_object_or_404(Produtos, id=produto_id)
        serializer = ProdutoSerializer(produto, context={'request': request})
        return Response(serializer.data)

class WhatsAppCarrinhoAPI(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def post(self, request):
        limpar_carrinho = request.data.get('limpar_carrinho', False)
        carrinho = get_object_or_404(Carrinho, usuario=request.user)
        numerobr = Telefone.objects.first()
        numero = getattr(numerobr, 'codigo_pais', '55') + getattr(numerobr, 'telefone', '')
        print(numero)
        # Construir mensagem com todos os produtos
        mensagem = "Olá! Estou interessado nos seguintes produtos:\n\n"
        total = 0
        
        for item in carrinho.itens.all():
            mensagem += f"- {item.produto.nome}: R${item.produto.preco:.2f} x {item.quantidade}\n"
            total += item.produto.preco * item.quantidade
        
        mensagem += f"\nTotal: R${total:.2f}"

        # Se o usuário quiser limpar o carrinho
        if limpar_carrinho:
            carrinho.itens.all().delete()

        return Response({
            'url': f'https://web.whatsapp.com/send?phone={numero}&text={quote(mensagem)}'
        })