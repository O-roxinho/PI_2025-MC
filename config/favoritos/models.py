from django.db import models
from django.contrib.auth.models import User
from administrador.models import Produtos

class Favorito(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    produto = models.ForeignKey(Produtos, on_delete=models.CASCADE)
    data_adicao = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('usuario', 'produto')
        ordering = ['-data_adicao']

    def __str__(self):
        return f"{self.usuario.username} - {self.produto.nome}"
