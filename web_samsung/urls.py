"""
URL configuration for web_samsung project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from web_samsung.views import estado_sistema, get_samsung_products, get_dw_sales_summary, login_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/estado/', estado_sistema),
    path('api/login/', login_view),
    path('api/productos/', get_samsung_products),
    path('api/ventas-resumen/', get_dw_sales_summary),
]
