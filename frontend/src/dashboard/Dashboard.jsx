import React from 'react';
import { useDashboardStats } from './Dashboard';
import { styles } from './DashboardStyles';

const DashboardView = () => {
    const { stats, loading, error } = useDashboardStats();

    if (loading) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif', color: '#666' }}>
                <h3>Cargando métricas del sistema...</h3>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif', color: '#d32f2f' }}>
                <h3>⚠️ Error Operativo</h3>
                <p>{error}</p>
            </div>
        );
    }

    if (!stats) return null;

    const { metricas_generales, top_productos, stock_critico, resumen_tiendas } = stats;

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Panel de Control Interno</h2>
            <p style={styles.subtitle}>
                Monitoreo del Data Warehouse y Gestión de Inventarios Samsung
            </p>

            {/* --- BLOQUE 1: TARJETAS DE INDICADORES (KPIs) --- */}
            <div style={styles.kpiGroup}>
                <div style={styles.kpiCard(styles.colors.accent)}>
                    <h4 style={styles.kpiTitle}>Ingresos Totales en Ventas</h4>
                    <p style={styles.kpiValue}>
                        Bs. {Number(metricas_generales.total_ventas).toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                    </p>
                </div>
                <div style={styles.kpiCard(styles.colors.success)}>
                    <h4 style={styles.kpiTitle}>Volumen de Pedidos</h4>
                    <p style={styles.kpiValue}>
                        {metricas_generales.total_pedidos} Órdenes
                    </p>
                </div>
            </div>

            <div style={styles.flexGrid}>
                
                {/* --- BLOQUE 2: ALERTAS DE INVENTARIO CRÍTICO --- */}
                <div style={styles.cardBlock}>
                    <h3 style={styles.blockTitle(styles.colors.danger)}>⚠️ Alertas de Almacén (Stock Crítico)</h3>
                    <p style={styles.blockMeta}>Unidades menores a 10 registradas en StockAlmacen</p>
                    
                    {stock_critico.length === 0 ? (
                        <p style={styles.alertTextSuccess}>
                            ✓ Niveles de inventario estables en todas las sucursales.
                        </p>
                    ) : (
                        <table style={styles.table}>
                            <thead>
                                <tr style={{ textAlign: 'left' }}>
                                    <th style={styles.th}>Producto</th>
                                    <th style={styles.th}>Almacén Sucursal</th>
                                    <th style={{ ...styles.th, textAlign: 'center' }}>Stock</th>
                                </tr>
                            </thead>
                            <tbody style={{ fontSize: '14px', color: '#334155' }}>
                                {stock_critico.map((item, idx) => (
                                    <tr key={idx} style={styles.tr}>
                                        <td style={{ ...styles.td, fontWeight: '500' }}>{item.Producto}</td>
                                        <td style={{ ...styles.td, color: styles.colors.secondary }}>{item.Almacen}</td>
                                        <td style={{ ...styles.td, textAlign: 'center' }}>
                                            <span style={styles.badgeDanger}>{item.Stock} u</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* --- BLOQUE 3: ESTADÍSTICAS POR TIENDA FÍSICA --- */}
                <div style={styles.cardBlock}>
                    <h3 style={styles.blockTitle()}>🏢 Desempeño Comercial por Tienda</h3>
                    <p style={styles.blockMeta}>Ingresos brutos acumulados desde el sistema comercial</p>
                    
                    <table style={styles.table}>
                        <thead>
                            <tr style={{ textAlign: 'left' }}>
                                <th style={styles.th}>Establecimiento</th>
                                <th style={{ ...styles.th, textAlign: 'center' }}>Despachos</th>
                                <th style={{ ...styles.th, textAlign: 'right' }}>Total Facturado</th>
                            </tr>
                        </thead>
                        <tbody style={{ fontSize: '14px', color: '#334155' }}>
                            {resumen_tiendas.map((tienda, idx) => (
                                <tr key={idx} style={styles.tr}>
                                    <td style={{ ...styles.td, fontWeight: '500' }}>{tienda.NombreTienda}</td>
                                    <td style={{ ...styles.td, textAlign: 'center' }}>{tienda.PedidosAtendidos}</td>
                                    <td style={{ ...styles.td, textAlign: 'right', color: styles.colors.success, fontWeight: '600' }}>
                                        Bs. {Number(tienda.TotalFacturado).toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* --- BLOQUE 4: RANKING TOP 5 DE VENTAS --- */}
                <div style={styles.fullWidthBlock}>
                    <h3 style={styles.blockTitle()}>🔥 Los 5 Dispositivos Más Vendidos</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {top_productos.map((prod, idx) => {
                            const maxUnidades = top_productos[0]?.UnidadesVendidas || 1;
                            const porcentajeBarra = (prod.UnidadesVendidas / maxUnidades) * 100;

                            return (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{ width: '25%', fontWeight: '500', fontSize: '14px', color: '#334155' }}>{prod.Nombre}</div>
                                    <div style={styles.progressBarContainer}>
                                        <div style={styles.progressBarFill(porcentajeBarra)} />
                                    </div>
                                    <div style={{ width: '10%', textAlign: 'right', fontWeight: 'bold', fontSize: '14px', color: '#475569' }}>
                                        {prod.UnidadesVendidas} u
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DashboardView;