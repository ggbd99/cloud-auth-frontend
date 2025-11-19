import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import './Login.css';

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
        <div className="login-container">
            <div className="login-card">
                <h1>Login</h1>
                <p className="subtitle">Device Whitelist Management</p>

                {error && <div className="error-message">{error}</div>}

                <div className="google-login-wrapper">
                    <GoogleLogin
                        onSuccess={handleSuccess}
                        onError={handleError}
                        theme="filled_blue"
                        size="large"
                        text="signin_with"
                    />
                </div>

                <p className="register-link">
                    Don't have an account? <a href="/register">Register here</a>
                </p>
            </div>
        </div>
    );
}
