#CRM/web_samsung/personal/empleado_views.py
from django.http import JsonResponse

def login_view(request):
    # Por ahora, una respuesta simple para que no falle el import
    return JsonResponse({"detalle": "Ruta de login lista"})