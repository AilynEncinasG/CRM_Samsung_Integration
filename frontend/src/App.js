import React, { useEffect, useState } from 'react';

function App() {
  // Estados para el Login
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Estado para la info del Backend (Django)
  const [info, setInfo] = useState(null);

  // Efecto para traer info de Django solo cuando estemos logueados
  useEffect(() => {
    if (isLoggedIn) {
      fetch('http://localhost:8000/api/estado/')
        .then(response => response.json())
        .then(data => setInfo(data))
        .catch(err => console.error("Error cargando estado:", err));
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

  // --- 2. VISTA DE DASHBOARD (Si ya inició sesión) ---
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
            {info && <p style={{color: '#666'}}>Conectado a: <strong>{info.sistema}</strong></p>}
        </header>
        
        {/* Fila de Tarjetas de Estadísticas */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <small>📦 STOCK TOTAL</small>
            <div style={{fontSize: '24px', fontWeight: 'bold'}}>1,450</div>
          </div>
          <div style={styles.statCard}>
            <small>💰 VENTAS HOY</small>
            <div style={{fontSize: '24px', fontWeight: 'bold'}}>$45,200</div>
          </div>
          <div style={styles.statCard}>
            <small>📡 ESTADO BACKEND</small>
            <div style={{fontSize: '24px', fontWeight: 'bold', color: 'green'}}>
                {info ? info.estado : 'Conectando...'}
            </div>
          </div>
        </div>

        {/* Sección de Accesos y Datos */}
        <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginTop: '20px'}}>
            <div style={styles.tablePlaceholder}>
                <h4>Detalle de Productos (SQL Server)</h4>
                <p style={{color: '#888'}}>Cargando tablas desde Data Warehouse...</p>
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
  odooLink: { display: 'block', textAlign: 'center', background: '#714B67', color: 'white', padding: '10px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', marginTop: '10px' }
};

export default App;