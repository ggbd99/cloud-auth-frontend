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

                    <div className="google-login-wrapper">
                        <GoogleLogin
                            onSuccess={handleRegister}
                            onError={() => setError('Google Sign-In failed')}
                            theme="filled_blue"
                            size="large"
                            text="signup_with"
                            width="100%"
                        />
                    </div>

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
