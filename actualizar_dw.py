import pyodbc

# Configuración de conexión (usando tus credenciales de Docker)
sql_config = (
    "Driver={ODBC Driver 17 for SQL Server};"
    "Server=localhost,1433;"
    "UID=sa;"
    "PWD=160305Encinas+;"
    "Encrypt=no;"
    "TrustServerCertificate=yes;"
)

def actualizar_data_warehouse():
    try:
        conn = pyodbc.connect(sql_config)
        cursor = conn.cursor()
        
        print("🚀 Iniciando proceso ETL hacia DW_Samsung...")

        # 1. EXTRACCIÓN de la base transaccional
        cursor.execute("SELECT Nombre, Apellidos, Email, Movil FROM samsung_electronics.dbo.Cliente")
        clientes = cursor.fetchall()

        # 2. CARGA (Load) al Data Warehouse
        # Nota: Asegúrate de que la tabla 'Dim_Cliente' exista en DW_Samsung
        for row in clientes:
            cursor.execute("""
                IF NOT EXISTS (SELECT 1 FROM DW_Samsung.dbo.Dim_Cliente WHERE Email = ?)
                BEGIN
                    INSERT INTO DW_Samsung.dbo.Dim_Cliente (Nombre, Apellidos, Email, Telefono)
                    VALUES (?, ?, ?, ?)
                END
            """, (row.Email, row.Nombre, row.Apellidos, row.Email, row.Movil))
        
        conn.commit()
        print(f"✅ Se han procesado {len(clientes)} registros hacia el Data Warehouse.")
        
    except Exception as e:
        print(f"❌ Error en el proceso ETL: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    actualizar_data_warehouse()