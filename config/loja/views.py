from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse, HttpResponse
from administrador.models import Produtos, Categoria , Telefone, Avaliacao
import random
from django.db.models import Count
from .codigo_zap import codigo as enviar_zapimg
from django.contrib.auth.models import User

def main(request):
    if request.method == "GET":
        categorias = list(Categoria.objects.annotate(num_produtos=Count('produtos')).filter(num_produtos__gt=0))
        random.shuffle(categorias)
    
        for categoria in categorias:
        # Pega 10 produtos aleatórios de cada categoria
         categoria.produtos_limited = categoria.produtos.order_by('?')[:10]


        if request.user.is_authenticated:
          nome_usuario = request.user.username  # Aqui, você pode usar .first_name ou .email também
        else:
            nome_usuario = 'não conectado'
        return render(request, 'pagina.html', {'categorias': categorias,
                                               'nome_usuario': nome_usuario})
        
def buscar_sugestoes_ajax(request):
    query = request.GET.get('query', '')  # Captura o termo digitado
    resultados = []

    if query:
        produtos = Produtos.objects.filter(
            nome__icontains=query
        ) | Produtos.objects.filter(
            descricao__icontains=query
        )

        # Formatando os produtos em uma lista de dicionários
        resultados = [
            {
                'nome': produto.nome,
                'imagem_url': produto.imagem.url,  # URL da imagem
                'preco': str(produto.preco),       # Convertendo Decimal para string
                'id': produto.id                   # ID do produto para linkar à página
            } for produto in produtos
        ]

    return JsonResponse(resultados, safe=False)


def enviar_produto_whatsapp(request, produto_id):
    if request.method == "GET":
        produto = get_object_or_404(Produtos, id=produto_id)

        # Define a mensagem e o numero e a imagem
                
        mensagem = f"Olá! Estou interessado no produto '{produto.nome}', que custa R${produto.preco:.2f}. Pode me dar mais informações?"
        # Tenta buscar o único registro de telefone
        try:
            numerobr = Telefone.objects.get(id=1)  # Obtém o registro com id=1
            numero = numerobr.codigo_pais + numerobr.telefone
        except:
            print("Nenhum número de telefone encontrado.")

        imagen = produto.imagem
        enviar_zapimg.sendwhats_image(numero, imagen, mensagem, 20)
        return HttpResponse(status=204)


from django.contrib.auth.decorators import login_required


def produto_detalhes(request, produto_id):
    produto = get_object_or_404(Produtos, id=produto_id)
    nota_media = produto.calcular_nota_media()
    avaliacoes = produto.avaliacao_set.all()

    if request.user.is_authenticated:
        nome_usuario = request.user.username
    else:
        nome_usuario = 'não conectado'

    # Verifica se o usuário já fez uma avaliação para este produto
    avaliacao_usuario = None
    if request.user.is_authenticated:
        avaliacao_usuario = Avaliacao.objects.filter(usuario=request.user, produto=produto).first()

    return render(request, 'produto.html', {
        'produto': produto,
        'nota_media': nota_media,
        'avaliacoes': avaliacoes,
        'avaliacao_usuario': avaliacao_usuario,
        'nome_usuario': nome_usuario,
        'id': produto_id
    })

@login_required
def avaliar_produto(request, produto_id):
    produto = get_object_or_404(Produtos, id=produto_id)
    nota = int(request.POST.get('nota'))
    comentario = request.POST.get('comentario', '')

    # Cria ou atualiza a avaliação do usuário
    avaliacao, created = Avaliacao.objects.update_or_create(
        usuario=request.user,
        produto=produto,
        defaults={'nota': nota, 'comentario': comentario}
    )

    # Retorna uma mensagem com sucesso ou erro
    if created:
        mensagem = "Avaliação criada com sucesso!"
    else:
        mensagem = "Avaliação atualizada com sucesso!"

    # Retorna uma resposta JSON para o AJAX no frontend
    return JsonResponse({'mensagem': mensagem, 'nota': avaliacao.nota, 'comentario': avaliacao.comentario})

from django.template.loader import render_to_string

def carregar_avaliacoes(request, produto_id):
    produto = get_object_or_404(Produtos, id=produto_id)
    avaliacoes = produto.avaliacao_set.all()
    html = render_to_string('comentarios.html', {'avaliacoes': avaliacoes, 'user': request.user})
    return JsonResponse({'html': html})
    


from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def excluir_comentario(request, comentario_id):
    if request.method == 'DELETE':
        # Obtém a avaliação
        avaliacao = get_object_or_404(Avaliacao, id=comentario_id)

        # Verifica se o usuário logado é o autor ou administrador
        if request.user == avaliacao.usuario or request.user.is_staff:
            avaliacao.delete()
            return JsonResponse({'success': True})

        return JsonResponse({'success': False, 'message': 'Sem permissão para excluir.'}, status=403)

    return JsonResponse({'success': False, 'message': 'Método não permitido.'}, status=405)

