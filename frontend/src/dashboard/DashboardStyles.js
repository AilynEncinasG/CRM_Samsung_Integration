// Paleta de colores del ecosistema Samsung / Corporativo
const colors = {
    primary: '#1e293b',    // Slate oscuro
    secondary: '#64748b',  // Gris medio
    success: '#10b981',    // Verde métricas estables
    successBg: '#ecfdf5',  
    danger: '#ef4444',     // Rojo alertas de stock
    dangerBg: '#fee2e2',
    accent: '#3b82f6',     // Azul Samsung
    bgLayout: '#f8f9fa',   // Fondo de pantalla
    bgCard: '#ffffff',     // Fondo de tarjetas
    border: '#f1f5f9',
    tableHeader: '#fafafa'
};

export const styles = {
    container: {
        padding: '25px',
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
        backgroundColor: colors.bgLayout,
        minHeight: '100vh'
    },
    title: {
        margin: '0 0 5px 0',
        color: colors.primary
    },
    subtitle: {
        margin: '0 0 25px 0',
        color: colors.secondary,
        fontSize: '14px'
    },
    // --- CONTENEDORES KPI ---
    kpiGroup: {
        display: 'flex',
        gap: '20px',
        marginBottom: '30px'
    },
    kpiCard: (borderColor) => ({
        flex: 1,
        padding: '20px',
        background: colors.bgCard,
        borderRadius: '10px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        borderLeft: `4px solid ${borderColor}`
    }),
    kpiTitle: {
        margin: '0 0 8px 0',
        color: colors.secondary,
        fontSize: '13px',
        textTransform: 'uppercase'
    },
    kpiValue: {
        fontSize: '26px',
        fontWeight: 'bold',
        margin: 0,
        color: colors.primary
    },
    // --- BLOQUES E INTERFACES ---
    flexGrid: {
        display: 'flex',
        gap: '25px',
        flexWrap: 'wrap'
    },
    cardBlock: {
        flex: 1,
        minWidth: '450px',
        background: colors.bgCard,
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    fullWidthBlock: {
        width: '100%',
        background: colors.bgCard,
        padding: '25px',
        borderRadius: '10px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginTop: '5px'
    },
    blockTitle: (titleColor = colors.primary) => ({
        color: titleColor,
        margin: '0 0 5px 0',
        fontSize: '18px'
    }),
    blockMeta: {
        fontSize: '13px',
        color: '#94a3b8',
        margin: '0 0 15px 0'
    },
    // --- TABLAS ---
    table: {
        width: '100%',
        borderCollapse: 'collapse'
    },
    th: {
        padding: '12px 8px',
        borderBottom: `2px solid ${colors.border}`,
        color: colors.secondary,
        fontSize: '13px'
    },
    tr: {
        borderBottom: `1px solid ${colors.border}`
    },
    td: {
        padding: '12px 8px'
    },
    // --- ESTADOS DE ALERTA ---
    alertTextSuccess: {
        color: colors.success,
        padding: '10px',
        backgroundColor: colors.successBg,
        borderRadius: '6px'
    },
    badgeDanger: {
        backgroundColor: colors.dangerBg,
        color: colors.danger,
        padding: '4px 8px',
        borderRadius: '4px',
        fontWeight: 'bold'
    },
    // --- BARRAS DE RENDIMIENTO ---
    progressBarContainer: {
        width: '65%',
        background: colors.border,
        borderRadius: '6px',
        height: '14px',
        overflow: 'hidden'
    },
    progressBarFill: (widthPercentage) => ({
        background: `linear-gradient(90deg, ${colors.accent} 0%, #1d4ed8 100%)`,
        height: '100%',
        width: `${widthPercentage}%`,
        borderRadius: '6px',
        transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
    }),
    colors
};