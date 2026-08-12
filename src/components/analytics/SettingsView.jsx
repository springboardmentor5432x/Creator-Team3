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
          className={`settings-nav-btn ${activeSubTab === 'themes' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('themes')}
        >
          UI Themes
        </button>
        <button 
          className={`settings-nav-btn ${activeSubTab === 'connections' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('connections')}
        >
          Connected Accounts
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

        {/* 4. Connected Accounts Settings */}
        {activeSubTab === 'connections' && (
          <ConnectedAccountsTab token={token} />
        )}
      </div>
    </div>
  );
}

function ConnectedAccountsTab({ token }) {
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [ytChannelId, setYtChannelId] = useState('UCBJycsmduvYEL83R_U4JriQ');
  const [ytResult, setYtResult] = useState(null);
  const [ytLoading, setYtLoading] = useState(false);
  const [ytError, setYtError] = useState('');
  
  const [igHandle, setIgHandle] = useState('');
  const [igPassword, setIgPassword] = useState('');
  const [igResult, setIgResult] = useState(null);
  const [igLoading, setIgLoading] = useState(false);
  const [igError, setIgError] = useState('');
  
  const [connLoading, setConnLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  // LinkedIn state (query-by-handle, same pattern as Instagram, with manual fallback
  // since LinkedIn blocks automated lookups far more often than Instagram does)
  const [liHandle, setLiHandle] = useState('microsoft');
  const [liResult, setLiResult] = useState(null);
  const [liLoading, setLiLoading] = useState(false);
  const [liError, setLiError] = useState('');
  const [liManualMode, setLiManualMode] = useState(false);
  const [liManualName, setLiManualName] = useState('');
  const [liManualFollowers, setLiManualFollowers] = useState('');

  const handleFetchLinkedIn = async (e) => {
    e.preventDefault();
    setLiResult(null);
    setLiError('');
    setLiManualMode(false);
    setLiLoading(true);
    setFeedback({ type: '', text: '' });

    try {
      const cleanHandle = liHandle.replace('@', '').trim();
      const res = await fetch(`http://127.0.0.1:8000/api/social/linkedin/scrape/${encodeURIComponent(cleanHandle)}`);
      const data = await res.json();
      if (!res.ok) {
        // LinkedIn blocked the automated lookup - drop into manual entry instead of just failing
        setLiManualMode(true);
        setLiManualName(cleanHandle);
        throw new Error(data.detail || 'LinkedIn blocked this lookup.');
      }
      setLiResult(data);
    } catch (err) {
      setLiError(err.message);
    } finally {
      setLiLoading(false);
    }
  };

  const handleSaveLinkedInManual = () => {
    if (!liManualName.trim()) {
      setLiError('Enter an account name first.');
      return;
    }
    handleSaveConnection('LinkedIn', liManualName.trim(), liManualFollowers || 0);
    setLiManualMode(false);
    setLiManualFollowers('');
  };

  // Twitter / X state - same query-by-handle + manual-fallback pattern
  const [twHandle, setTwHandle] = useState('elonmusk');
  const [twResult, setTwResult] = useState(null);
  const [twLoading, setTwLoading] = useState(false);
  const [twError, setTwError] = useState('');
  const [twManualMode, setTwManualMode] = useState(false);
  const [twManualName, setTwManualName] = useState('');
  const [twManualFollowers, setTwManualFollowers] = useState('');

  const handleFetchTwitter = async (e) => {
    e.preventDefault();
    setTwResult(null);
    setTwError('');
    setTwManualMode(false);
    setTwLoading(true);
    setFeedback({ type: '', text: '' });

    try {
      const cleanHandle = twHandle.replace('@', '').trim();
      const res = await fetch(`http://127.0.0.1:8000/api/social/twitter/scrape/${encodeURIComponent(cleanHandle)}`);
      const data = await res.json();
      if (!res.ok) {
        // X blocked the automated lookup - drop into manual entry instead of just failing
        setTwManualMode(true);
        setTwManualName(cleanHandle);
        throw new Error(data.detail || 'X / Twitter blocked this lookup.');
      }
      setTwResult(data);
    } catch (err) {
      setTwError(err.message);
    } finally {
      setTwLoading(false);
    }
  };

  const handleSaveTwitterManual = () => {
    if (!twManualName.trim()) {
      setTwError('Enter an account name first.');
      return;
    }
    handleSaveConnection('Twitter', twManualName.trim(), twManualFollowers || 0);
    setTwManualMode(false);
    setTwManualFollowers('');
  };

  // Facebook state - official Meta Graph API OAuth connection (Facebook Login
  // for Business), not scraping. This mirrors how a production integration
  // should work: redirect to Facebook's consent screen, come back with a
  // `code`, hand it to the backend, which talks to graph.facebook.com directly.
  const [fbAccount, setFbAccount] = useState(null);
  const [fbStatusLoading, setFbStatusLoading] = useState(true);
  const [fbConnectLoading, setFbConnectLoading] = useState(false);
  const [fbError, setFbError] = useState('');
  const [fbNotConfigured, setFbNotConfigured] = useState('');

  const FB_OAUTH_STATE = 'creatoriq_fb_state';

  const fetchFacebookStatus = async () => {
    try {
      setFbStatusLoading(true);
      const res = await fetch('http://127.0.0.1:8000/api/auth/facebook/status', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setFbAccount(data.connected ? data : null);
    } catch (err) {
      console.error(err);
    } finally {
      setFbStatusLoading(false);
    }
  };

  const handleConnectFacebook = async () => {
    setFbError('');
    setFbNotConfigured('');
    setFbConnectLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/auth/facebook/connect', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!data.configured) {
        setFbNotConfigured(data.error || 'Meta Developer App is not configured on the backend.');
        return;
      }
      // Hand off to Facebook's official OAuth consent screen
      window.location.href = data.authorization_url;
    } catch (err) {
      setFbError(err.message || 'Failed to start Facebook OAuth flow.');
    } finally {
      setFbConnectLoading(false);
    }
  };

  const handleDisconnectFacebook = async () => {
    setFbError('');
    try {
      const res = await fetch('http://127.0.0.1:8000/api/auth/facebook/disconnect', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to disconnect Facebook Page');
      setFbAccount(null);
      setFeedback({ type: 'success', text: 'Disconnected Facebook Page.' });
      fetchConnectedAccounts();
    } catch (err) {
      setFbError(err.message);
    }
  };

  // Complete the OAuth round-trip: Facebook redirects back to this same page
  // with ?code=...&state=creatoriq_fb_state - pick that up once, exchange it
  // with the backend, then scrub the URL so a refresh doesn't replay it.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');

    if (code && state === FB_OAUTH_STATE && token) {
      (async () => {
        setFbConnectLoading(true);
        setFbError('');
        try {
          const res = await fetch('http://127.0.0.1:8000/api/auth/facebook/callback', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ code })
          });
          const data = await res.json();
          if (data.status !== 'connected') {
            throw new Error(data.error || 'Failed to complete Facebook connection.');
          }
          setFeedback({ type: 'success', text: `Connected Facebook Page: ${data.page_name}!` });
          fetchConnectedAccounts();
          fetchFacebookStatus();
        } catch (err) {
          setFbError(err.message);
        } finally {
          setFbConnectLoading(false);
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      })();
    } else if (code && state === 'creatoriq_twitch_state' && token) {
      (async () => {
        setConnLoading(true);
        try {
          const res = await fetch('http://127.0.0.1:8000/api/auth/twitch/callback', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ code })
          });
          const data = await res.json();
          if (data.status !== 'connected') {
            throw new Error(data.error || 'Failed to complete Twitch connection.');
          }
          setFeedback({ type: 'success', text: `Connected Twitch Channel: ${data.username}!` });
          fetchConnectedAccounts();
        } catch (err) {
          setFeedback({ type: 'error', text: err.message });
        } finally {
          setConnLoading(false);
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      })();
    } else {
      fetchFacebookStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchConnectedAccounts = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/social/accounts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setConnectedAccounts(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchConnectedAccounts();
    }
  }, [token]);

  const handleFetchYoutube = async (e) => {
    e.preventDefault();
    setYtResult(null);
    setYtError('');
    setYtLoading(true);
    setFeedback({ type: '', text: '' });

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/social/youtube/${ytChannelId.trim()}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Failed to fetch YouTube stats');
      }
      if (data.error) {
        throw new Error(data.error);
      }
      setYtResult(data);
    } catch (err) {
      setYtError(err.message);
    } finally {
      setYtLoading(false);
    }
  };

  const handleFetchInstagram = async (e) => {
    e.preventDefault();
    setIgResult(null);
    setIgError('');
    setIgLoading(true);
    setFeedback({ type: '', text: '' });

    try {
      const cleanHandle = igHandle.replace('@', '').trim();
      const res = await fetch(`http://127.0.0.1:8000/api/instagram/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: cleanHandle,
          password: igPassword
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Failed to connect Instagram account');
      }
      setFeedback({ type: 'success', text: `Successfully connected Instagram account: @${data.username}!` });
      setIgPassword('');
      fetchConnectedAccounts();
    } catch (err) {
      setIgError(err.message);
    } finally {
      setIgLoading(false);
    }
  };

  const handleSaveConnection = async (platform, name, followers, cid = '') => {
    setConnLoading(true);
    setFeedback({ type: '', text: '' });
    try {
      const res = await fetch('http://127.0.0.1:8000/api/social/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          platform,
          account_name: name,
          followers: parseInt(followers, 10) || 0,
          channel_id: cid
        })
      });
      
      const json = await res.json();
      if (!res.ok) throw new Error(json.detail || 'Failed to save connection');
      
      setFeedback({ type: 'success', text: `Successfully connected ${platform} account: ${name}!` });
      setYtResult(null);
      fetchConnectedAccounts();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    } finally {
      setConnLoading(false);
    }
  };

  const handleDisconnect = async (platform) => {
    setFeedback({ type: '', text: '' });
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/social/accounts/${platform}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setFeedback({ type: 'success', text: `Disconnected ${platform} account.` });
        fetchConnectedAccounts();
      } else {
        const errJson = await res.json();
        throw new Error(errJson.detail || 'Failed to disconnect account');
      }
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    }
  };

  return (
    <div>
      <h2 className="settings-title">Connected Accounts</h2>
      <p className="settings-subtitle">Link and manage your live social media profile telemetry.</p>
      
      {feedback.text && (
        <div className={`settings-banner ${feedback.type}`} style={{ marginBottom: '1.5rem' }}>
          {feedback.text}
        </div>
      )}

      {/* Currently Connected Accounts Panel */}
      <div style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <h3 style={{ fontSize: '1.1rem', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          🔗 Active Social Connections ({connectedAccounts.length})
        </h3>
        
        {connectedAccounts.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
            No accounts currently linked. Link your public platforms below to enable live dashboard feeds.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {connectedAccounts.map((acc, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '10px',
                border: '1px solid var(--border-color)'
              }}>
                <div>
                  <span style={{ fontWeight: '700', marginRight: '8px' }}>
                    {acc.platform === 'YouTube' ? '🔴' : (acc.platform === 'Instagram' ? '🌀' : '💼')} {acc.platform}:
                  </span>
                  <span style={{ color: '#60a5fa', fontWeight: '600' }}>{acc.account_name}</span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginLeft: '12px' }}>
                    ({acc.followers.toLocaleString()} subscribers)
                  </span>
                </div>
                <button 
                  type="button" 
                  onClick={() => handleDisconnect(acc.platform)}
                  style={{
                    background: 'rgba(239, 68, 68, 0.15)',
                    color: '#f87171',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Disconnect
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* YouTube Connection Card */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '1.5rem'
        }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🔴 Connect YouTube Channel
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem', lineHeight: '1.4' }}>
            Validate stats from Google Cloud APIs and bind them directly to the CreatorIQ dashboard database.
          </p>
          
          <form onSubmit={handleFetchYoutube} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <input 
              type="text" 
              className="settings-input"
              style={{ maxWidth: '300px' }}
              placeholder="Paste YouTube URL, @handle or Channel ID"
              value={ytChannelId}
              onChange={(e) => setYtChannelId(e.target.value)}
              required
            />
            <button 
              type="submit" 
              className="save-btn" 
              style={{ padding: '10px 18px', margin: 0 }}
              disabled={ytLoading}
            >
              {ytLoading ? 'Querying...' : 'Query Channel'}
            </button>
          </form>

          {ytError && (
            <div className="settings-banner error" style={{ margin: '1rem 0 0 0' }}>
              YouTube API Error: {ytError}
            </div>
          )}

          {ytResult && (
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '1.25rem',
              marginTop: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <h4 style={{ margin: 0, color: 'var(--accent-primary)', fontSize: '0.95rem' }}>
                Channel Found: {ytResult.channel_name}
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>Subscribers</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: '2px' }}>{ytResult.subscribers.toLocaleString()}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>Views</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: '2px' }}>{ytResult.views.toLocaleString()}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>Videos</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: '2px' }}>{ytResult.videos.toLocaleString()}</div>
                </div>
              </div>
              <button 
                type="button"
                className="save-btn"
                style={{ padding: '8px 16px', fontSize: '0.8rem', background: '#22c55e', alignSelf: 'flex-start' }}
                disabled={connLoading}
                onClick={() => handleSaveConnection('YouTube', ytResult.channel_name, ytResult.subscribers, ytResult.channel_id)}
              >
                {connLoading ? 'Linking...' : 'Confirm Connection ➔'}
              </button>
            </div>
          )}
        </div>

        {/* Instagram Connection Card */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '1.5rem'
        }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📸 Connect Instagram Profile
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem', lineHeight: '1.4' }}>
            Fetch live statistics directly from Instagram and bind them to your dashboard.
          </p>
          
          <form onSubmit={handleFetchInstagram} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem', maxWidth: '300px' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <span style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-secondary)' }}>@</span>
              <input 
                type="text" 
                className="settings-input"
                style={{ width: '100%', paddingLeft: '30px' }}
                placeholder="instagram_handle"
                value={igHandle}
                onChange={(e) => setIgHandle(e.target.value)}
                required
              />
            </div>
            <div style={{ position: 'relative', width: '100%' }}>
              <input 
                type="password" 
                className="settings-input"
                style={{ width: '100%' }}
                placeholder="password"
                value={igPassword}
                onChange={(e) => setIgPassword(e.target.value)}
                required
              />
            </div>
            <button 
              type="submit" 
              className="save-btn" 
              style={{ padding: '10px 18px', margin: 0, background: '#db2777' }}
              disabled={igLoading}
            >
              {igLoading ? 'Connecting...' : 'Connect Profile'}
            </button>
          </form>

          {igError && (
            <div className="settings-banner error" style={{ margin: '1rem 0 0 0' }}>
              Instagram Connect Error: {igError}
            </div>
          )}
        </div>

        {/* LinkedIn Connection Card */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '1.5rem'
        }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            💼 Connect LinkedIn Company Page
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem', lineHeight: '1.4' }}>
            Fetch live follower stats from a public LinkedIn Company Page and bind them to your dashboard.
            LinkedIn sometimes blocks automated lookups — if that happens you can enter your stats manually instead.
          </p>

          <form onSubmit={handleFetchLinkedIn} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <input
              type="text"
              className="settings-input"
              style={{ maxWidth: '300px' }}
              placeholder="Company handle, e.g. microsoft"
              value={liHandle}
              onChange={(e) => setLiHandle(e.target.value)}
              required
            />
            <button
              type="submit"
              className="save-btn"
              style={{ padding: '10px 18px', margin: 0, background: '#0a66c2' }}
              disabled={liLoading}
            >
              {liLoading ? 'Querying...' : 'Query Profile'}
            </button>
          </form>

          {liError && (
            <div className="settings-banner error" style={{ margin: '1rem 0 0 0' }}>
              LinkedIn Lookup: {liError}
            </div>
          )}

          {liResult && (
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(10, 102, 194, 0.3)',
              borderRadius: '12px',
              padding: '1.25rem',
              marginTop: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <h4 style={{ margin: 0, color: '#0a66c2', fontSize: '0.95rem' }}>
                Profile Found: {liResult.name}
              </h4>
              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>Followers</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: '2px' }}>{liResult.followers.toLocaleString()}</div>
              </div>
              <button
                type="button"
                className="save-btn"
                style={{ padding: '8px 16px', fontSize: '0.8rem', background: '#22c55e', alignSelf: 'flex-start' }}
                disabled={connLoading}
                onClick={() => handleSaveConnection('LinkedIn', liResult.name, liResult.followers)}
              >
                {connLoading ? 'Linking...' : 'Confirm Connection ➔'}
              </button>
            </div>
          )}

          {liManualMode && (
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '1.25rem',
              marginTop: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Automated lookup was blocked — enter your stats manually
              </h4>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  className="settings-input"
                  style={{ maxWidth: '220px' }}
                  placeholder="Account / company name"
                  value={liManualName}
                  onChange={(e) => setLiManualName(e.target.value)}
                />
                <input
                  type="number"
                  className="settings-input"
                  style={{ maxWidth: '160px' }}
                  placeholder="Followers"
                  value={liManualFollowers}
                  onChange={(e) => setLiManualFollowers(e.target.value)}
                />
                <button
                  type="button"
                  className="save-btn"
                  style={{ padding: '10px 18px', margin: 0, background: '#22c55e' }}
                  disabled={connLoading}
                  onClick={handleSaveLinkedInManual}
                >
                  {connLoading ? 'Linking...' : 'Save Manually ➔'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Twitter / X Connection Card */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '1.5rem'
        }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🐦 Connect X / Twitter Profile
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem', lineHeight: '1.4' }}>
            Fetch a public follower count from X and bind it to your dashboard.
            X retired its free public follower API, so this often gets blocked — enter your stats manually if it does.
          </p>

          <form onSubmit={handleFetchTwitter} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ position: 'relative', width: '300px' }}>
              <span style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-secondary)' }}>@</span>
              <input
                type="text"
                className="settings-input"
                style={{ width: '100%', paddingLeft: '30px' }}
                placeholder="twitter_handle"
                value={twHandle}
                onChange={(e) => setTwHandle(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="save-btn"
              style={{ padding: '10px 18px', margin: 0, background: '#1da1f2' }}
              disabled={twLoading}
            >
              {twLoading ? 'Querying...' : 'Query Profile'}
            </button>
          </form>

          {twError && (
            <div className="settings-banner error" style={{ margin: '1rem 0 0 0' }}>
              X / Twitter Lookup: {twError}
            </div>
          )}

          {twResult && (
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(29, 161, 242, 0.3)',
              borderRadius: '12px',
              padding: '1.25rem',
              marginTop: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <h4 style={{ margin: 0, color: '#1da1f2', fontSize: '0.95rem' }}>
                Profile Found: @{twResult.username}
              </h4>
              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>Followers</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: '2px' }}>{twResult.followers.toLocaleString()}</div>
              </div>
              <button
                type="button"
                className="save-btn"
                style={{ padding: '8px 16px', fontSize: '0.8rem', background: '#22c55e', alignSelf: 'flex-start' }}
                disabled={connLoading}
                onClick={() => handleSaveConnection('Twitter', `@${twResult.username}`, twResult.followers)}
              >
                {connLoading ? 'Linking...' : 'Confirm Connection ➔'}
              </button>
            </div>
          )}

          {twManualMode && (
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '1.25rem',
              marginTop: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Automated lookup was blocked — enter your stats manually
              </h4>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  className="settings-input"
                  style={{ maxWidth: '220px' }}
                  placeholder="Handle (without @)"
                  value={twManualName}
                  onChange={(e) => setTwManualName(e.target.value)}
                />
                <input
                  type="number"
                  className="settings-input"
                  style={{ maxWidth: '160px' }}
                  placeholder="Followers"
                  value={twManualFollowers}
                  onChange={(e) => setTwManualFollowers(e.target.value)}
                />
                <button
                  type="button"
                  className="save-btn"
                  style={{ padding: '10px 18px', margin: 0, background: '#22c55e' }}
                  disabled={connLoading}
                  onClick={handleSaveTwitterManual}
                >
                  {connLoading ? 'Linking...' : 'Save Manually ➔'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Facebook Connection Card - Official Meta Graph API (OAuth) */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '1.5rem'
        }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📘 Connect Facebook Page
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem', lineHeight: '1.4' }}>
            Connects your Facebook Page through Facebook's official Graph API (Facebook Login for Business) —
            the production-recommended path, with no scraping or login-wall guesswork.
          </p>

          {fbNotConfigured && (
            <div className="settings-banner error" style={{ margin: '0 0 1.25rem 0' }}>
              ⚠️ {fbNotConfigured} Add <code>META_APP_ID</code>, <code>META_APP_SECRET</code> and{' '}
              <code>FACEBOOK_REDIRECT_URI</code> to <code>backend/.env</code> (see <code>.env.example</code>).
            </div>
          )}

          {fbError && (
            <div className="settings-banner error" style={{ margin: '0 0 1.25rem 0' }}>
              Facebook API Error: {fbError}
            </div>
          )}

          {fbStatusLoading ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Checking connection status...</p>
          ) : fbAccount ? (
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(24, 119, 242, 0.3)',
              borderRadius: '12px',
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {fbAccount.profile_picture_url && (
                  <img
                    src={fbAccount.profile_picture_url}
                    alt={fbAccount.page_name}
                    style={{ width: '44px', height: '44px', borderRadius: '10px', objectFit: 'cover' }}
                  />
                )}
                <div>
                  <h4 style={{ margin: 0, color: '#1877f2', fontSize: '0.95rem' }}>
                    {fbAccount.page_name} {fbAccount.is_verified ? '✔️' : ''}
                  </h4>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '2px' }}>
                    {fbAccount.category ? `${fbAccount.category} • ` : ''}
                    {fbAccount.followers_count.toLocaleString()} followers
                    {fbAccount.last_synced_at ? ` • synced ${fbAccount.last_synced_at}` : ''}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleDisconnectFacebook}
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: '#f87171',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="save-btn"
              style={{ padding: '10px 18px', margin: 0, background: '#1877f2', display: 'flex', alignItems: 'center', gap: '8px' }}
              disabled={fbConnectLoading}
              onClick={handleConnectFacebook}
            >
              {fbConnectLoading ? 'Redirecting to Facebook...' : '📘 Connect with Facebook'}
            </button>
          )}
        </div>

        {/* Demo Platform Connectors */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '1.5rem'
        }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ⚡ Demo Platform Integrators
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            Simulate connections for other social accounts to verify multi-platform revenue calculations and audience charts.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button 
              type="button" 
              className="save-btn"
              style={{ background: '#00f0ff', color: '#000000' }}
              onClick={() => handleSaveConnection('TikTok', '@tiktok_demo', 234300)}
            >
              Connect TikTok Account
            </button>
          </div>
        </div>

        {/* Twitch Connection Card */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '1.5rem'
        }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🟣 Connect Twitch Channel
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem', lineHeight: '1.4' }}>
            Fetch live statistics directly from Twitch API and bind them to your dashboard.
          </p>
          
          <form onSubmit={async (e) => {
            e.preventDefault();
            try {
              setConnLoading(true);
              const formData = new FormData(e.target);
              const username = formData.get("twitchUsername");
              const res = await fetch('http://127.0.0.1:8000/api/auth/twitch/mock-connect', {
                method: 'POST',
                headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ username })
              });
              const data = await res.json();
              if (res.ok) {
                setFeedback({ type: 'success', text: `Successfully connected mock Twitch account: ${data.username}!` });
                fetchConnectedAccounts();
              } else {
                setFeedback({ type: 'error', text: data.error || 'Failed to mock connect Twitch.' });
              }
            } catch (err) {
              setFeedback({ type: 'error', text: err.message });
            } finally {
              setConnLoading(false);
            }
          }} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', maxWidth: '300px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <span style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-secondary)' }}>@</span>
              <input 
                type="text" 
                name="twitchUsername"
                className="settings-input"
                style={{ width: '100%', paddingLeft: '30px' }}
                placeholder="twitch_handle"
                required
              />
            </div>
            <button 
              type="submit" 
              className="save-btn"
              style={{ background: '#9146ff' }}
              disabled={connLoading}
            >
              {connLoading ? '...' : 'Connect'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
