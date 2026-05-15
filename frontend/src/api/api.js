// frontend/src/api/api.js
const BASE_URL = 'http://localhost:8000/api';

// 1. Función para Login (Blindada)
export const loginUser = async (username, password) => {
    try {
        const response = await fetch(`${BASE_URL}/login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            // Si el status es 401, 404, 500, etc.
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error en loginUser:", error);
        throw error;
    }
};

// 2. Función para Inventario (¡Asegúrate de que tenga el 'export'!)
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

// 3. Función para Ventas del DW (¡Asegúrate de que tenga el 'export'!)
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