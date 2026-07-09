import React, { useState, useEffect } from 'react';

const themesList = [
  { id: 'midnight', name: 'Slate Midnight', accent: '#3b82f6', bg: '#0b0f19', colors: ['#0b0f19', '#1e293b', '#3b82f6'] },
  { id: 'aurora', name: 'Emerald Aurora', accent: '#10b981', bg: '#06140f', colors: ['#06140f', '#102c22', '#10b981'] },
  { id: 'amethyst', name: 'Amethyst Neon', accent: '#8b5cf6', bg: '#0f0b15', colors: ['#0f0b15', '#2b1b41', '#8b5cf6'] },
  { id: 'rose', name: 'Sunset Rose', accent: '#f43f5e', bg: '#18090f', colors: ['#18090f', '#401224', '#f43f5e'] },
  { id: 'cyberpunk', name: 'Cyberpunk 2077', accent: '#00f0ff', bg: '#0a0a0c', colors: ['#0a0a0c', '#1a1a24', '#f7e018'] }
];

export default function SettingsView({ token, onThemeChange, currentTheme, onAuthUpdate }) {
  const [activeSubTab, setActiveSubTab] = useState('account');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Account form state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // Profile form state
  const [bio, setBio] = useState('');
  const [language, setLanguage] = useState('English');
  const [region, setRegion] = useState('United States');
  const [platform, setPlatform] = useState('YouTube');

  // Fetch current user details on mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://127.0.0.1:8000/api/user/details', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error('Failed to load user details');
        const data = await res.json();
        
        // Populate account settings
        setUsername(data.account.Username);
        setEmail(data.account.Email);
        setPhone(data.account.phone);
        
        // Populate profile settings
        setBio(data.profile.bio);
        setLanguage(data.profile.language);
        setRegion(data.profile.region);
        setPlatform(data.profile.platform);
      } catch (err) {
        console.error(err);
        setMessage({ type: 'error', text: 'Error loading settings from server.' });
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUserDetails();
    }
  }, [token]);

  const handleSaveAccount = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('http://127.0.0.1:8000/api/user/account', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          Username: username,
          Email: email,
          phone: phone,
          Password: password || null
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to update account');

      if (data.access_token) {
        onAuthUpdate(data.access_token);
      }
      setMessage({ type: 'success', text: 'Account settings updated successfully!' });
      setPassword(''); // clear password field
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('http://127.0.0.1:8000/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bio,
          language,
          region,
          platform
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to update profile');

      setMessage({ type: 'success', text: 'Profile settings updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-view">
      <style>{`
        .settings-view {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 2rem;
          min-height: 480px;
        }

        .settings-sidebar {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          border-right: 1px solid var(--border-color);
          padding-right: 1.5rem;
        }

        .settings-nav-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          padding: 12px 16px;
          border-radius: 10px;
          text-align: left;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .settings-nav-btn:hover {
          background: rgba(255, 255, 255, 0.03);
          color: var(--text-primary);
        }

        .settings-nav-btn.active {
          background: var(--accent-primary);
          color: #f8fafc;
          box-shadow: 0 4px 12px var(--accent-glow);
        }

        .settings-content {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 2.5rem;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }

        .settings-title {
          font-size: 1.375rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .settings-subtitle {
          font-size: 0.8125rem;
          color: var(--text-secondary);
          margin-bottom: 2rem;
        }

        .settings-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 480px;
        }

        .settings-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }

        .settings-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .settings-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .settings-input {
          background: rgba(15, 23, 42, 0.5);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          padding: 10px 14px;
          color: var(--text-primary);
          font-size: 0.875rem;
          transition: all 0.2s ease;
          width: 100%;
          box-sizing: border-box;
        }

        .settings-input:focus {
          outline: none;
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 3px var(--accent-glow);
        }

        .settings-select {
          background: rgba(15, 23, 42, 0.5);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          padding: 10px 14px;
          color: var(--text-primary);
          font-size: 0.875rem;
          cursor: pointer;
          width: 100%;
          box-sizing: border-box;
        }

        .settings-select:focus {
          outline: none;
          border-color: var(--accent-primary);
        }

        .settings-select option {
          background-color: var(--bg-primary);
          color: var(--text-primary);
        }

        .settings-textarea {
          background: rgba(15, 23, 42, 0.5);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          padding: 10px 14px;
          color: var(--text-primary);
          font-size: 0.875rem;
          resize: vertical;
          min-height: 80px;
          font-family: inherit;
          width: 100%;
          box-sizing: border-box;
        }

        .settings-textarea:focus {
          outline: none;
          border-color: var(--accent-primary);
        }

        .save-btn {
          background: var(--accent-primary);
          border: none;
          color: #f8fafc;
          padding: 12px 24px;
          border-radius: 10px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          align-self: flex-start;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px var(--accent-glow);
        }

        .save-btn:hover {
          filter: brightness(1.1);
          transform: translateY(-1px);
        }

        .save-btn:active {
          transform: translateY(0);
        }

        .save-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        /* Themes Layout */
        .themes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 1.25rem;
        }

        .theme-card {
          background: rgba(15, 23, 42, 0.3);
          border: 2px solid var(--border-color);
          border-radius: 16px;
          padding: 1.25rem;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          transition: all 0.2s ease;
        }

        .theme-card:hover {
          transform: translateY(-2px);
          border-color: rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25);
        }

        .theme-card.active {
          border-color: var(--accent-primary);
          background: rgba(255, 255, 255, 0.02);
          box-shadow: 0 4px 15px var(--accent-glow);
        }

        .theme-swatch {
          display: flex;
          gap: 4px;
          background: #0f172a;
          padding: 6px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .swatch-color {
          width: 16px;
          height: 16px;
          border-radius: 50%;
        }

        .theme-name {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        /* Banner Messages */
        .settings-banner {
          font-size: 0.8125rem;
          padding: 10px 14px;
          border-radius: 10px;
          margin-bottom: 1.5rem;
          font-weight: 500;
        }

        .settings-banner.error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #f87171;
        }

        .settings-banner.success {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.2);
          color: #34d399;
        }

        @media (max-width: 768px) {
          .settings-view {
            grid-template-columns: 1fr;
          }
          .settings-sidebar {
            flex-direction: row;
            border-right: none;
            border-bottom: 1px solid var(--border-color);
            padding-right: 0;
            padding-bottom: 1rem;
            overflow-x: auto;
          }
        }
      `}</style>

      {/* Sidebar Navigation */}
      <nav className="settings-sidebar">
        <button 
          className={`settings-nav-btn ${activeSubTab === 'account' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('account')}
        >
          Account
        </button>
        <button 
          className={`settings-nav-btn ${activeSubTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('profile')}
        >
          Creator Profile
        </button>
        <button 
          className={`settings-nav-btn ${activeSubTab === 'themes' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('themes')}
        >
          UI Themes
        </button>
      </nav>

      {/* Settings Form Pane */}
      <div className="settings-content">
        {/* Banner Msg */}
        {message.text && (
          <div className={`settings-banner ${message.type}`}>
            {message.text}
          </div>
        )}

        {/* 1. Account Settings */}
        {activeSubTab === 'account' && (
          <div>
            <h2 className="settings-title">Account Settings</h2>
            <p className="settings-subtitle">Manage your personal credentials and phone security.</p>
            <form className="settings-form" onSubmit={handleSaveAccount}>
              <div className="settings-form-row">
                <div className="settings-group">
                  <label className="settings-label">Username</label>
                  <input 
                    type="text" 
                    className="settings-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="settings-group">
                  <label className="settings-label">Phone Number</label>
                  <input 
                    type="text" 
                    className="settings-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="settings-group">
                <label className="settings-label">Email Address</label>
                <input 
                  type="email" 
                  className="settings-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="settings-group">
                <label className="settings-label">New Password (leave empty to keep current)</label>
                <input 
                  type="password" 
                  className="settings-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="save-btn" disabled={loading}>
                {loading ? 'Saving...' : 'Save Account Settings'}
              </button>
            </form>
          </div>
        )}

        {/* 2. Profile Settings */}
        {activeSubTab === 'profile' && (
          <div>
            <h2 className="settings-title">Creator Profile</h2>
            <p className="settings-subtitle">Set up platform preferences and bio for public representation.</p>
            <form className="settings-form" onSubmit={handleSaveProfile}>
              <div className="settings-group">
                <label className="settings-label">Primary Platform</label>
                <select 
                  className="settings-select"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                >
                  <option value="YouTube">YouTube</option>
                  <option value="Instagram">Instagram</option>
                  <option value="TikTok">TikTok</option>
                  <option value="Twitch">Twitch</option>
                </select>
              </div>
              <div className="settings-group">
                <label className="settings-label">Creator Bio</label>
                <textarea 
                  className="settings-textarea"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about your content, niche, or audience..."
                />
              </div>
              <div className="settings-form-row">
                <div className="settings-group">
                  <label className="settings-label">Primary Language</label>
                  <select 
                    className="settings-select"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Telugu">Telugu</option>
                  </select>
                </div>
                <div className="settings-group">
                  <label className="settings-label">Primary Region</label>
                  <select 
                    className="settings-select"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                  >
                    <option value="United States">United States</option>
                    <option value="India">India</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Germany">Germany</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="save-btn" disabled={loading}>
                {loading ? 'Saving...' : 'Save Profile Settings'}
              </button>
            </form>
          </div>
        )}

        {/* 3. Theme Settings */}
        {activeSubTab === 'themes' && (
          <div>
            <h2 className="settings-title">UI Themes</h2>
            <p className="settings-subtitle">Select a stunning, harmonious aesthetic for your dashboard.</p>
            <div className="themes-grid">
              {themesList.map((theme) => (
                <div 
                  key={theme.id}
                  className={`theme-card ${currentTheme === theme.id ? 'active' : ''}`}
                  onClick={() => onThemeChange(theme.id)}
                >
                  <div className="theme-swatch">
                    {theme.colors.map((c, i) => (
                      <div 
                        key={i} 
                        className="swatch-color" 
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <span className="theme-name">{theme.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
