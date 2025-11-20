import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import './Dashboard.css';

export default function Dashboard() {
    const { admin, logout, token } = useAuth();
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newDeviceHash, setNewDeviceHash] = useState('');
    const [newUserName, setNewUserName] = useState('');
    const [newDeviceLabel, setNewDeviceLabel] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Fetch devices
    const fetchDevices = async () => {
        try {
            const response = await fetch(`${API_URL}/api/devices`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setDevices(data.devices);
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Failed to fetch devices: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDevices();
    }, []);

    // Add device
    const handleAddDevice = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await fetch(`${API_URL}/api/devices`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    device_hash: newDeviceHash,
                    user_name: newUserName,
                    label: newDeviceLabel
                })
            });

            const data = await response.json();
            if (response.ok) {
                setSuccess('Device added successfully');
                setNewDeviceHash('');
                setNewUserName('');
                setNewDeviceLabel('');
                fetchDevices();
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Failed to add device: ' + err.message);
        }
    };

    // Delete device
    const handleDeleteDevice = async (id) => {
        if (!confirm('Are you sure you want to remove this device?')) return;

        try {
            const response = await fetch(`${API_URL}/api/devices/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setSuccess('Device removed successfully');
                fetchDevices();
            } else {
                const data = await response.json();
                setError(data.error);
            }
        } catch (err) {
            setError('Failed to delete device: ' + err.message);
        }
    };

    // Calculate recent devices (last 7 days)
    const recentDevices = devices.filter(device => {
        const deviceDate = new Date(device.created_at);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return deviceDate >= weekAgo;
    });

    return (
        <div className="dashboard-container">
            {/* Header with Navigation */}
            <header className="dashboard-header-nav">
                <a href="/" className="dashboard-logo">CLOUD AUTH</a>
                <div className="user-section">
                    <div className="user-info">
                        <div className="user-avatar">
                            {admin?.email?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        <div className="user-details">
                            <span className="user-name">{admin?.email?.split('@')[0]}</span>
                            <span className="user-email">{admin?.email}</span>
                        </div>
                    </div>
                    <button onClick={logout} className="logout-btn">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M6 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M10.6667 11.3333L14 8L10.6667 4.66666" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M14 8H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Logout
                    </button>
                </div>
            </header>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card stat-card-primary">
                    <div className="stat-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M9 3H4C3.44772 3 3 3.44772 3 4V9C3 9.55228 3.44772 10 4 10H9C9.55228 10 10 9.55228 10 9V4C10 3.44772 9.55228 3 9 3Z" stroke="currentColor" strokeWidth="2" />
                            <path d="M20 3H15C14.4477 3 14 3.44772 14 4V9C14 9.55228 14.4477 10 15 10H20C20.5523 10 21 9.55228 21 9V4C21 3.44772 20.5523 3 20 3Z" stroke="currentColor" strokeWidth="2" />
                            <path d="M20 14H15C14.4477 14 14 14.4477 14 15V20C14 20.5523 14.4477 21 15 21H20C20.5523 21 21 20.5523 21 20V15C21 14.4477 20.5523 14 20 14Z" stroke="currentColor" strokeWidth="2" />
                            <path d="M9 14H4C3.44772 14 3 14.4477 3 15V20C3 20.5523 3.44772 21 4 21H9C9.55228 21 10 20.5523 10 20V15C10 14.4477 9.55228 14 9 14Z" stroke="currentColor" strokeWidth="2" />
                        </svg>
                    </div>
                    <div className="stat-content">
                        <h3 className="stat-value">{devices.length}</h3>
                        <p className="stat-label">Total Devices</p>
                    </div>
                </div>

                <div className="stat-card stat-card-secondary">
                    <div className="stat-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div className="stat-content">
                        <h3 className="stat-value">{recentDevices.length}</h3>
                        <p className="stat-label">Added This Week</p>
                    </div>
                </div>

                <div className="stat-card stat-card-accent">
                    <div className="stat-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
                            <path d="M7 11V7C7 4.79086 8.79086 3 11 3H13C15.2091 3 17 4.79086 17 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>
                    <div className="stat-content">
                        <h3 className="stat-value">{devices.length > 0 ? '100%' : '0%'}</h3>
                        <p className="stat-label">Security Level</p>
                    </div>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            {/* Add Device Form */}
            <div className="add-device-card">
                <div className="card-header">
                    <h3>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        Add New Device
                    </h3>
                </div>
                <form onSubmit={handleAddDevice}>
                    <div className="form-grid">
                        <input
                            type="text"
                            placeholder="User Name (e.g., John Doe)"
                            value={newUserName}
                            onChange={(e) => setNewUserName(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Device Hash (SHA-256)"
                            value={newDeviceHash}
                            onChange={(e) => setNewDeviceHash(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Label (e.g., Work PC)"
                            value={newDeviceLabel}
                            onChange={(e) => setNewDeviceLabel(e.target.value)}
                        />
                        <button type="submit">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            Add Device
                        </button>
                    </div>
                </form>
            </div>

            {/* Devices Table */}
            <div className="devices-card">
                <div className="card-header">
                    <h3>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M2.5 5.83333H17.5M2.5 10H17.5M2.5 14.1667H17.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        Whitelisted Devices ({devices.length})
                    </h3>
                </div>
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading devices...</p>
                    </div>
                ) : devices.length === 0 ? (
                    <div className="empty-state">
                        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                            <rect x="8" y="24" width="48" height="32" rx="4" stroke="currentColor" strokeWidth="2" />
                            <path d="M18 24V18C18 13.6 21.6 10 26 10H38C42.4 10 46 13.6 46 18V24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <h4>No devices whitelisted yet</h4>
                        <p>Add your first device to get started</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>User Name</th>
                                    <th>Label</th>
                                    <th>Device Hash</th>
                                    <th>Added By</th>
                                    <th>Created At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {devices.map(device => (
                                    <tr key={device.id}>
                                        <td>
                                            <div className="user-cell">
                                                <div className="user-avatar-small">
                                                    {device.user_name?.charAt(0).toUpperCase() || 'U'}
                                                </div>
                                                <strong>{device.user_name || 'Unknown'}</strong>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="device-label">{device.label || '-'}</span>
                                        </td>
                                        <td className="hash-cell">{device.device_hash}</td>
                                        <td>{device.added_by}</td>
                                        <td>{new Date(device.created_at).toLocaleString()}</td>
                                        <td>
                                            <button
                                                onClick={() => handleDeleteDevice(device.id)}
                                                className="delete-btn"
                                            >
                                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                    <path d="M1 3.5H13M5.5 6.5V10.5M8.5 6.5V10.5M2 3.5L3 12.5C3 12.7761 3.22386 13 3.5 13H10.5C10.7761 13 11 12.7761 11 12.5L12 3.5M5 3.5V1.5C5 1.22386 5.22386 1 5.5 1H8.5C8.77614 1 9 1.22386 9 1.5V3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
