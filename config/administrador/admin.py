from django.contrib import admin
from .models import Telefone, Produtos, Categoria


@admin.register(Telefone)
class TelefoneAdmin(admin.ModelAdmin):
    list_display = ['id', 'codigo_pais', 'telefone']
    search_fields = ['codigo_pais', 'telefone']

@admin.register(Produtos)
class ProdutosAdmin(admin.ModelAdmin):
    list_display = ['id', 'nome', 'preco', 'categoria', 'estoque']
    list_filter = ['categoria']
    search_fields = ['nome', 'descricao']
    readonly_fields = ['calcular_nota_media']

@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ['id', 'nome']
    search_fields = ['nome']


