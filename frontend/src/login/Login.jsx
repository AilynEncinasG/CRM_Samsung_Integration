import React from 'react';
import { loginStyles as s } from './LoginStyles';

const Login = ({ setUsername, setPassword, handleLogin, loginError }) => { // <--- Agregamos loginError aquí
    return (
        <div style={s.container}>
            <div style={s.loginCard}>
                <div style={s.logo}>SAMSUNG</div>
                <div style={s.subtitle}>Business Intelligence Portal</div>
                
                {/* --- MENSAJE DE ERROR DINÁMICO --- */}
                {loginError && (
                    <div style={{ 
                        backgroundColor: '#fee2e2', 
                        color: '#ef4444', 
                        padding: '10px', 
                        borderRadius: '6px', 
                        marginBottom: '15px', 
                        fontSize: '13px',
                        textAlign: 'center',
                        fontWeight: '500',
                        border: '1px solid #fca5a5'
                    }}>
                        {loginError}
                    </div>
                )}
                
                <form onSubmit={handleLogin}>
                    <input 
                        type="text" 
                        placeholder="Usuario Corporativo" 
                        style={s.input} 
                        onChange={(e) => setUsername(e.target.value)}
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder="Contraseña" 
                        style={s.input} 
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                    />
                    <button type="submit" style={s.button}>
                        Acceder al Sistema
                    </button>
                </form>

                <div style={s.footer}>
                    SISTEMAS DE INFORMACIÓN - UNIVALLE 2026
                </div>
            </div>
        </div>
    );
};

export default Login;