import React, { useState } from 'react';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    const baseUrl = 'http://localhost:8000';

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
          throw new Error(data.detail || 'Login failed. Please check your credentials.');
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
          throw new Error(data.detail || 'Registration failed.');
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
    <div className="auth-container">
      {/* Premium Glassmorphic Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        .auth-container {
          background-color: #0b0f19;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          font-family: 'Inter', sans-serif;
          color: #f8fafc;
          position: relative;
          overflow: hidden;
        }

        /* Ambient Glow Backgrounds */
        .auth-glow-1 {
          position: absolute;
          top: 10%;
          left: 10%;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: rgba(59, 130, 246, 0.15);
          filter: blur(80px);
          pointer-events: none;
        }

        .auth-glow-2 {
          position: absolute;
          bottom: 10%;
          right: 10%;
          width: 350px;
          height: 350px;
          border-radius: 50%;
          background: rgba(139, 92, 246, 0.15);
          filter: blur(90px);
          pointer-events: none;
        }

        .auth-card {
          background: rgba(30, 41, 59, 0.6);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          padding: 2.5rem;
          width: 100%;
          max-width: 440px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          z-index: 10;
          box-sizing: border-box;
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
          background: linear-gradient(135deg, #f8fafc 0%, #3b82f6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .auth-subtitle {
          font-size: 0.875rem;
          color: #64748b;
        }

        .auth-tabs {
          display: flex;
          background: rgba(15, 23, 42, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 2rem;
        }

        .auth-tab {
          flex: 1;
          background: transparent;
          border: none;
          color: #94a3b8;
          padding: 10px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .auth-tab.active {
          background: #3b82f6;
          color: #f8fafc;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
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
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .form-input {
          background: rgba(15, 23, 42, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 12px 16px;
          color: #f8fafc;
          font-size: 0.9375rem;
          transition: all 0.2s ease;
          box-sizing: border-box;
          width: 100%;
        }

        .form-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
          background: rgba(15, 23, 42, 0.7);
        }

        .form-select {
          background: rgba(15, 23, 42, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 12px 16px;
          color: #f8fafc;
          font-size: 0.9375rem;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 100%;
          box-sizing: border-box;
        }

        .form-select:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .form-select option {
          background-color: #0b0f19;
          color: #f8fafc;
        }

        .auth-btn {
          background: #3b82f6;
          border: none;
          color: #f8fafc;
          padding: 14px;
          border-radius: 12px;
          font-size: 0.9375rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 1rem;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }

        .auth-btn:hover {
          background: #2563eb;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
        }

        .auth-btn:active {
          transform: translateY(0);
        }

        .auth-btn:disabled {
          background: #1d4ed8;
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

      {/* Decorative Glows */}
      <div className="auth-glow-1"></div>
      <div className="auth-glow-2"></div>

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
