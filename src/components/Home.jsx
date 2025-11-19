import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <div className="home-card">
                <h1>🔐 Device Whitelist Auth</h1>
                <p className="home-subtitle">Secure device authentication for your application</p>

                <div className="home-description">
                    <p>Manage whitelisted devices with Google authentication.</p>
                    <p>Each user maintains their own device whitelist.</p>
                </div>

                <div className="home-buttons">
                    <button
                        className="home-btn home-btn-login"
                        onClick={() => navigate('/login')}
                    >
                        Login
                    </button>
                    <button
                        className="home-btn home-btn-register"
                        onClick={() => navigate('/register')}
                    >
                        Register
                    </button>
                </div>
            </div>
        </div>
    );
}
