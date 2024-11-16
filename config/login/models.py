from django.db import models

# Create your models here.
class Verificar(models.Model):
  usuario = models.CharField(max_length=240)
  senha = models.CharField(max_length=240)