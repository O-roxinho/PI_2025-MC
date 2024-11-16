from django.shortcuts import render, redirect, get_object_or_404
from django.template import loader
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse

def Login(request):
    if request.method == 'GET':
        status = request.GET.get('status')
        if request.user.is_authenticated:
            logout(request)
        return render(request, 'login.html', {'status': status})
    
    elif request.method == 'POST':
        email_digitado = request.POST.get('email')
        senha_digitada = request.POST.get('password')

        try:
            # Busca o usuário pelo email
            user = User.objects.get(email=email_digitado)
                
            # Autentica o usuário pelo nome de usuário e senha
            user = authenticate(username=user.username, password=senha_digitada)
            
            if user:
                login(request, user)
                
                # Redireciona conforme o nível de acesso
                if user.is_staff or user.is_superuser:
                    return redirect('/administrador/cadastrar')
                
                return redirect('/')
                # Senha incorreta
            return redirect('/administrador/login?status=1')
        
        except User.DoesNotExist:
            # Email não encontrado
            return redirect('/administrador/login?status=2')
        


def register(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')

        # Verifica se já existe um usuário com o mesmo email
        if User.objects.filter(email=email).exists():
            mensagem = "Já existe esse cadastro com este email."
            return JsonResponse({'mensagem': mensagem}, status=400)
        # Verifica se já existe um usuário com o mesmo username
        if User.objects.filter(username=username).exists():
            mensagem = "Nome de usuário já está em uso."
            return JsonResponse({'mensagem': mensagem}, status=400)
        
        try:
            # Cria o usuário com email e senha
            user = User.objects.create_user(username=username, email=email, password=password)
            user.save()
        except Exception as e:
            # Caso algum erro inesperado ocorra
            mensagem = f"Ocorreu um erro ao tentar registrar: {str(e)}"
            return JsonResponse({'mensagem': mensagem}, status=500)
        
        # Autentica o usuário e redireciona para a loja
        login(request, user)
        return JsonResponse({'mensagem': 'Cadastro realizado com sucesso!'}, status=200)

   


# usuario = User.objects.get(username='nome_do_usuario')

# # Define permissões de administrador
# usuario.is_staff = True    # Dá permissão para acessar o painel de administração
# usuario.is_superuser = True  # Dá todas as permissões administrativas
# usuario.save()