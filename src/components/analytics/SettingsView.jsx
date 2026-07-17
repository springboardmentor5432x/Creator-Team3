import React, { useState, useEffect } from 'react';

const themesList = [
  { id: 'midnight', name: 'Slate Midnight', accent: '#3b82f6', bg: '#0b0f19', colors: ['#0b0f19', '#1e293b', '#3b82f6'] },
  { id: 'aurora', name: 'Emerald Aurora', accent: '#10b981', bg: '#06140f', colors: ['#06140f', '#102c22', '#10b981'] },
  { id: 'amethyst', name: 'Amethyst Neon', accent: '#8b5cf6', bg: '#0f0b15', colors: ['#0f0b15', '#2b1b41', '#8b5cf6'] },
  { id: 'rose', name: 'Sunset Rose', accent: '#f43f5e', bg: '#18090f', colors: ['#18090f', '#401224', '#f43f5e'] },
  { id: 'cyberpunk', name: 'Cyberpunk 2077', accent: '#00f0ff', bg: '#0a0a0c', colors: ['#0a0a0c', '#1a1a24', '#f7e018'] },
  { id: 'light', name: 'Snow Alabaster', accent: '#2563eb', bg: '#f1f5f9', colors: ['#f1f5f9', '#ffffff', '#2563eb'] }
];

export default function SettingsView({ token, onThemeChange, currentTheme, onAuthUpdate }) {
  const [activeSubTab, setActiveSubTab] = useState('account');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [accountMessage, setAccountMessage] = useState({ type: "", text: "" });
  const [profileMessage, setProfileMessage] = useState({ type: "", text: "" });
  const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });

  // Account form state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Profile form state
  const [bio, setBio] = useState('');
  const [language, setLanguage] = useState('English');
  const [region, setRegion] = useState('United States');
  const [platform, setPlatform] = useState('YouTube');

  // Fetch current user details on mount
  const validatePassword = (value) => {
  if (value === '') {
    setPasswordError('');
    return true;
  }

  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

  if (!regex.test(value)) {
    setPasswordError(
      'Password must be at least 8 characters and include uppercase, lowercase, number and special character.'
    );
    return false;
  }

  setPasswordError('');
  return true;
};
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
    setAccountMessage({ type: '', text: '' });

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
    phone: phone
})
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to update account');

      if (data.access_token) {
        onAuthUpdate(data.access_token);
      }
      setAccountMessage({
    type: "success",
    text: "Account settings updated successfully!"
     });

setTimeout(() => {
    setAccountMessage({ type: "", text: "" });
}, 3000);
    } catch (err) {
      setAccountMessage({
    type: "error",
    text: err.message
});

setTimeout(() => {
    setAccountMessage({ type: "", text: "" });
}, 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProfileMessage({ type: '', text: '' });

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

      setProfileMessage({
    type: "success",
    text: "Profile settings updated successfully!"
});

setTimeout(() => {
    setProfileMessage({ type: "", text: "" });
}, 3000);
    } catch (err) {
      setProfileMessage({
    type: "error",
    text: err.message
});

setTimeout(() => {
    setProfileMessage({ type: "", text: "" });
}, 3000);
    } finally {
      setLoading(false);
    }
  };
const handleChangePassword = async (e) => {
    e.preventDefault();
if (newPassword !== confirmPassword) {
        setMessage({
            type: "error",
            text: "New Password and Confirm Password do not match."
        });
        return;
    }

    try {
        setLoading(true);

        const res = await fetch("http://127.0.0.1:8000/change-password", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                old_password: currentPassword,
                new_password: newPassword
            })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.detail || "Password change failed");
        }

        setPasswordMessage({
    type: "success",
    text: "Password changed successfully!"
});

setTimeout(() => {
    setPasswordMessage({ type: "", text: "" });
}, 3000);

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordError("");

    } catch (err) {
        setPasswordMessage({
    type: "error",
    text: err.message
});

setTimeout(() => {
    setPasswordMessage({ type: "", text: "" });
}, 3000);
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
          color: #ffffff;
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
          color: var(--text-primary);
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
          background: var(--input-bg);
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
          background: var(--input-bg);
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
          background: var(--input-bg);
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
          color: #ffffff;
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
          background: var(--input-bg);
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
          background: var(--bg-primary);
          padding: 6px;
          border-radius: 10px;
          border: 1px solid var(--border-color);
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
          className={`settings-nav-btn ${activeSubTab === 'password' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('password')}
        >
        Change Password
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
        {/* 1. Account Settings */}
        {activeSubTab === 'account' && (
          <div>
            <h2 className="settings-title">Account Settings</h2>
            <p className="settings-subtitle">
              Manage your personal credentials and phone security.
              </p>
            {accountMessage.text && (
    <div className={`settings-banner ${accountMessage.type}`}>
        {accountMessage.text}
    </div>
)}
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
                  <label className="settings-label">
                  Phone Number
                  </label>
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
              <button 
              type="submit" 
              className="save-btn" 
              disabled={loading || !!passwordError}
              >
                {loading ? 'Saving...' : 'Save Account Settings'}
              </button>
            </form>
          </div>
        )}

        {/* 2. Profile Settings */}
        {activeSubTab === 'profile' && (
          <div>
            <h2 className="settings-title">Creator Profile</h2>
            <p className="settings-subtitle">
              Set up platform preferences and bio for public representation.
            </p>
            {profileMessage.text && (
    <div className={`settings-banner ${profileMessage.type}`}>
        {profileMessage.text}
    </div>
)}
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

        {/* 4. Change Password */}
{activeSubTab === 'password' && (
  <div>
    <h2 className="settings-title">Change Password</h2>

    <p className="settings-subtitle">
      Update your account password securely.
    </p>
{passwordMessage.text && (
    <div className={`settings-banner ${passwordMessage.type}`}>
        {passwordMessage.text}
    </div>
)}
    <form className="settings-form" onSubmit={handleChangePassword}>

      <div className="settings-group">
        <label className="settings-label">
          Current Password
        </label>

        <input
          type="password"
          className="settings-input"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </div>

      <div className="settings-group">
        <label className="settings-label">
          New Password
        </label>

        <input
          type="password"
          className="settings-input"
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value);
            validatePassword(e.target.value);
          }}
        />

        {passwordError && (
          <p
            style={{
              color: "red",
              fontSize: "12px",
              marginTop: "5px"
            }}
          >
            {passwordError}
          </p>
        )}
      </div>

      <div className="settings-group">
        <label className="settings-label">
          Confirm Password
        </label>

        <input
          type="password"
          className="settings-input"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="save-btn"
      >
        Change Password
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
