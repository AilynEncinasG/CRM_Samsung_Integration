-- Creación de la Base de Datos
CREATE DATABASE samsung_electronics;
GO
USE samsung_electronics;
GO

-- 1. INFRAESTRUCTURA Y RRHH
CREATE TABLE Tienda (
    ID INT PRIMARY KEY IDENTITY(1,1),
    NombreTienda NVARCHAR(100) NOT NULL,
    Direccion NVARCHAR(255),
    Ciudad NVARCHAR(100),
    Telefono NVARCHAR(20)
);

CREATE TABLE Departamento (
    ID INT PRIMARY KEY IDENTITY(1,1),
    NombreDepartamento NVARCHAR(100) NOT NULL,
    Ubicacion NVARCHAR(255)
);

CREATE TABLE Empleado (
    ID INT PRIMARY KEY IDENTITY(1,1),
    TiendaID INT FOREIGN KEY REFERENCES Tienda(ID),
    DepartamentoID INT FOREIGN KEY REFERENCES Departamento(ID),
    Nombre NVARCHAR(100) NOT NULL,
    Apellido NVARCHAR(100),
    Cargo NVARCHAR(50)
);

CREATE TABLE Nomina (
    ID INT PRIMARY KEY IDENTITY(1,1),
    EmpleadoID INT FOREIGN KEY REFERENCES Empleado(ID),
    FechaPago DATE,
    Salario DECIMAL(18,2),
    Bonificacion DECIMAL(18,2)
);

CREATE TABLE Asistencia (
    ID INT PRIMARY KEY IDENTITY(1,1),
    EmpleadoID INT FOREIGN KEY REFERENCES Empleado(ID),
    Fecha DATE,
    HoraEntrada TIME,
    HoraSalida TIME
);

-- 2. INVENTARIO Y ALMACÉN
CREATE TABLE Categoria (
    ID INT PRIMARY KEY IDENTITY(1,1),
    NombreCategoria NVARCHAR(100) NOT NULL,
    Descripcion NVARCHAR(MAX)
);

CREATE TABLE Almacen (
    ID INT PRIMARY KEY IDENTITY(1,1),
    NombreAlmacen NVARCHAR(100),
    Ubicacion NVARCHAR(255)
);

CREATE TABLE Producto (
    ID INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(150) NOT NULL,
    Descripcion NVARCHAR(MAX),
    Precio DECIMAL(18,2) NOT NULL,
    CategoriaID INT FOREIGN KEY REFERENCES Categoria(ID),
    AlmacenID INT FOREIGN KEY REFERENCES Almacen(ID),
    EmpleadoID INT FOREIGN KEY REFERENCES Empleado(ID) -- Relación 1:N Empleado-Producto
);

CREATE TABLE MovimientoInventario (
    ID INT PRIMARY KEY IDENTITY(1,1),
    ProductoID INT FOREIGN KEY REFERENCES Producto(ID),
    AlmacenID INT FOREIGN KEY REFERENCES Almacen(ID),
    TipoMovimiento NVARCHAR(20), -- 'Entrada' o 'Salida'
    Fecha DATETIME DEFAULT GETDATE(),
    Cantidad INT
);

-- 3. VENTAS Y CLIENTES (Core para Odoo CRM)
CREATE TABLE Cliente (
    ID INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL,
    Apellidos NVARCHAR(100),
    Movil NVARCHAR(20),
    Email NVARCHAR(100)
);

CREATE TABLE Pedido (
    ID INT PRIMARY KEY IDENTITY(1,1),
    Fecha DATETIME DEFAULT GETDATE(),
    ClienteID INT FOREIGN KEY REFERENCES Cliente(ID),
    Total DECIMAL(18,2),
    Estado NVARCHAR(50)
);

CREATE TABLE DetallePedido (
    ID INT PRIMARY KEY IDENTITY(1,1),
    PedidoID INT FOREIGN KEY REFERENCES Pedido(ID),
    ProductoID INT FOREIGN KEY REFERENCES Producto(ID),
    Cantidad INT,
    PrecioUnitario DECIMAL(18,2)
);

CREATE TABLE Pago (
    ID INT PRIMARY KEY FOREIGN KEY REFERENCES Pedido(ID), -- Relación 1:1
    FechaPago DATETIME DEFAULT GETDATE(),
    Monto DECIMAL(18,2),
    MetodoPago NVARCHAR(50)
);

-- 4. MARKETING Y PROMOCIONES
CREATE TABLE Campana (
    ID INT PRIMARY KEY IDENTITY(1,1),
    NombreCampana NVARCHAR(150),
    FechaInicio DATE,
    FechaFin DATE,
    Presupuesto DECIMAL(18,2)
);

CREATE TABLE CanalPublicidad (
    ID INT PRIMARY KEY IDENTITY(1,1),
    NombreCanal NVARCHAR(100),
    Tipo NVARCHAR(50)
);

CREATE TABLE CampanaCanal (
    ID INT PRIMARY KEY IDENTITY(1,1),
    CampanaID INT FOREIGN KEY REFERENCES Campana(ID),
    CanalID INT FOREIGN KEY REFERENCES CanalPublicidad(ID)
);

