from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import TokenAuthentication
from django.db.models import Count, Q
from urllib.parse import quote
from administrador.models import Produtos, Categoria, Avaliacao, Telefone
from .serializers import CategoriaSerializer, ProdutoSerializer, AvaliacaoSerializer
from django.shortcuts import get_object_or_404
from rest_framework import serializers

class MainAPI(APIView):
    def get(self, request):
        categorias = Categoria.objects.annotate(num_produtos=Count('produtos')).filter(num_produtos__gt=0)
        serializer = CategoriaSerializer(
            categorias, 
            many=True, 
            context={'request': request}  # Passa o request para o serializer
        )
        
        return Response({
            'categorias': serializer.data,
            'usuario': request.user.username if request.user.is_authenticated else None
        })

class ProdutoSerializer(serializers.ModelSerializer):
    imagem_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Produtos
        fields = ['id', 'nome', 'preco', 'imagem_url', 'descricao']

    def get_imagem_url(self, obj):
        request = self.context.get('request')
        if obj.imagem:
            return request.build_absolute_uri(obj.imagem.url)
        return None

class BuscarProdutosAPI(APIView):
    def get(self, request):
        query = request.GET.get('query', '').strip()
        
        if not query:
            return Response([], status=status.HTTP_200_OK)

        produtos = Produtos.objects.filter(
            Q(nome__icontains=query) | 
            Q(descricao__icontains=query) |
            Q(categoria__nome__icontains=query)
        ).distinct()[:10]

        serializer = ProdutoSerializer(
            produtos, 
            many=True,
            context={'request': request}
        )
        return Response(serializer.data)
    
class ProdutoDetalhesAPI(APIView):
    def get(self, request, produto_id):
        produto = get_object_or_404(Produtos, id=produto_id)
        serializer = ProdutoSerializer(
            produto, 
            context={'request': request}  # Passa o request para o serializer
        )
        
        response_data = serializer.data
        response_data.update({
            'nota_media': produto.calcular_nota_media(),
            'avaliacoes': AvaliacaoSerializer(
                produto.avaliacao_set.all(), 
                many=True,
                context={'request': request}
            ).data,
            'avaliacao_usuario': AvaliacaoSerializer(
                produto.avaliacao_set.filter(usuario=request.user).first(),
                context={'request': request}
            ).data if request.user.is_authenticated else None
        })
        
        return Response(response_data)

class WhatsAppAPI(APIView):
    def get(self, request, produto_id):
        produto = get_object_or_404(Produtos, id=produto_id)
        numerobr = Telefone.objects.first()
        numero = getattr(numerobr, 'codigo_pais', '55') + getattr(numerobr, 'telefone', '')
        
        mensagem = f"Olá! Estou interessado no produto '{produto.nome}', que custa R${produto.preco:.2f}."
        return Response({
            'url': f'https://web.whatsapp.com/send?phone={numero}&text={quote(mensagem)}'
        })
    
class AvaliacaoAPI(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = []  # Permite acesso sem autenticação para GET

    def get_permissions(self):
        if self.request.method == 'GET':
            return []  # Sem restrições para GET
        return [IsAuthenticated()]  # Requer autenticação para outros métodos

    def get(self, request, produto_id):
        produto = get_object_or_404(Produtos, id=produto_id)
        avaliacoes = Avaliacao.objects.filter(produto=produto)
        serializer = AvaliacaoSerializer(avaliacoes, many=True)
        return Response(serializer.data)

    def post(self, request, produto_id):
        produto = get_object_or_404(Produtos, id=produto_id)
        avaliacao, created = Avaliacao.objects.update_or_create(
            usuario=request.user,
            produto=produto,
            defaults=request.data
        )
        return Response(AvaliacaoSerializer(avaliacao).data, 
                      status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

class ComentariosAPI(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request, comentario_id):
        avaliacao = get_object_or_404(Avaliacao, id=comentario_id)
        
        if request.user != avaliacao.usuario and not request.user.is_staff:
            return Response({'detail': 'Permissão negada.'}, status=status.HTTP_403_FORBIDDEN)
            
        avaliacao.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class CategoriaProdutosAPI(APIView):
    def get(self, request, categoria_nome):
        categoria = get_object_or_404(Categoria, nome=categoria_nome)
        produtos = Produtos.objects.filter(categoria=categoria)
        serializer = ProdutoSerializer(
            produtos, 
            many=True,
            context={'request': request}  # Passa o request para o serializer
        )
        return Response(serializer.data)

class UsuarioAtualAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            'id': request.user.id,
            'username': request.user.username,
            'is_staff': request.user.is_staff,
            'is_authenticated': True
        })