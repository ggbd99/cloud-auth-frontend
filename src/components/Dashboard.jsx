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

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div>
                    <h1>Device Whitelist Manager</h1>
                    <p>Logged in as: <strong>{admin?.email}</strong></p>
                </div>
                <button onClick={logout} className="logout-btn">Logout</button>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="add-device-form">
                <h3>Add New Device</h3>
                <form onSubmit={handleAddDevice}>
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
                    <button type="submit">Add Device</button>
                </form>
            </div>

            <div className="devices-list">
                <h3>Whitelisted Devices ({devices.length})</h3>
                {loading ? (
                    <p>Loading...</p>
                ) : devices.length === 0 ? (
                    <p className="no-devices">No devices whitelisted yet.</p>
                ) : (
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
                                    <td><strong>{device.user_name || 'Unknown'}</strong></td>
                                    <td>{device.label}</td>
                                    <td className="hash-cell">{device.device_hash}</td>
                                    <td>{device.added_by}</td>
                                    <td>{new Date(device.created_at).toLocaleString()}</td>
                                    <td>
                                        <button
                                            onClick={() => handleDeleteDevice(device.id)}
                                            className="delete-btn"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
