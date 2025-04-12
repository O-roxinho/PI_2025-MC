from rest_framework import serializers
from administrador.models import Produtos, Categoria, Avaliacao

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nome']

class ProdutoSerializer(serializers.ModelSerializer):
    categoria = CategoriaSerializer()
    imagem_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Produtos
        fields = [
            'id', 
            'nome', 
            'descricao', 
            'preco', 
            'imagem_url', 
            'categoria', 
            'estoque',
        ]

    def get_imagem_url(self, obj):
        request = self.context.get('request')
        if obj.imagem:
            return request.build_absolute_uri(obj.imagem.url)
        return None

class AvaliacaoSerializer(serializers.ModelSerializer):
    usuario = serializers.SerializerMethodField()
    usuario_id = serializers.SerializerMethodField()
    

    class Meta:
        model = Avaliacao
        fields = [
            'id',
            'usuario',
            'usuario_id', 
            'nota', 
            'comentario', 
            'data_avaliacao'  
        ]

    def get_usuario(self, obj):
        return obj.usuario.username if obj.usuario else 'Anônimo'

    def get_usuario_id(self, obj):
        return obj.usuario.id if obj.usuario else None