import React, { useState, useEffect } from 'react';

export default function AdminPanel({ token }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://127.0.0.1:8000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        if (res.status === 403) throw new Error('Access denied: Admin permissions required');
        throw new Error('Failed to load registered users');
      }
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  const handleDeleteUser = async (userId, username) => {
    if (!window.confirm(`Are you sure you want to permanently delete user "${username}" (ID: ${userId})? This will wipe all associated profiles and metrics.`)) {
      return;
    }
    try {
      setActionMessage({ type: '', text: '' });
      const res = await fetch(`http://127.0.0.1:8000/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to delete user');
      
      setActionMessage({ type: 'success', text: `User "${username}" deleted successfully!` });
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (err) {
      setActionMessage({ type: 'error', text: err.message });
    }
  };

  // Calculate statistics
  const totalUsers = users.length;
  const creatorCount = users.filter(u => u.role === 'Creator').length;
  const agencyCount = users.filter(u => u.role === 'Agency').length;
  const brandCount = users.filter(u => u.role === 'Brand').length;
  const adminCount = users.filter(u => u.role === 'Admin').length;

  return (
    <div className="admin-panel">
      <style>{`
        .admin-panel {
          font-family: 'Inter', sans-serif;
          color: var(--text-primary);
          display: flex;
          flex-direction: column;
          gap: 2rem;
          width: 100%;
        }

        .admin-title-row {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .admin-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
        }

        .admin-subtitle {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin: 0;
        }

        /* Telemetry Cards */
        .admin-telemetry-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 1.25rem;
        }

        .telemetry-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 1.25rem;
          backdrop-filter: blur(12px);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }

        .telemetry-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .telemetry-value {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        /* User Table section */
        .admin-table-container {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 1.5rem;
          backdrop-filter: blur(12px);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
          overflow-x: auto;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .admin-table th {
          padding: 12px 16px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid var(--border-color);
        }

        .admin-table td {
          padding: 14px 16px;
          font-size: 0.875rem;
          color: var(--text-primary);
          border-bottom: 1px solid var(--border-color);
        }

        .admin-table tr:last-child td {
          border-bottom: none;
        }

        .admin-table tr:hover td {
          background: rgba(255, 255, 255, 0.01);
        }

        /* Role Badges */
        .role-badge {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 9999px;
        }

        .role-badge.creator {
          background: rgba(59, 130, 246, 0.12);
          color: #60a5fa;
        }

        .role-badge.agency {
          background: rgba(139, 92, 246, 0.12);
          color: #a78bfa;
        }

        .role-badge.brand {
          background: rgba(236, 72, 153, 0.12);
          color: #f472b6;
        }

        .role-badge.admin {
          background: rgba(16, 185, 129, 0.12);
          color: #34d399;
        }

        /* Action buttons */
        .delete-user-btn {
          background: transparent;
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #f87171;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          padding: 0;
        }

        .delete-user-btn:hover {
          background: rgba(239, 68, 68, 0.15);
          border-color: #f87171;
          color: #ef4444;
          box-shadow: 0 0 10px rgba(239, 68, 68, 0.2);
        }

        .delete-user-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
          border-color: var(--border-color);
          color: var(--text-secondary);
        }

        /* Alert Banners */
        .admin-banner {
          font-size: 0.8125rem;
          padding: 10px 14px;
          border-radius: 10px;
          font-weight: 500;
        }

        .admin-banner.error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #f87171;
        }

        .admin-banner.success {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.2);
          color: #34d399;
        }

        .admin-loading {
          text-align: center;
          padding: 3rem;
          color: var(--text-secondary);
          font-size: 0.9375rem;
        }
      `}</style>

      <div className="admin-title-row">
        <h2 className="admin-title">System Control Center</h2>
        <p className="admin-subtitle">Manage user accounts and view database statistics.</p>
      </div>

      {actionMessage.text && (
        <div className={`admin-banner ${actionMessage.type}`}>
          {actionMessage.text}
        </div>
      )}

      {loading ? (
        <div className="admin-loading">Loading registered accounts...</div>
      ) : error ? (
        <div className="admin-banner error">{error}</div>
      ) : (
        <>
          {/* Telemetry row */}
          <div className="admin-telemetry-grid">
            <div className="telemetry-card">
              <span className="telemetry-label">Total Users</span>
              <span className="telemetry-value">{totalUsers}</span>
            </div>
            <div className="telemetry-card">
              <span className="telemetry-label">Creators</span>
              <span className="telemetry-value">{creatorCount}</span>
            </div>
            <div className="telemetry-card">
              <span className="telemetry-label">Agencies</span>
              <span className="telemetry-value">{agencyCount}</span>
            </div>
            <div className="telemetry-card">
              <span className="telemetry-label">Brands</span>
              <span className="telemetry-value">{brandCount}</span>
            </div>
            <div className="telemetry-card">
              <span className="telemetry-label">Admins</span>
              <span className="telemetry-value">{adminCount}</span>
            </div>
          </div>

          {/* User management grid */}
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th style={{ width: '60px', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td style={{ fontWeight: '600' }}>{user.Username}</td>
                    <td>{user.Email}</td>
                    <td>{user.phone || 'N/A'}</td>
                    <td>
                      <span className={`role-badge ${user.role.toLowerCase()}`}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ display: 'flex', justifyContent: 'center' }}>
                      <button 
                        type="button" 
                        className="delete-user-btn"
                        title={`Delete ${user.Username}`}
                        onClick={() => handleDeleteUser(user.id, user.Username)}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
