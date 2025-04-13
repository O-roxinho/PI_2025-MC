from rest_framework import serializers
from .models import Produtos, Categoria, Telefone

class ProdutoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produtos
        fields = '__all__'
        extra_kwargs = {
            'imagem': {'required': False}  # Torna o campo de imagem opcional
        }

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

class TelefoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Telefone
        fields = '__all__'
