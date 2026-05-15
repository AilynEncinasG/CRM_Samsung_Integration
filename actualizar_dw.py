#CRM/actualizar_dw.py
import pyodbc
from datetime import datetime

sql_config = (
    "Driver={ODBC Driver 17 for SQL Server};"
    "Server=localhost,1433;"
    "UID=sa;"
    "PWD=160305Encinas+;"
    "Encrypt=no;"
    "TrustServerCertificate=yes;"
)

def ejecutar_etl():
    try:
        conn = pyodbc.connect(sql_config)
        cursor = conn.cursor()
        print("🚀 Sincronizando dimensiones y hechos...")

        # --- 1. Sincronizar Dim_Cliente ---
        cursor.execute("""
            INSERT INTO DW_Samsung.dbo.Dim_Cliente (ID_Original, NombreCompleto, Email, Segmento)
            SELECT ID, Nombre + ' ' + Apellidos, Email, Segmento 
            FROM samsung_electronics.dbo.Cliente c
            WHERE NOT EXISTS (SELECT 1 FROM DW_Samsung.dbo.Dim_Cliente WHERE ID_Original = c.ID)
        """)

        # --- 2. Sincronizar Dim_Producto ---
        cursor.execute("""
            INSERT INTO DW_Samsung.dbo.Dim_Producto (ID_Original, NombreProducto, Categoria, Gama)
            SELECT p.ID, p.Nombre, cat.NombreCategoria, p.Gama
            FROM samsung_electronics.dbo.Producto p
            JOIN samsung_electronics.dbo.Categoria cat ON p.CategoriaID = cat.ID
            WHERE NOT EXISTS (SELECT 1 FROM DW_Samsung.dbo.Dim_Producto WHERE ID_Original = p.ID)
        """)

        # --- 3. Carga de Fact_Ventas_Global (La "Mortal") ---
        # Este query busca las llaves del DW basándose en los IDs de la transaccional
        cursor.execute("""
            INSERT INTO DW_Samsung.dbo.Fact_Ventas_Global 
            (FechaKey, ClienteKey, ProductoKey, EmpleadoKey, LogisticaKey, 
             CantidadVendida, IngresoBruto, CostoTotalLote, PuntajeSatisfaccion, 
             ErrorEnPedido, TiempoEntregaDias, EsCapacitado)
            
            SELECT 
                CONVERT(VARCHAR(8), p.FechaPedido, 112) AS FechaKey,
                dc.ClienteKey,
                dp.ProductoKey,
                (SELECT EmpleadoKey FROM DW_Samsung.dbo.Dim_Empleado WHERE ID_Original = p.EmpleadoID), -- Ejemplo simple
                1, -- Aquí podrías mapear a Dim_Logistica
                det.Cantidad,
                (det.Cantidad * det.PrecioUnitarioVenta),
                (det.Cantidad * det.CostoUnitarioHistorico),
                p.SatisfaccionCliente,
                p.ErrorEnOrden,
                DATEDIFF(DAY, p.FechaPedido, p.FechaEntregaReal),
                e.Capacitado
            FROM samsung_electronics.dbo.Pedido p
            JOIN samsung_electronics.dbo.DetallePedido det ON p.ID = det.PedidoID
            JOIN samsung_electronics.dbo.Empleado e ON p.EmpleadoID = e.ID
            JOIN DW_Samsung.dbo.Dim_Cliente dc ON p.ClienteID = dc.ID_Original
            JOIN DW_Samsung.dbo.Dim_Producto dp ON det.ProductoID = dp.ID_Original
            WHERE NOT EXISTS (
                SELECT 1 FROM DW_Samsung.dbo.Fact_Ventas_Global f 
                WHERE f.FechaKey = CONVERT(VARCHAR(8), p.FechaPedido, 112) 
                AND f.IngresoBruto = (det.Cantidad * det.PrecioUnitarioVenta) -- Evitar duplicados simples
            )
        """)

        conn.commit()
        print("✅ ETL completado con éxito. DW actualizado.")

    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    ejecutar_etl()