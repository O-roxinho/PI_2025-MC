from django.shortcuts import render, redirect, get_object_or_404
from .models import Produtos, Categoria, Telefone
import os
from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse

@login_required(login_url='/administrador/login')
def cadastrar(request):
    if request.user.is_staff or request.user.is_superuser:
        if request.method == "GET":
            cadastrar = request.GET.get('cadastrar')
            status = request.GET.get('status')       
            categorias = Categoria.objects.all()
            return render(request, 'cadastrar.html', {'categorias': categorias,
                                                    'status' : status,
                                                    'cadastrar_' : cadastrar,
                                                    })
        elif request.method == "POST":
            # Pega os dados do formulário:
            nome = request.POST.get('nome')
            descricao = request.POST.get('descricao')
            preco = request.POST.get('preco')
            imagem = request.FILES.get('imagem')
            categoria_id = request.POST.get('categoria')
            estoque = request.POST.get('estoque')
            add_categoria = request.POST.get('add_categoria')
            remover_categoria = request.POST.get('remover_categoria')
            telefone = request.POST.get('telefone')

            if all([nome, descricao, preco, categoria_id, estoque]):
                
                categoria = get_object_or_404(Categoria, id=categoria_id)

                prod = Produtos(nome=nome,
                                descricao=descricao,
                                preco=preco,
                                imagem=imagem,
                                categoria=categoria,
                                estoque=estoque
                                )
                prod.save()
                return redirect('/administrador/cadastrar?status=1')
            elif all([add_categoria]):
                verificar_categoria = Categoria.objects.filter(nome=add_categoria).exists()
                if verificar_categoria:
                    return redirect('/administrador/cadastrar?status=1000' )    
                salvar = Categoria(nome=add_categoria)
                salvar.save()
                return redirect('/administrador/cadastrar?status=2' )
            
            elif all([remover_categoria]):   
                categoria_exist = Categoria.objects.filter(nome=remover_categoria).exists()
                if categoria_exist:
                    categoria = Categoria.objects.get(nome=remover_categoria)
                    categoria.delete()
                    return redirect('/administrador/cadastrar?status=3' )
                    
                return redirect('/administrador/cadastrar?status=4' )
            elif all([telefone]):  
            #telefone = request.POST.get('telefone')
             return redirect('/administrador/cadastrar?status=22' )
            else:
                return redirect('/administrador/cadastrar')
    else:
        return redirect('/')
@login_required(login_url='/administrador/login')
def tabela(request):
    if request.user.is_staff or request.user.is_superuser:
        if request.method == "GET":
            produtos = Produtos.objects.all()
            categorias = Categoria.objects.prefetch_related('produtos').all()  
            return render(request, 'produtos.html', {'produtos' : produtos,
                                                    'categorias': categorias})
    else:
        return redirect('/')
@login_required(login_url='/administrador/login')
def excluir(request, id):
    if request.user.is_staff or request.user.is_superuser:
        produto = get_object_or_404(Produtos, id=id)
        if produto.imagem:
            # Monta o caminho completo da imagem
            imagem_path = os.path.join(settings.MEDIA_ROOT, str(produto.imagem))
            if os.path.exists(imagem_path):
                os.remove(imagem_path)
        produto.delete()
        return redirect('/administrador/produtos')
    else:
        return redirect('/')
@login_required(login_url='/administrador/login')
def atualizar(request, id):
    if request.user.is_staff or request.user.is_superuser:
        # Pega os dados do banco de dados:
        if request.method == "GET":
            produto = get_object_or_404(Produtos, id=id)
            nome = produto.nome
            descricao = produto.descricao
            preco = produto.preco
            imagem = produto.imagem
            categoria = produto.categoria
            estoque = produto.estoque
            status = request.GET.get('status')
            categorias = Categoria.objects.all()

            preco_formatado = str(produto.preco).replace(',', '.')
            return render(request, 'cadastrar.html', {'categorias': categorias,
                                                        'status' : status,
                                                        'nome' : nome,
                                                        'descricao': descricao,
                                                        'preco': preco_formatado,
                                                        'imagem' : imagem.name,
                                                        'categoria_': produto.categoria,
                                                        'estoque' : estoque,
                                                        'id_' : id
                                                        })           
                                                        
        elif request.method == "POST":
        # Pega os dados do formulário: 
            nome = request.POST.get('nome')
            descricao = request.POST.get('descricao')
            preco = request.POST.get('preco')
            imagem = request.FILES.get('imagem')
            categoria_id = request.POST.get('categoria')
            estoque = request.POST.get('estoque')

            if all([nome, descricao, preco, categoria_id, estoque]):           
                categoria = get_object_or_404(Categoria, id=categoria_id)
                x = get_object_or_404(Produtos, id=id)
                if imagem:
                    if x.imagem:
                        # Monta o caminho completo da imagem
                        imagem_path = os.path.join(settings.MEDIA_ROOT, str(x.imagem))
                        if os.path.exists(imagem_path):
                            os.remove(imagem_path)
                    x.imagem = imagem

                x.nome = nome
                x.descricao = descricao
                x.preco = preco
                x.categoria = categoria
                x.estoque = estoque
                x.save()   
                return redirect('/administrador/produtos')
    else:
        return redirect('/')
@login_required(login_url='/administrador/login')    
def numeros(request):
    if request.user.is_staff or request.user.is_superuser:
        if request.method == "POST":
            codigo_pais = request.POST.get("codigo_pais")
            telefone = request.POST.get("telefone")
            status = request.GET.get('status') 
            # Busca o registro de Telefone, ou cria um novo se não existir
            telefone_obj, created = Telefone.objects.get_or_create(id=1)  # id=1 para garantir um único registro

            # Atualiza o código do país e o número do telefone
            telefone_obj.codigo_pais = codigo_pais
            telefone_obj.telefone = telefone
            telefone_obj.save()

            return redirect('/administrador/cadastrar?status=22' ,{ 'status': status})

        return render(request, "cadastrar.html")
    return redirect('/administrador/login')