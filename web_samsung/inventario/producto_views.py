#web_samsung/inventario/producto_views.py
from django.http import JsonResponse
from django.db import connection

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
        
        productos = [{
            "nombre": row[0],
            "precio": float(row[1]),
            "categoria": row[2],
            "almacen": row[3]
        } for row in rows]
            
    return JsonResponse({"productos": productos})