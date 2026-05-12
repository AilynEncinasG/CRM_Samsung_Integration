import React, { useEffect, useState } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // ESTADOS PARA LOS DATOS DE SAMSUNG
  const [productos, setProductos] = useState([]);
  const [stats, setStats] = useState({ total_ventas: 0, total_productos: 0 });
  const [loading, setLoading] = useState(true);

  // EFECTO DE CARGA DE DATOS (Punto 5)
  useEffect(() => {
    if (isLoggedIn) {
      setLoading(true);
      
      // Ejecutamos ambas peticiones en paralelo para mayor velocidad
      Promise.all([
        fetch('http://localhost:8000/api/productos/').then(res => res.json()),
        fetch('http://localhost:8000/api/ventas-resumen/').then(res => res.json())
      ])
      .then(([dataProd, dataStats]) => {
        setProductos(dataProd.productos);
        setStats(dataStats);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error conectando con el Data Warehouse:", err);
        setLoading(false);
      });
    }
  }, [isLoggedIn]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      if (data.success) {
        setIsLoggedIn(true);
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      alert("No se pudo conectar con el servidor de Django");
    }
  };

  // --- 1. VISTA DE LOGIN (Si no está logueado) ---
  if (!isLoggedIn) {
    return (
      <div style={styles.container}>
        <div style={styles.loginCard}>
          <h2 style={{color: '#034EA2', marginBottom: '5px'}}>SAMSUNG</h2>
          <p style={{fontSize: '12px', color: '#666', marginBottom: '20px'}}>Electronics Business Portal</p>
          <form onSubmit={handleLogin}>
            <input 
              type="text" placeholder="Usuario Corporativo" 
              style={styles.input} onChange={(e) => setUsername(e.target.value)} 
            />
            <input 
              type="password" placeholder="Contraseña" 
              style={styles.input} onChange={(e) => setPassword(e.target.value)} 
            />
            <button type="submit" style={styles.button}>Iniciar Sesión</button>
          </form>
          <p style={{marginTop: '15px', fontSize: '10px', color: '#aaa'}}>ISI - UNIVALLE 2026</p>
        </div>
      </div>
    );
  }

  // --- 2. VISTA DE DASHBOARD ---
  return (
    <div style={styles.dashboard}>
      <nav style={styles.nav}>
        <h3>SAMSUNG | Sales Intelligence</h3>
        <div>
            <span style={{marginRight: '20px', fontSize: '14px'}}>Bienvenido, {username}</span>
            <button onClick={() => setIsLoggedIn(false)} style={styles.logout}>Salir</button>
        </div>
      </nav>

      <div style={{padding: '30px'}}>
        <header style={{marginBottom: '30px'}}>
            <h2>Panel de Ventas Real-Time</h2>
            {/* CAMBIAMOS info.sistema POR UN TEXTO O stats SI LO TRAES DE DJANGO */}
            <p style={{color: '#666'}}>Conectado a: <strong>Data Warehouse Samsung</strong></p>
        </header>
        
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <small>📦 PRODUCTOS EN DB</small>
            {/* USAMOS stats.total_productos que definimos en el useState */}
            <div style={{fontSize: '24px', fontWeight: 'bold'}}>{stats.total_productos}</div>
          </div>
          <div style={styles.statCard}>
            <small>💰 VENTAS TOTALES (DW)</small>
            <div style={{fontSize: '24px', fontWeight: 'bold'}}>${stats.total_ventas.toLocaleString()}</div>
          </div>
          <div style={styles.statCard}>
            <small>📡 ESTADO BACKEND</small>
            <div style={{fontSize: '24px', fontWeight: 'bold', color: 'green'}}>
                {loading ? 'Sincronizando...' : 'Online'}
            </div>
          </div>
        </div>

        {/* Aquí va la tabla que pusimos en el paso anterior */}
        <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginTop: '20px'}}>
            <div style={styles.tableContainer}>
                <h4>📦 Inventario de Productos (SQL Server)</h4>
                {loading ? <p>Cargando datos...</p> : (
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Producto</th>
                                <th style={styles.th}>Categoría</th>
                                <th style={styles.th}>Precio</th>
                                <th style={styles.th}>Almacén</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos.map((p, index) => (
                                <tr key={index}>
                                    <td style={styles.td}>{p.nombre}</td>
                                    <td style={styles.td}>{p.categoria}</td>
                                    <td style={styles.td}>${p.precio}</td>
                                    <td style={styles.td}>{p.almacen}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div style={{background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
                <h4>Accesos Rápidos</h4>
                <hr />
                <p style={{fontSize: '14px'}}>Gestión de Clientes:</p>
                <a href="http://localhost:8069" target="_blank" rel="noreferrer" style={styles.odooLink}>
                    Abrir Odoo CRM
                </a>
            </div>
        </div>
      </div>
    </div>
  );
}

// --- ESTILOS ---
const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' },
  loginCard: { width: '350px', padding: '40px', background: 'white', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', textAlign: 'center' },
  input: { display: 'block', width: '100%', padding: '12px', margin: '10px 0', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' },
  button: { width: '100%', padding: '12px', backgroundColor: '#034EA2', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  dashboard: { minHeight: '100vh', backgroundColor: '#f4f7f6' },
  nav: { backgroundColor: '#000', color: '#fff', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  statsRow: { display: 'flex', gap: '20px' },
  statCard: { padding: '20px', background: '#fff', flex: 1, borderRadius: '8px', borderLeft: '5px solid #034EA2', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  tablePlaceholder: { padding: '40px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  logout: { background: 'transparent', border: '1px solid #fff', color: '#fff', cursor: 'pointer', padding: '5px 12px', borderRadius: '4px' },
  odooLink: { display: 'block', textAlign: 'center', background: '#714B67', color: 'white', padding: '10px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', marginTop: '10px' },
  tableContainer: { 
    padding: '20px', 
    background: '#fff', 
    borderRadius: '8px', 
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    overflowX: 'auto' 
  },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
  th: { textAlign: 'left', padding: '12px', borderBottom: '2px solid #034EA2', color: '#333' },
  td: { padding: '12px', color: '#666', fontSize: '14px' },
};

export default App;