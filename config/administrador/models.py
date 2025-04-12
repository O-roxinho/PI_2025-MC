from django.db import models
from django.contrib.auth.models import User

class Categoria(models.Model):
    nome = models.CharField(max_length=100)

    def __str__(self):
        return self.nome

class Produtos(models.Model):
    nome = models.CharField(max_length=200)
    descricao = models.TextField()
    preco = models.DecimalField(max_digits=10, decimal_places=2)
    imagem = models.ImageField(upload_to='produtos/')
    categoria = models.ForeignKey(Categoria, related_name='produtos', on_delete=models.CASCADE)
    estoque = models.IntegerField(default=0)

    def __str__(self):
        return self.nome
    
    def calcular_nota_media(self):
        # Pega todas as avaliações associadas a este produto
        avaliacoes = self.avaliacao_set.all()
        if avaliacoes.exists():
            # Calcula a média das notas
            total = sum(avaliacao.nota for avaliacao in avaliacoes)
            return round(total / avaliacoes.count(), 1)  # Arredonda para uma casa decimal
        return 0  # Retorna 0 caso não haja avaliações

class Telefone(models.Model):
    codigo_pais = models.CharField(max_length=3, help_text="Código do país (ex: +55)", unique=True)
    telefone = models.CharField(max_length=15, help_text="Número do telefone no formato XXXXX-XXXX", unique=True)

    def __str__(self):
        return f"{self.codigo_pais} {self.telefone}"

class Avaliacao(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    produto = models.ForeignKey(Produtos, on_delete=models.CASCADE)
    nota = models.PositiveIntegerField()  # Ex: Avaliação de 1 a 5
    comentario = models.TextField(blank=True, null=True)
    data_avaliacao = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('usuario', 'produto')

    def __str__(self):
        return f"{self.usuario} avaliou {self.produto} com {self.nota} estrelas"
