from django.http import JsonResponse

def estado_sistema(request):
    datos = {
        "sistema": "Integración Samsung & Data Warehouse",
        "estado": "Activo",
        "universidad": "Univalle",
        "tecnologias": ["Odoo", "SQL Server", "Django", "React"]
    }
    return JsonResponse(datos)