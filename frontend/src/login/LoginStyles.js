// frontend/src/login/LoginStyles.js
export const loginStyles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f4f7f9', // Un gris muy claro de fondo
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
    },
    loginCard: {
        width: '380px',
        padding: '50px 40px',
        background: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
        textAlign: 'center'
    },
    logo: {
        color: '#034EA2',
        fontSize: '28px',
        fontWeight: 'bold',
        letterSpacing: '1px',
        marginBottom: '5px'
    },
    subtitle: {
        fontSize: '13px',
        color: '#777',
        marginBottom: '30px',
        textTransform: 'uppercase'
    },
    input: {
        display: 'block',
        width: '100%',
        padding: '14px',
        margin: '12px 0',
        borderRadius: '8px',
        border: '1px solid #ddd',
        boxSizing: 'border-box',
        fontSize: '15px',
        outline: 'none',
        transition: 'border-color 0.3s',
    },
    button: {
        width: '100%',
        padding: '14px',
        backgroundColor: '#034EA2',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '16px',
        marginTop: '10px',
        transition: 'background-color 0.3s'
    },
    footer: {
        marginTop: '25px',
        fontSize: '11px',
        color: '#bbb',
        borderTop: '1px solid #eee',
        paddingTop: '15px'
    }
};