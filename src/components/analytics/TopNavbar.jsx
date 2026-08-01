import React, { useState } from 'react';

export default function TopNavbar({ 
  activeTab, 
  setActiveTab, 
  userRole, 
  notifications, 
  showNotifPanel, 
  setShowNotifPanel, 
  onLogout,
  currentTheme,
  onThemeChange
}) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="top-navbar">
      <style>{`
        .top-navbar {
          position: sticky;
          top: 0;
          right: 0;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          box-sizing: border-box;
          z-index: 90;
        }

        .search-container {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 6px 12px;
          gap: 8px;
          width: 320px;
          box-sizing: border-box;
          transition: all 0.2s ease;
        }

        .search-container:focus-within {
          border-color: rgba(59, 130, 246, 0.45);
          background: rgba(255, 255, 255, 0.06);
          box-shadow: 0 0 12px rgba(59, 130, 246, 0.1);
        }

        .search-input {
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-primary, #f8fafc);
          font-size: 0.82rem;
          width: 100%;
        }

        .search-shortcut {
          font-size: 0.65rem;
          font-weight: 700;
          padding: 2px 6px;
          background: rgba(255, 255, 255, 0.07);
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--text-secondary, #94a3b8);
        }

        .navbar-actions-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .nav-icon-btn {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: var(--text-secondary, #94a3b8);
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          transition: all 0.2s ease;
        }

        .nav-icon-btn:hover, .nav-icon-btn.active {
          background: rgba(59, 130, 246, 0.1);
          color: #60a5fa;
          border-color: rgba(59, 130, 246, 0.35);
        }

        .nav-bell-badge {
          position: absolute;
          top: -3px;
          right: -3px;
          background: #ef4444;
          color: #ffffff;
          font-size: 0.62rem;
          font-weight: 800;
          min-width: 15px;
          height: 15px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #0f172a;
        }

        .profile-trigger-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 12px;
          transition: all 0.2s ease;
        }

        .profile-trigger-btn:hover {
          background: rgba(255, 255, 255, 0.03);
        }

        .avatar-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6 0%, #ec4899 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.8rem;
          color: #ffffff;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .profile-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }

        .profile-name {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-primary, #f8fafc);
        }

        .profile-role {
          font-size: 0.68rem;
          color: var(--text-secondary, #94a3b8);
        }

        .profile-dropdown-card {
          position: absolute;
          top: 60px;
          right: 2rem;
          background: rgba(30, 41, 59, 0.95);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 12px;
          min-width: 180px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          z-index: 110;
        }

        .dropdown-logout-btn {
          width: 100%;
          padding: 8px;
          background: transparent;
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #f87171;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .dropdown-logout-btn:hover {
          background: rgba(239, 68, 68, 0.1);
          border-color: #ef4444;
        }
      `}</style>

      {/* Modern Search */}
      <div className="search-container">
        <span style={{ fontSize: '0.9rem', opacity: 0.6 }}>🔍</span>
        <input 
          type="text" 
          placeholder="Search creators, campaigns, trends..." 
          className="search-input"
        />
        <span className="search-shortcut">⌘K</span>
      </div>

      {/* Right Row Actions */}
      <div className="navbar-actions-row">
        {/* Theme Toggle Button */}
        <button 
          type="button" 
          className="nav-icon-btn"
          onClick={() => onThemeChange(currentTheme === 'dark' ? 'light' : 'dark')}
          title="Toggle Theme"
        >
          {currentTheme === 'dark' ? '☀️' : '🌙'}
        </button>

        {/* Notifications Bell */}
        <button 
          type="button" 
          className={`nav-icon-btn ${showNotifPanel ? 'active' : ''}`}
          onClick={() => setShowNotifPanel(!showNotifPanel)}
          title="Notifications"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          {unreadCount > 0 && (
            <span className="nav-bell-badge">{unreadCount}</span>
          )}
        </button>

        {/* Settings button */}
        <button 
          type="button" 
          className={`nav-icon-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
          title="Account Settings"
        >
          ⚙️
        </button>

        {/* Vertical divider */}
        <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.08)', margin: '0 4px' }}></div>

        {/* Profile details dropdown */}
        <div style={{ position: 'relative' }}>
          <button 
            type="button" 
            className="profile-trigger-btn"
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
          >
            <div className="avatar-circle">
              {userRole.charAt(0)}
            </div>
            <div className="profile-info">
              <span className="profile-name">Creator User</span>
              <span className="profile-role">{userRole}</span>
            </div>
          </button>

          {showProfileDropdown && (
            <div className="profile-dropdown-card">
              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px', marginBottom: '4px' }}>
                <div className="profile-name" style={{ fontSize: '0.8rem' }}>Creator account</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>creator@example.com</div>
              </div>
              <button 
                type="button" 
                className="dropdown-logout-btn"
                onClick={onLogout}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
