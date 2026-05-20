import { useState, useEffect } from 'react';
import { getDashboardStats } from '../api/api';

export const useDashboardStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const cargarDatos = async () => {
        try {
            setLoading(true);
            setError(null);
            const respuesta = await getDashboardStats();
            
            if (respuesta.status === 'success') {
                setStats(respuesta.data);
            } else {
                throw new Error(respuesta.message || 'Error en el formato de respuesta');
            }
        } catch (err) {
            console.error("Error al consumir la API de estadísticas:", err);
            setError("No se pudo conectar con el servidor central de Django.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    // Retornamos las variables de estado y la función para recargar manualmente si se necesita
    return {
        stats,
        loading,
        error,
        recargarDatos: cargarDatos
    };
};