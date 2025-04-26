from rest_framework import serializers
from .models import Favorito
from loja.serializers import ProdutoSerializer

class FavoritoSerializer(serializers.ModelSerializer):
    produto = ProdutoSerializer(read_only=True)
    produto_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Favorito
        fields = ['id', 'produto', 'produto_id', 'data_adicao']
        read_only_fields = ['id', 'data_adicao'] 