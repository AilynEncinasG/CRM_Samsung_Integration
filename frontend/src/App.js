import React, { useEffect, useState } from 'react';

function App() {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    // Llamada a tu API de Django
    fetch('http://localhost:8000/api/estado/')
      .then(response => response.json())
      .then(data => setInfo(data));
  }, []);

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1>🚀 Panel de Control - Samsung Integration</h1>
        <p>ISI - Univalle</p>
      </header>

      <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        {/* Card de Estado de API */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3>Estado del Backend (Django)</h3>
          {info ? (
            <p>Estado: <span style={{ color: 'green' }}>{info.estado}</span></p>
          ) : <p>Cargando...</p>}
        </div>

        {/* Card de Acceso Directo a Odoo */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderTop: '5px solid #714B67' }}>
          <h3>Gestión CRM Odoo</h3>
          <p>Accede directamente al CRM de Samsung</p>
          <a href="http://localhost:8069" target="_blank" rel="noreferrer" 
             style={{ background: '#714B67', color: 'white', padding: '10px 15px', borderRadius: '5px', textDecoration: 'none' }}>
            Abrir Odoo
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;