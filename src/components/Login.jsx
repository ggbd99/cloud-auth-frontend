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
            <div className="login-content-wrapper">
                <div className="login-card">
                    <div className="login-header">
                        <div className="lock-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
                                <path d="M7 11V7C7 4.79086 8.79086 3 11 3H13C15.2091 3 17 4.79086 17 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                        <h1>Welcome Back</h1>
                        <p className="subtitle">Sign in to manage your whitelisted devices</p>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <div className="google-login-wrapper">
                        <GoogleLogin
                            onSuccess={handleSuccess}
                            onError={handleError}
                            theme="filled_blue"
                            size="large"
                            text="signin_with"
                            width="100%"
                        />
                    </div>

                    <div className="login-benefits">
                        <div className="benefit-item">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M13.3333 4L6 11.3333L2.66667 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>Secure device authentication</span>
                        </div>
                        <div className="benefit-item">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M13.3333 4L6 11.3333L2.66667 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>Real-time device monitoring</span>
                        </div>
                        <div className="benefit-item">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M13.3333 4L6 11.3333L2.66667 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>Complete access control</span>
                        </div>
                    </div>

                    <p className="register-link">
                        Don't have an account? <a href="/register">Register here</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
