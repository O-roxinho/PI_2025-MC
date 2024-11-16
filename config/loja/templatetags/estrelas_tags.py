from django import template

register = template.Library()

@register.simple_tag
def render_classificacao(nota, total=5):
    icones_classificacao = []
    for i in range(1, total + 1):
        if i <= int(nota):
            icones_classificacao.append('cheio')
        elif i - nota <= 0.5:
            icones_classificacao.append('meio')
        else:
            icones_classificacao.append('vazio')
    return icones_classificacao
