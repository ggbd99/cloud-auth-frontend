import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import './Login.css';

export default function Register() {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const { adminLogin } = useAuth();

    const handleRegister = async (credentialResponse) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ google_token: credentialResponse.credential }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Registration successful! Logging you in...');
                // Auto-login after registration
                const loginResult = await adminLogin(credentialResponse.credential);
                if (loginResult.success) {
                    navigate('/dashboard');
                }
            } else {
                setError(data.error || 'Registration failed');
            }
        } catch (err) {
            setError('Network error: ' + err.message);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>Register</h1>
                <p className="subtitle">Sign up with your Google account</p>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <div className="google-login-wrapper">
                    <GoogleLogin
                        onSuccess={handleRegister}
                        onError={() => setError('Google Sign-In failed')}
                        theme="filled_blue"
                        size="large"
                        text="signup_with"
                    />
                </div>

                <p className="register-link">
                    Already have an account? <a href="/login">Login here</a>
                </p>
            </div>
        </div>
    );
}
