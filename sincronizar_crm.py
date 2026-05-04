import xmlrpc.client
import pyodbc

# 1. Configuración de Odoo
url = 'http://localhost:8069'
db_odoo = 'samsung_crm'
username = 'aylinzomber@gmail.com' 
password = '160305Encinas+'

sql_config = (
    "Driver={ODBC Driver 17 for SQL Server};"
    "Server=localhost,1433;"
    "Database=samsung_electronics;"
    "UID=sa;"
    "PWD=160305Encinas+;"
    "Encrypt=no;"
)

def conectar_odoo():
    common = xmlrpc.client.ServerProxy(f'{url}/xmlrpc/2/common')
    uid = common.authenticate(db_odoo, username, password, {})
    models = xmlrpc.client.ServerProxy(f'{url}/xmlrpc/2/object')
    return uid, models

def sincronizar():
    print("Iniciando sincronización...")
    uid, models = conectar_odoo()
    
    # Conectar a SQL Server en Docker
    conn = pyodbc.connect(sql_config)
    cursor = conn.cursor()
    
    # AJUSTE: Usamos los nombres reales de tus columnas (Nombre, Apellidos, Email, Movil)
    cursor.execute("SELECT Nombre, Apellidos, Email, Movil FROM Cliente")
    clientes = cursor.fetchall()

    for row in clientes:
        # Unimos nombre y apellido para el campo 'name' de Odoo
        nombre_completo = f"{row.Nombre} {row.Apellidos}"
        
        # Crear el cliente en Odoo (modelo res.partner)
        cliente_id = models.execute_kw(db_odoo, uid, password, 'res.partner', 'create', [{
            'name': nombre_completo,
            'email': row.Email,
            'phone': row.Movil,
            'comment': 'Sincronizado desde SQL Server Samsung (Docker)'
        }])
        print(f"✅ Cliente {nombre_completo} creado en Odoo con ID: {cliente_id}")

    conn.close()

if __name__ == "__main__":
    try:
        sincronizar()
    except Exception as e:
        print(f"❌ Error durante la sincronización: {e}")