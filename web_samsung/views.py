from django.http import JsonResponse
from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import csrf_exempt
from django.db import connection
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

# 1. Obtener productos de la tabla real de Samsung
def get_samsung_products(request):
    with connection.cursor() as cursor:
        query = """
            SELECT p.Nombre, p.Precio, c.NombreCategoria, a.NombreAlmacen
            FROM Producto p
            JOIN Categoria c ON p.CategoriaID = c.ID
            JOIN Almacen a ON p.AlmacenID = a.ID
        """
        cursor.execute(query)
        rows = cursor.fetchall()
        
        productos = [
            {
                "nombre": row[0],
                "precio": float(row[1]),
                "categoria": row[2],
                "almacen": row[3]
            } for row in rows
        ]
            
    return JsonResponse({"productos": productos})

# 2. Obtener métricas del Data Warehouse (DW_Samsung)
def get_dw_sales_summary(request):
    with connection.cursor() as cursor:
        cursor.execute("USE DW_Samsung;")
        
        cursor.execute("""
            SELECT 
                SUM(MontoTotalPedido) as TotalVentas, 
                SUM(Cantidad) as TotalProductos 
            FROM Fact_Ventas
        """)
        row = cursor.fetchone()
        
    
        cursor.execute("USE samsung_electronics;")
        
        stats = {
            "total_ventas": float(row[0]) if row[0] else 0,
            "total_productos": row[1] if row[1] else 0,
        }
            
    return JsonResponse(stats)