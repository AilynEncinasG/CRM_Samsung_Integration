#CRM/web_samsung/core/system_views.py
from django.http import JsonResponse
from django.db import connection
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny # O IsAuthenticated si ya manejas tokens

def estado_sistema(request):
    return JsonResponse({
        "status": "online",
        "mensaje": "El servidor Django está funcionando correctamente"
    })

@api_view(['GET'])
@permission_classes([AllowAny])  # Permite pruebas directas desde el frontend
def dashboard_stats(request):
    try:
        with connection.cursor() as cursor:
            # 1. Métricas generales: Ingresos totales y cantidad de pedidos reales
            cursor.execute("""
                SELECT 
                    ISNULL(SUM(Total), 0) as TotalVentas, 
                    COUNT(ID) as TotalPedidos 
                FROM Pedido
            """)
            res_general = cursor.fetchone()
            total_ventas = float(res_general[0])
            total_pedidos = res_general[1]

            # 2. Top 5 productos más vendidos para el gráfico de barras del Dashboard
            cursor.execute("""
                SELECT TOP 5 
                    p.Nombre, 
                    SUM(dp.Cantidad) as UnidadesVendidas
                FROM DetallePedido dp
                JOIN Producto p ON dp.ProductoID = p.ID
                GROUP BY p.Nombre
                ORDER BY UnidadesVendidas DESC
            """)
            columnas_top = [col[0] for col in cursor.description]
            top_productos = [dict(zip(columnas_top, row)) for row in cursor.fetchall()]

            # 3. Alertas de Stock Crítico (Menos de 10 unidades en algún almacén)
            cursor.execute("""
                SELECT 
                    p.Nombre as Producto, 
                    a.NombreAlmacen as Almacen, 
                    sa.StockTotal as Stock
                FROM StockAlmacen sa
                JOIN Producto p ON sa.ProductoID = p.ID
                JOIN Almacen a ON sa.AlmacenID = a.ID
                WHERE sa.StockTotal < 10
                ORDER BY sa.StockTotal ASC
            """)
            columnas_stock = [col[0] for col in cursor.description]
            stock_critico = [dict(zip(columnas_stock, row)) for row in cursor.fetchall()]

            # 4. Rendimiento financiero y operativo por Tienda física
            cursor.execute("""
                SELECT 
                    t.NombreTienda, 
                    COUNT(p.ID) as PedidosAtendidos, 
                    ISNULL(SUM(p.Total), 0) as TotalFacturado
                FROM Pedido p
                JOIN Almacen a ON p.AlmacenOrigenID = a.ID
                JOIN Tienda t ON a.TiendaID = t.ID
                GROUP BY t.NombreTienda
            """)
            columnas_tiendas = [col[0] for col in cursor.description]
            resumen_tiendas = [dict(zip(columnas_tiendas, row)) for row in cursor.fetchall()]

        # Respuesta estructurada para mapear fácilmente en React
        return JsonResponse({
            'status': 'success',
            'data': {
                'metricas_generales': {
                    'total_ventas': total_ventas,
                    'total_pedidos': total_pedidos
                },
                'top_productos': top_productos,
                'stock_critico': stock_critico,
                'resumen_tiendas': resumen_tiendas
            }
        }, status=200)

    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)