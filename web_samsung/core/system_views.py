#CRM/web_samsung/core/system_views.py
from django.http import JsonResponse

def estado_sistema(request):
    return JsonResponse({
        "status": "online",
        "mensaje": "El servidor Django está funcionando correctamente"
    })