from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Favorito
from .serializers import FavoritoSerializer

# Create your views here.

class FavoritoViewSet(viewsets.ModelViewSet):
    serializer_class = FavoritoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Favorito.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

    @action(detail=False, methods=['get'])
    def verificar(self, request):
        produto_id = request.query_params.get('produto_id')
        if not produto_id:
            return Response({'error': 'produto_id é obrigatório'}, status=status.HTTP_400_BAD_REQUEST)
        
        favorito = Favorito.objects.filter(
            usuario=request.user,
            produto_id=produto_id
        ).exists()
        
        return Response({'favorito': favorito})

    @action(detail=False, methods=['delete'])
    def remover_por_produto(self, request):
        produto_id = request.query_params.get('produto_id')
        if not produto_id:
            return Response({'error': 'produto_id é obrigatório'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            favorito = Favorito.objects.get(
                usuario=request.user,
                produto_id=produto_id
            )
            favorito.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Favorito.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
