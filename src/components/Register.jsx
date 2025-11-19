import React, { useState, useRef } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import './Login.css';

export default function Register() {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { adminLogin } = useAuth();
    const googleButtonRef = useRef(null);

    const handleRegister = async (credentialResponse) => {
        try {
            setIsLoading(true);
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
            setIsLoading(false);
        } catch (err) {
            setError('Network error: ' + err.message);
            setIsLoading(false);
        }
    };

    const handleError = () => {
        setError('Google Sign-In failed');
        setIsLoading(false);
    };

    const handleCustomButtonClick = () => {
        // Trigger the hidden Google button
        const googleButton = googleButtonRef.current?.querySelector('div[role="button"]');
        if (googleButton) {
            setIsLoading(true);
            googleButton.click();
        }
    };

    return (
        <div className="login-container">
            <a href="/" className="logo-link">CLOUD AUTH</a>
            <div className="login-content-wrapper">
                <div className="login-card">
                    <div className="login-header">
                        <div className="lock-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M20 8V14M23 11H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h1>Create Account</h1>
                        <p className="subtitle">Join to start managing your device whitelist</p>
                    </div>

                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    {/* Hidden Google Login Button */}
                    <div ref={googleButtonRef} style={{ display: 'none' }}>
                        <GoogleLogin
                            onSuccess={handleRegister}
                            onError={handleError}
                            theme="filled_blue"
                            size="large"
                            text="signup_with"
                        />
                    </div>

                    {/* Custom Styled Button */}
                    <button
                        className="google-login-button"
                        onClick={handleCustomButtonClick}
                        disabled={isLoading}
                    >
                        <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        {isLoading ? 'Creating account...' : 'Sign up with Google'}
                    </button>

                    <div className="login-benefits">
                        <div className="benefit-item">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M13.3333 4L6 11.3333L2.66667 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>Instant device registration</span>
                        </div>
                        <div className="benefit-item">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M13.3333 4L6 11.3333L2.66667 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>No credit card required</span>
                        </div>
                        <div className="benefit-item">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M13.3333 4L6 11.3333L2.66667 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>Full control from day one</span>
                        </div>
                    </div>

                    <p className="register-link">
                        Already have an account? <a href="/login">Login here</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