CREATE TABLE CampanaProducto (
    ID INT PRIMARY KEY IDENTITY(1,1),
    CampanaID INT FOREIGN KEY REFERENCES Campana(ID),
    ProductoID INT FOREIGN KEY REFERENCES Producto(ID)
);

CREATE TABLE Promocion (
    ID INT PRIMARY KEY IDENTITY(1,1),
    NombrePromocion NVARCHAR(150),
    Descuento DECIMAL(5,2),
    Vigencia DATE
);

CREATE TABLE PromocionProducto (
    ID INT PRIMARY KEY IDENTITY(1,1),
    PromocionID INT FOREIGN KEY REFERENCES Promocion(ID),
    ProductoID INT FOREIGN KEY REFERENCES Producto(ID)
);

-- 5. COMPRAS Y PROVEEDORES
CREATE TABLE Proveedor (
    ID INT PRIMARY KEY IDENTITY(1,1),
    NombreProveedor NVARCHAR(150),
    Telefono NVARCHAR(20),
    Correo NVARCHAR(100)
);

CREATE TABLE OrdenCompra (
    ID INT PRIMARY KEY IDENTITY(1,1),
    ProveedorID INT FOREIGN KEY REFERENCES Proveedor(ID),
    Fecha DATETIME DEFAULT GETDATE(),
    Estado NVARCHAR(50),
    Total DECIMAL(18,2)
);

CREATE TABLE DetalleCompra (
    ID INT PRIMARY KEY IDENTITY(1,1),
    OrdenCompraID INT FOREIGN KEY REFERENCES OrdenCompra(ID),
    ProductoID INT FOREIGN KEY REFERENCES Producto(ID),
    Cantidad INT,
    PrecioCompra DECIMAL(18,2)
);
GO

-- Creación del Data Warehouse
CREATE DATABASE DW_Samsung;
GO
USE DW_Samsung;
GO

-- 1. DIMENSIONES (Contexto basado en tus tablas)

CREATE TABLE Dim_Cliente (
    ClienteKey INT PRIMARY KEY IDENTITY(1,1),
    ID_Original INT, -- FK a tu tabla Cliente.ID
    NombreCompleto NVARCHAR(255),
    Movil NVARCHAR(20),
    Email NVARCHAR(100)
);

CREATE TABLE Dim_Producto (
    ProductoKey INT PRIMARY KEY IDENTITY(1,1),
    ID_Original INT, -- FK a tu tabla Producto.ID
    NombreProducto NVARCHAR(150),
    Categoria NVARCHAR(100), -- Viene de tu tabla Categoria
    Almacen NVARCHAR(100)    -- Viene de tu tabla Almacen
);

CREATE TABLE Dim_Empleado (
    EmpleadoKey INT PRIMARY KEY IDENTITY(1,1),
    ID_Original INT, -- FK a tu tabla Empleado.ID
    NombreCompleto NVARCHAR(255),
    Cargo NVARCHAR(50),
    Tienda NVARCHAR(100),      -- Viene de tu tabla Tienda
    Departamento NVARCHAR(100) -- Viene de tu tabla Departamento
);

CREATE TABLE Dim_Promocion (
    PromocionKey INT PRIMARY KEY IDENTITY(1,1),
    ID_Original INT, -- FK a tu tabla Promocion.ID
    NombrePromocion NVARCHAR(150),
    Descuento DECIMAL(5,2)
);

CREATE TABLE Dim_Campana (
    CampanaKey INT PRIMARY KEY IDENTITY(1,1),
    ID_Original INT, -- FK a tu tabla Campana.ID
    NombreCampana NVARCHAR(150),
    Presupuesto DECIMAL(18,2)
);

CREATE TABLE Dim_Fecha (
    FechaKey INT PRIMARY KEY, -- Formato YYYYMMDD
    Fecha DATE,
    Anio INT,
    Mes INT,
    Dia INT
);

-- 2. TABLA DE HECHOS (El corazón del análisis de Ventas)

CREATE TABLE Fact_Ventas (
    VentaKey INT PRIMARY KEY IDENTITY(1,1),
    FechaKey INT FOREIGN KEY REFERENCES Dim_Fecha(FechaKey),
    ClienteKey INT FOREIGN KEY REFERENCES Dim_Cliente(ClienteKey),
    ProductoKey INT FOREIGN KEY REFERENCES Dim_Producto(ProductoKey),
    EmpleadoKey INT FOREIGN KEY REFERENCES Dim_Empleado(EmpleadoKey),
    PromocionKey INT FOREIGN KEY REFERENCES Dim_Promocion(PromocionKey),
    CampanaKey INT FOREIGN KEY REFERENCES Dim_Campana(CampanaKey),
    
    -- Métricas de tus tablas Pedido, DetallePedido y Pago
    Cantidad INT,
    PrecioUnitario DECIMAL(18,2),
    MontoTotalPedido DECIMAL(18,2),
    MontoPagado DECIMAL(18,2),
    EstadoPedido NVARCHAR(50)
);
GO