from django.http import JsonResponse
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

def estado_sistema(request):
    datos = {
        "sistema": "Integración Samsung & Data Warehouse",
        "estado": "Activo",
        "universidad": "Univalle",
        "tecnologias": ["Odoo", "SQL Server", "Django", "React"]
    }
    return JsonResponse(datos)

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        
        if username == "admin_samsung" and password == "samsung2026":
            return JsonResponse({"message": "Bienvenido al Portal Samsung", "success": True})
        else:
            return JsonResponse({"message": "Credenciales inválidas", "success": False}, status=401)