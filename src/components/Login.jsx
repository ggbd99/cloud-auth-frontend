import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

export default function Login() {
    const [error, setError] = useState('');
    const { adminLogin } = useAuth();
    const navigate = useNavigate();

    const handleSuccess = async (credentialResponse) => {
        setError('');
        const result = await adminLogin(credentialResponse.credential);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
        }
    };

    const handleError = () => {
        setError('Google Login Failed');
    };

    return (
        <div className="auth-container">
            <h2>Admin Login</h2>
            <p style={{ color: '#888', fontSize: '0.9rem' }}>Device Whitelist Management</p>
            {error && <div className="error-message">{error}</div>}

            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center' }}>
                <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={handleError}
                    theme="filled_black"
                    text="signin_with"
                    shape="pill"
                />
            </div>

            <p className="register-link" style={{ marginTop: '20px', textAlign: 'center' }}>
                Don't have an account? <a href="/register">Register here</a>
            </p>
        </div>
    );
}
