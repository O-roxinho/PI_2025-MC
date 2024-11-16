from django.urls import path
from . import views

urlpatterns = [
    path('login', views.Login),
    path('Registrar', views.register, name='Registrar'),
]
