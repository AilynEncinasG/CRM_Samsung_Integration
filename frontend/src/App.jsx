// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import Login from './login/Login';
import Dashboard from './dashboard/Dashboard'; 
import { getProductos, getVentasResumen, loginUser } from './api/api'; // Importamos loginUser

function App() {
  // 1. Definimos los estados que le pasaremos al Login
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // 2. Estados de control del sistema
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // 3. Estados para los datos de la DB y DW
  const [productos, setProductos] = useState([]);
  const [stats, setStats] = useState({ total_ventas: 0, total_productos: 0 });

  // Función para manejar el inicio de sesión
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const response = await loginUser(username, password);
        console.log("Éxito:", response);
    } catch (error) {
        // Esto evita que React explote con el cartel rojo
        console.error("Atrapamos el error:", error.message);
        alert("Error de conexión o credenciales inválidas");
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
          setUsername={setUsername}   // Ahora sí está definida arriba
          setPassword={setPassword}   // Ahora sí está definida arriba
          handleLogin={handleLogin}   // Ahora sí está definida arriba
        />
      ) : (
        <Dashboard 
          stats={stats} 
          productos={productos} 
          loading={loading} 
          logout={() => setIsLoggedIn(false)} 
        />
      )}
    </>
  );
  
}

export default App;