// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import Login from './login/Login';
import Dashboard from './dashboard/Dashboard.jsx';
import { getProductos, getVentasResumen, loginUser } from './api/api';

function App() {
  // 1. Definimos los estados que le pasaremos al Login
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // 2. Estados de control del sistema
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(''); // Estado extra para avisar al usuario si falla
  
  // 3. Estados para los datos de la DB y DW
  const [productos, setProductos] = useState([]);
  const [stats, setStats] = useState({ total_ventas: 0, total_productos: 0 });

  // Función para manejar el inicio de sesión
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(''); // Limpiamos errores anteriores
    
    try {
        const response = await loginUser(username, password);
        console.log("Éxito:", response);
        
        // ==========================================
        // ¡CORREGIDO! Evaluamos lo que Django sí envía
        // ==========================================
        if (response && response.user) { 
            setIsLoggedIn(true); 
        } else {
            setLoginError("Credenciales incorrectas. Verifique sus datos.");
        }
    } catch (error) {
        console.error("Atrapamos el error:", error.message);
        setLoginError("Credenciales incorrectas. Verifique sus datos.");
    }
  };

  // EFECTO: Cuando el login sea exitoso, traemos toda la data del DW
  useEffect(() => {
    if (isLoggedIn) {
      cargarDatosDelSistema();
    }
  }, [isLoggedIn]);

  const cargarDatosDelSistema = async () => {
    setLoading(true);
    try {
      const [dataProd, dataStats] = await Promise.all([
        getProductos(),
        getVentasResumen()
      ]);
      
      setProductos(dataProd.productos || []);
      setStats(dataStats);
    } catch (error) {
      console.error("Error cargando el Data Warehouse", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!isLoggedIn ? (
        <Login 
          setUsername={setUsername}   
          setPassword={setPassword}   
          handleLogin={handleLogin}   
          loginError={loginError} // Pasamos el string de error por si falla
        />
      ) : (
        /* Renderizamos tu componente Dashboard pasándole las props que ya configuraste */
        <div>
          {/* Header simple corporativo para desloguearse */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 25px', background: '#1e293b', color: '#fff', fontFamily: 'sans-serif' }}>
            <span style={{ fontWeight: 'bold', letterSpacing: '1px' }}>SAMSUNG BI PORTAL</span>
            <button 
              onClick={() => setIsLoggedIn(false)} 
              style={{ background: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}
            >
              Cerrar Sesión
            </button>
          </div>

          <Dashboard 
            stats={stats} 
            productos={productos} 
            loading={loading} 
          />
        </div>
      )}
    </>
  );
}

export default App;