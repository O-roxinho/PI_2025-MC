from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated  
from .serializers import RegisterSerializer, UserSerializer

class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        try:
            user = User.objects.get(email=email)
            user = authenticate(username=user.username, password=password)

            if user:
                login(request, user)
                token, created = Token.objects.get_or_create(user=user)

                return Response({
                    "mensagem": "Login realizado com sucesso!",
                    "token": token.key,
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                        "is_superuser": user.is_superuser  # <- Retorna se é superusuário
                    }
                }, status=status.HTTP_200_OK)
            
            return Response({"mensagem": "Credenciais inválidas"}, status=status.HTTP_400_BAD_REQUEST)

        except User.DoesNotExist:
            return Response({"mensagem": "Usuário não encontrado"}, status=status.HTTP_404_NOT_FOUND)


class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({"mensagem": "Logout realizado com sucesso"}, status=status.HTTP_200_OK)


class RegisterAPI(APIView):
    def post(self, request):
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")

        # Verifica se já existe um usuário com o mesmo email
        if User.objects.filter(email=email).exists():
            return Response({"mensagem": "Já existe um cadastro com este email."}, status=status.HTTP_400_BAD_REQUEST)

        # Verifica se já existe um usuário com o mesmo username
        if User.objects.filter(username=username).exists():
            return Response({"mensagem": "Nome de usuário já está em uso."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Cria o usuário
            user = User.objects.create_user(username=username, email=email, password=password)
            user.save()

            # Autentica automaticamente
            login(request, user)

            # Cria um token para o usuário
            token, created = Token.objects.get_or_create(user=user)

            return Response({"mensagem": "Cadastro realizado com sucesso!","user": { 
                        "username": user.username,
                    }, "token": token.key}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"mensagem": f"Ocorreu um erro ao tentar registrar: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class UserInfoAPI(APIView):
    permission_classes = [IsAuthenticated]  # Só acessa se estiver autenticado

    def get(self, request):
        user = request.user  # Obtém o usuário do token
        
        return Response({
            "is_superuser": user.is_superuser,
        }, status=status.HTTP_200_OK)