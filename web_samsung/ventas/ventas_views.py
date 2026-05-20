# web_samsung/ventas/ventas_views.py
from django.db import connections
from django.http import JsonResponse
from rest_framework.decorators import api_view

@api_view(['GET'])
def get_dw_sales_summary(request):
    try:
        with connections['dw_samsung'].cursor() as cursor:
            # Corregido: Fact_Ventas_Global e IngresoBruto según tu script OLAP
            cursor.execute("""
                SELECT 
                    ISNULL(SUM(IngresoBruto), 0) as TotalVentas, 
                    COUNT(*) as TotalPedidos 
                FROM Fact_Ventas_Global
            """)
            row = cursor.fetchone()
            
            data = {
                "total_ventas": float(row[0]) if row[0] is not None else 0.0,
                "total_productos": row[1] if row[1] is not None else 0, # Mapeado para las estadísticas de React
                "status": "success"
            }
        return JsonResponse(data)
    except Exception as e:
        print(f"ERROR CRÍTICO EN DATA WAREHOUSE VENTAS: {e}")
        return JsonResponse({
            "total_ventas": 0.0,
            "total_productos": 0,
            "status": "error",
            "message": str(e)
        }, status=500)