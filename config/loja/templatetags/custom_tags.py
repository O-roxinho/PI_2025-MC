# loja/templatetags/custom_tags.py
from django import template

register = template.Library()

@register.simple_tag
def render_estrelas(nota, total=5):
    estrelas_cheias = int(nota)
    meia_estrela = nota - estrelas_cheias >= 0.5
    estrelas_vazias = total - estrelas_cheias - int(meia_estrela)
    return '★' * estrelas_cheias + ('✬' if meia_estrela else '') + '☆' * estrelas_vazias
