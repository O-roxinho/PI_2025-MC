from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, IsAuthenticated 
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from .models import Produtos, Categoria, Telefone
from .serializers import ProdutoSerializer, CategoriaSerializer, TelefoneSerializer
import os
from django.conf import settings

class ProdutoViewSet(viewsets.ModelViewSet):
    queryset = Produtos.objects.all()
    serializer_class = ProdutoSerializer
    permission_classes = [IsAdminUser] 
    #permission_classes = [IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        produto = self.get_object()
        if produto.imagem:
            imagem_path = os.path.join(settings.MEDIA_ROOT, str(produto.imagem))
            if os.path.exists(imagem_path):
                os.remove(imagem_path)
        produto.delete()
        return Response({'message': 'Produto excluído com sucesso'}, status=status.HTTP_204_NO_CONTENT)
    
    def update(self, request, *args, **kwargs):
        try:
            produto = self.get_object()  # Obtém o produto com o ID especificado
            serializer = self.get_serializer(produto, data=request.data, partial=True)  # Permite atualização parcial
            serializer.is_valid(raise_exception=True)
            serializer.save()

            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'mensagem': 'Erro ao atualizar o produto.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [IsAdminUser]

@api_view(['POST'])
@permission_classes([IsAdminUser])
def adicionar_categoria(request):
    nome = request.data.get('nome')
    if not nome:
        return Response({'mensagem': 'O nome da categoria é obrigatório.'}, status=status.HTTP_400_BAD_REQUEST)
    print(nome)
    # Verifica se a categoria já existe
    exite = Categoria.objects.filter(nome=nome).exists()
    print(exite)
    if exite:
        return Response({'mensagem': 'Esta categoria já existe.'}, status=status.HTTP_400_BAD_REQUEST)

    # Cria a nova categoria
    categoria = Categoria.objects.create(nome=nome)
    serializer = CategoriaSerializer(categoria)
    return Response(serializer.data, status=201)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def remover_categoria(request):
    nome = request.data.get('nome')
    if not nome:
        return Response({'mensagem': 'O nome da categoria é obrigatório.'}, status=400)

    # Busca a categoria
    try:
        categoria = Categoria.objects.get(nome=nome)
        categoria.delete()
        return Response({'mensagem': 'Categoria removida com sucesso.'}, status=200)
    except Categoria.DoesNotExist:
        return Response({'mensagem': 'Categoria não encontrada.'}, status=404)

class TelefoneViewSet(viewsets.ModelViewSet):
    queryset = Telefone.objects.all()
    serializer_class = TelefoneSerializer
    permission_classes = [IsAdminUser]

    def create(self, request, *args, **kwargs):
        # Verifica se os campos obrigatórios estão presentes
        codigo_pais = request.data.get("codigo_pais")
        telefone = request.data.get("telefone")
        print(codigo_pais)
        print(telefone)
        if not codigo_pais or not telefone:
            return Response(
                {'mensagem': 'O código do país e o telefone são obrigatórios.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Busca ou cria o objeto Telefone com id=1
            telefone_obj, created = Telefone.objects.get_or_create(id=1)
            telefone_obj.codigo_pais = codigo_pais
            telefone_obj.telefone = telefone
            telefone_obj.save()

            # Retorna os dados serializados
            serializer = self.get_serializer(telefone_obj)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'mensagem': 'Erro ao atualizar o telefone.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
