from rest_framework import serializers
from .models import Carrinho, ItemCarrinho
from administrador.models import Produtos, Categoria

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nome']

class ProdutoSerializer(serializers.ModelSerializer):
    imagem_url = serializers.SerializerMethodField()
    categoria = CategoriaSerializer()
    
    class Meta:
        model = Produtos
        fields = ['id', 'nome', 'descricao', 'preco', 'imagem_url', 'categoria', 'estoque']

    def get_imagem_url(self, obj):
        request = self.context.get('request')
        if obj.imagem:
            return request.build_absolute_uri(obj.imagem.url)
        return None

class ItemCarrinhoSerializer(serializers.ModelSerializer):
    produto = ProdutoSerializer()
    
    class Meta:
        model = ItemCarrinho
        fields = ['id', 'produto', 'quantidade', 'adicionado_em']

class CarrinhoSerializer(serializers.ModelSerializer):
    itens = ItemCarrinhoSerializer(many=True, read_only=True)
    total = serializers.SerializerMethodField()

    class Meta:
        model = Carrinho
        fields = ['id', 'itens', 'total', 'criado_em']

    def get_total(self, obj):
        return sum(item.produto.preco * item.quantidade for item in obj.itens.all())