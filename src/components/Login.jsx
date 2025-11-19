import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import './Login.css';

export default function Login() {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { adminLogin } = useAuth();
    const navigate = useNavigate();

    const handleSuccess = async (credentialResponse) => {
        setError('');
        setIsLoading(true);
        const result = await adminLogin(credentialResponse.credential);
        setIsLoading(false);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
        }
    };

    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                setIsLoading(true);
                // Exchange the access token for user info
                const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const userInfo = await userInfoResponse.json();

                // Get ID token by making another request
                const response = await fetch('https://oauth2.googleapis.com/token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({
                        code: tokenResponse.code,
                        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                        redirect_uri: window.location.origin,
                        grant_type: 'authorization_code',
                    }),
                });
                const data = await response.json();

                if (data.id_token) {
                    const result = await adminLogin(data.id_token);
                    if (result.success) {
                        navigate('/dashboard');
                    } else {
                        setError(result.error);
                    }
                }
                setIsLoading(false);
            } catch (err) {
                setError('Login failed: ' + err.message);
                setIsLoading(false);
            }
        },
        onError: () => {
            setError('Google Login Failed');
            setIsLoading(false);
        },
        flow: 'auth-code',
    });

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

                    <button
                        className="google-login-button"
                        onClick={() => login()}
                        disabled={isLoading}
                    >
                        <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        {isLoading ? 'Signing in...' : 'Sign in with Google'}
                    </button>

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
