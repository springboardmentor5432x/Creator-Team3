import React, { useState } from 'react';
import SideRays from '../SideRays';

export default function AuthPage({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Creator');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const resetForm = () => {
    setUsername('');
    setEmail('');
    setPhone('');
    setPassword('');
    setRole('Creator');
    setError('');
    setSuccessMsg('');
  };

  const handleToggle = (loginState) => {
    setIsLogin(loginState);
    resetForm();
  };

  const getErrorMessage = (detail) => {
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail)) {
      return detail.map(err => {
        const fieldName = err.loc && err.loc.length > 0 ? err.loc[err.loc.length - 1] : 'Field';
        return `${fieldName}: ${err.msg}`;
      }).join(', ');
    }
    if (typeof detail === 'object' && detail !== null) {
      return JSON.stringify(detail);
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    const baseUrl = 'http://127.0.0.1:8000';

    try {
      if (isLogin) {
        // Login API Call
        const response = await fetch(`${baseUrl}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Email: email,
            Password: password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          const errMsg = getErrorMessage(data.detail) || 'Login failed. Please check your credentials.';
          throw new Error(errMsg);
        }

        // Trigger success callback with access token
        if (data.access_token) {
          onAuthSuccess(data.access_token);
        }
      } else {
        // Registration API Call
        const response = await fetch(`${baseUrl}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Username: username,
            Email: email,
            phone: phone,
            Password: password,
            role: role,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          const errMsg = getErrorMessage(data.detail) || 'Registration failed.';
          throw new Error(errMsg);
        }

        setSuccessMsg('Account registered successfully! Please log in.');
        setIsLogin(true);
        setPassword('');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Dynamic SideRays WebGL background */}
      <SideRays
        rayColor1="#EAB308"
        rayColor2="#96c8ff"
        origin="top-right"
        speed={2.5}
        intensity={2}
        spread={2}
        tilt={0}
        saturation={1.5}
        blend={0.75}
        falloff={1.6}
        opacity={1}
      />

      {/* Premium Glassmorphic Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        .auth-container {
          background-color: var(--bg-primary, #0b0f19);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          font-family: 'Inter', sans-serif;
          color: var(--text-primary, #f8fafc);
        }

        .auth-card {
          background: rgba(17, 24, 39, 0.8);
          border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-radius: 24px;
          padding: 2.5rem;
          width: 100%;
          max-width: 440px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          z-index: 10;
          box-sizing: border-box;
          position: relative;
        }

        .auth-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .auth-logo {
          font-size: 1.75rem;
          font-weight: 700;
          letter-spacing: -0.03em;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, var(--text-primary, #f8fafc) 0%, var(--accent-primary, #3b82f6) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .auth-subtitle {
          font-size: 0.875rem;
          color: var(--text-secondary, #94a3b8);
        }

        .auth-tabs {
          display: flex;
          background: rgba(15, 23, 42, 0.4);
          border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 2rem;
        }

        .auth-tab {
          flex: 1;
          background: transparent;
          border: none;
          color: var(--text-secondary, #94a3b8);
          padding: 10px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .auth-tab.active {
          background: var(--accent-primary, #3b82f6);
          color: var(--text-primary, #f8fafc);
          box-shadow: 0 4px 12px var(--accent-glow, rgba(59, 130, 246, 0.15));
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-label {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--text-secondary, #94a3b8);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .form-input {
          background: var(--input-bg, rgba(30, 41, 59, 0.6));
          border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
          border-radius: 12px;
          padding: 12px 16px;
          color: var(--text-primary, #f8fafc);
          font-size: 0.9375rem;
          transition: all 0.2s ease;
          box-sizing: border-box;
          width: 100%;
        }

        .form-input:focus {
          outline: none;
          border-color: var(--accent-primary, #3b82f6);
          box-shadow: 0 0 0 3px var(--accent-glow, rgba(59, 130, 246, 0.15));
          background: var(--input-bg, rgba(30, 41, 59, 0.6));
          filter: brightness(0.95);
        }

        .form-select {
          background: var(--input-bg, rgba(30, 41, 59, 0.6));
          border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
          border-radius: 12px;
          padding: 12px 16px;
          color: var(--text-primary, #f8fafc);
          font-size: 0.9375rem;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 100%;
          box-sizing: border-box;
        }

        .form-select:focus {
          outline: none;
          border-color: var(--accent-primary, #3b82f6);
        }

        .form-select option {
          background-color: var(--bg-primary, #0b0f19);
          color: var(--text-primary, #f8fafc);
        }

        .auth-btn {
          background: var(--accent-primary, #3b82f6);
          border: none;
          color: var(--text-primary, #f8fafc);
          padding: 14px;
          border-radius: 12px;
          font-size: 0.9375rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 1rem;
          box-shadow: 0 4px 15px var(--accent-glow, rgba(59, 130, 246, 0.15));
        }

        .auth-btn:hover {
          filter: brightness(1.1);
          transform: translateY(-1px);
          box-shadow: 0 6px 20px var(--accent-glow, rgba(59, 130, 246, 0.15));
        }

        .auth-btn:active {
          transform: translateY(0);
        }

        .auth-btn:disabled {
          background: var(--accent-primary, #3b82f6);
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .auth-message {
          font-size: 0.8125rem;
          padding: 10px 14px;
          border-radius: 10px;
          font-weight: 500;
        }

        .auth-message.error {
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.25);
          color: #f87171;
        }

        .auth-message.success {
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.25);
          color: #34d399;
        }
      `}</style>

      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-logo">CreatorIQ Portal</h2>
          <p className="auth-subtitle">
            {isLogin ? 'Sign in to access your analytics' : 'Create an account to get started'}
          </p>
        </div>

        {/* Tab Selector */}
        <div className="auth-tabs">
          <button 
            type="button" 
            className={`auth-tab ${isLogin ? 'active' : ''}`}
            onClick={() => handleToggle(true)}
          >
            Login
          </button>
          <button 
            type="button" 
            className={`auth-tab ${!isLogin ? 'active' : ''}`}
            onClick={() => handleToggle(false)}
          >
            Register
          </button>
        </div>

        {/* Status Messages */}
        {error && <div className="auth-message error">{error}</div>}
        {successMsg && <div className="auth-message success">{successMsg}</div>}

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Username</label>
              <input 
                type="text" 
                className="form-input"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-input"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input 
                type="tel" 
                className="form-input"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Role</label>
              <select 
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="Creator">Creator</option>
                <option value="Agency">Agency</option>
                <option value="Brand">Brand</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          )}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
