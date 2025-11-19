import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <div className="home-hero">
                <div className="hero-badge">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 0L10.4 5.6L16 8L10.4 10.4L8 16L5.6 10.4L0 8L5.6 5.6L8 0Z" fill="currentColor" />
                    </svg>
                    <span>Secure Authentication</span>
                </div>

                <h1 className="hero-title">
                    Device Whitelist
                    <span className="gradient-text">Authentication</span>
                </h1>

                <p className="hero-description">
                    Enterprise-grade device authentication system with multi-provider support.
                    Manage whitelisted devices with precision and security.
                </p>

                <div className="hero-buttons">
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/login')}
                    >
                        Sign In
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate('/register')}
                    >
                        Create Account
                    </button>
                </div>

                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M12 15C15.3137 15 18 12.3137 18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9C6 12.3137 8.68629 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 21C2 17.134 5.13401 14 9 14H15C18.866 14 22 17.134 22 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h3>Multi-Provider</h3>
                        <p>Each provider manages their own device whitelist independently</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h3>Device Tracking</h3>
                        <p>Comprehensive fingerprinting and real-time device monitoring</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
                                <path d="M7 11V7C7 4.79086 8.79086 3 11 3H13C15.2091 3 17 4.79086 17 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                        <h3>Secure Access</h3>
                        <p>Google OAuth integration with device-level authorization</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
