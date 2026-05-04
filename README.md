# Sistema de Integración CRM Samsung & Data Warehouse 🚀

Este proyecto implementa una arquitectura robusta de datos utilizando **Docker**, integrando un flujo de trabajo entre **Odoo CRM**, una base de datos transaccional **SQL Server** y un **Data Warehouse** con procesos **ETL automatizados**.

## 🏗️ Arquitectura del Sistema

El ecosistema completo vive dentro de contenedores Docker, asegurando portabilidad y consistencia:

1.  **Odoo 17 (CRM):** Gestión de relaciones con clientes.
2.  **SQL Server 2022:** 
    *   `samsung_electronics`: Base de datos transaccional (OLTP).
    *   `DW_Samsung`: Almacén de datos para analítica (OLAP).
3.  **Python Integration:** Script para sincronizar datos entre Odoo y SQL Server vía XML-RPC y pyodbc.
4.  **SQL Server Agent:** Automatización interna para el movimiento de datos (ETL) hacia el Data Warehouse.

---

## 🛠️ Tecnologías Utilizadas

*   **Contenedores:** Docker & Docker Compose.
*   **Base de Datos:** Microsoft SQL Server, PostgreSQL (para Odoo).
*   **ERP/CRM:** Odoo 17.
*   **Lenguajes:** Python 3.x, T-SQL.
*   **Lógica ETL:** Stored Procedures y SQL Jobs.

---

## 🚀 Guía de Inicio Rápido

### 1. Levantar la Infraestructura
Desde la carpeta raíz, ejecuta:
```bash
docker-compose up -d
```
### 2. Configuración de Odoo
```bash
Acceder a http://localhost:8069.
```
Crear base de datos: ```bash samsung_crm ```

Instalar el módulo de Contactos.

### 3. Inicialización de la Base de Datos y DW
Para crear las tablas, relaciones y el Data Warehouse, ejecuta el script SQL:
```PowerShell
docker exec -it crm-sqlserver-1 /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P '160305Encinas+' -C -Q "$(Get-Content completo_samsung.sql -Raw)"
```
### 4. Sincronización de Datos
Ejecuta el script de integración para migrar registros desde Odoo hacia SQL Server:

```bash
python sincronizar_crm.py
```
### 🤖 Automatización ETL
Se ha implementado un SQL Server Agent Job que garantiza que el Data Warehouse esté siempre actualizado. El proceso se ejecuta cada 5 minutos y realiza las siguientes tareas:
* ***Extracción:** Captura nuevos registros de samsung_electronics.
* ***Transformación:** Limpieza de datos y concatenación de nombres/apellidos.
* ***Carga:** Inserción en Dim_Cliente manteniendo la trazabilidad con ID_Original.
Comando para ejecución manual del Job:
```SQL
EXEC msdb.dbo.sp_start_job N'Sincronizacion_Samsung_Automatico';
```

### Desarrollado por: Ailyn Lenny Encinas Gutierrez y Denilson Asis Saavedra Mamani

### Carrera: Ingeniería de Sistemas e Informática (ISI) - Univalle
