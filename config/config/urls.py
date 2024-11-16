from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [
    path('admin/', admin.site.urls),
    path('administrador/', include('administrador.urls')),  
    path('administrador/', include('login.urls')),  
    path('', include('loja.urls')),
    path('home/', include('loja.urls'))
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
