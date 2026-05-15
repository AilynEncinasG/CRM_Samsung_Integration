// frontend/src/login/Login.jsx
import React from 'react';
import { loginStyles as s } from './LoginStyles';

const Login = ({ setUsername, setPassword, handleLogin }) => {
    return (
        <div style={s.container}>
            <div style={s.loginCard}>
                <div style={s.logo}>SAMSUNG</div>
                <div style={s.subtitle}>Business Intelligence Portal</div>
                
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