# web_samsung/ventas/ventas_views.py
from django.db import connections
from django.http import JsonResponse
from rest_framework.decorators import api_view

@api_view(['GET'])
def get_dw_sales_summary(request):
    try:
        # Forzamos el uso de la conexión al Data Warehouse
        with connections['dw_samsung'].cursor() as cursor:
            # Tu consulta de BI
            cursor.execute("""
                SELECT 
                    ISNULL(SUM(MontoTotal), 0) as TotalVentas, 
                    COUNT(*) as TotalPedidos 
                FROM Fact_Ventas
            """)
            row = cursor.fetchone()
            
            data = {
                "total_ventas": float(row[0]),
                "total_pedidos": row[1],
                "status": "success"
            }
        return JsonResponse(data)
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)