// frontend/src/api/api.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api';

// 1. Función para Login nativo (Fetch)
export const loginUser = async (username, password) => {
    try {
        const response = await fetch(`${BASE_URL}/login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error en loginUser:", error);
        throw error;
    }
};

// 2. Función para Inventario (Fetch)
export const getProductos = async () => {
    try {
        const response = await fetch(`${BASE_URL}/productos/`);
        if (!response.ok) throw new Error('Error al obtener productos');
        return await response.json();
    } catch (error) {
        console.error("Error en getProductos:", error);
        throw error;
    }
};

// 3. Función para Ventas del DW (Fetch)
export const getVentasResumen = async () => {
    try {
        const response = await fetch(`${BASE_URL}/ventas-resumen/`);
        if (!response.ok) throw new Error('Error al obtener resumen de ventas');
        return await response.json();
    } catch (error) {
        console.error("Error en getVentasResumen:", error);
        throw error;
    }
};


// ==========================================
// CONFIGURACIÓN DE AXIOS (Instancia unificada)
// ==========================================

const api = axios.create({
    baseURL: BASE_URL, // <--- CORREGIDO: Antes decía API_URL y causaba error
    headers: {
        'Content-Type': 'application/json',
    }
});

// Petición de Login alterna por Axios
export const login = async (username, password) => {
    const response = await api.post('/auth/login/', { username, password });
    return response.data;
};

// NUEVA: Petición para obtener las estadísticas del Dashboard usando Axios
export const getDashboardStats = async () => {
    const response = await api.get('/core/dashboard-stats/');
    return response.data;
};

export default api;