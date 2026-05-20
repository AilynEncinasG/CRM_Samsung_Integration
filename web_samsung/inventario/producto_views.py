# web_samsung/inventario/producto_views.py
from django.http import JsonResponse
from django.db import connection

def get_samsung_products(request):
    try:
        with connection.cursor() as cursor:
            # Consulta estructurada con los nombres reales de tu script SQL
            query = """
                SELECT p.Nombre, p.PrecioVentaSugerido, c.NombreCategoria, a.NombreAlmacen
                FROM Producto p
                LEFT JOIN Categoria c ON p.CategoriaID = c.ID
                LEFT JOIN StockAlmacen sa ON p.ID = sa.ProductoID
                LEFT JOIN Almacen a ON sa.AlmacenID = a.ID
            """
            cursor.execute(query)
            rows = cursor.fetchall()
            
            productos = [{
                "nombre": row[0],
                "precio": float(row[1]) if row[1] is not None else 0.0,
                "categoria": row[2] if row[2] else "Sin Categoría",
                "almacen": row[3] if row[3] else "Sin Almacén"
            } for row in rows]
                
        return JsonResponse({"productos": productos})
    except Exception as e:
        print(f"ERROR CRÍTICO EN PRODUCTOS: {e}")
        return JsonResponse({"error": str(e), "productos": []}, status=500)