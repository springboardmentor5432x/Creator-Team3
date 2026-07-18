import React, { useState } from 'react';
import ForgotPassword from "./ForgotPassword";
import { FaEye, FaEyeSlash } from "react-icons/fa";
export default function AuthPage({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('Creator');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
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
          background-color: var(--bg-primary);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          font-family: 'Inter', sans-serif;
          color: var(--text-primary);
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
          background: var(--accent-glow);
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
          background: var(--accent-glow);
          filter: blur(90px);
          pointer-events: none;
        }

        .auth-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
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
          background: linear-gradient(135deg, var(--text-primary) 0%, var(--accent-primary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .auth-subtitle {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .auth-tabs {
          display: flex;
          background: rgba(15, 23, 42, 0.4);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 2rem;
        }

        .auth-tab {
          flex: 1;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          padding: 10px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .auth-tab.active {
          background: var(--accent-primary);
          color: var(--text-primary);
          box-shadow: 0 4px 12px var(--accent-glow);
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
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .form-input {
          background: var(--input-bg);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 12px 16px;
          color: var(--text-primary);
          font-size: 0.9375rem;
          transition: all 0.2s ease;
          box-sizing: border-box;
          width: 100%;
        }

        .form-input:focus {
          outline: none;
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 3px var(--accent-glow);
          background: var(--input-bg);
          filter: brightness(0.95);
        }

        .form-select {
          background: var(--input-bg);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 12px 16px;
          color: var(--text-primary);
          font-size: 0.9375rem;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 100%;
          box-sizing: border-box;
        }

        .form-select:focus {
          outline: none;
          border-color: var(--accent-primary);
        }

        .form-select option {
          background-color: var(--bg-primary);
          color: var(--text-primary);
        }

        .auth-btn {
          background: var(--accent-primary);
          border: none;
          color: var(--text-primary);
          padding: 14px;
          border-radius: 12px;
          font-size: 0.9375rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 1rem;
          box-shadow: 0 4px 15px var(--accent-glow);
        }

        .auth-btn:hover {
          filter: brightness(1.1);
          transform: translateY(-1px);
          box-shadow: 0 6px 20px var(--accent-glow);
        }

        .auth-btn:active {
          transform: translateY(0);
        }

        .auth-btn:disabled {
          background: var(--accent-primary);
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
        {showForgotPassword ? (
  <ForgotPassword
    onBack={() => setShowForgotPassword(false)}
  />
) : (
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
            <div style={{ position: "relative" }}>
  <input
    type={showPassword ? "text" : "password"}
    className="form-input"
    placeholder="••••••••"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
  />

  <span
    onClick={() => setShowPassword(!showPassword)}
    style={{
      position: "absolute",
      right: "15px",
      top: "50%",
      transform: "translateY(-50%)",
      cursor: "pointer",
      color: "#888"
    }}
  >
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </span>
</div>
          </div>
          {isLogin && (
  <div style={{ textAlign: "right", marginTop: "-8px", marginBottom: "12px" }}>
    <button
      type="button"
      onClick={() => setShowForgotPassword(true)}
      style={{
        background: "none",
        border: "none",
        color: "#4f9cff",
        cursor: "pointer",
        fontSize: "14px",
        padding: 0
      }}
    >
      Forgot Password?
    </button>
  </div>
)}

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
      )}
    </div>
  );
}
