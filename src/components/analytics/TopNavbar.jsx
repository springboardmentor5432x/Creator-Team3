import React, { useState, useEffect, useRef } from 'react';
import { Palette, Bell, Settings, Search, LogOut, ChevronDown, ChevronRight, Command } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function TopNavbar({ 
  activeTab, 
  setActiveTab, 
  userRole, 
  notifications, 
  showNotifPanel, 
  setShowNotifPanel, 
  onLogout 
}) {
  const { theme, setTheme, themes } = useTheme();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const themeDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target)) {
        setShowThemeDropdown(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications ? notifications.filter(n => !n.read).length : 0;
  const currentThemeObj = themes.find(t => t.id === theme) || themes[0];
  const hasUnread = unreadCount > 0;

  const formatBreadcrumb = (tab) => {
    const map = {
      dashboard: 'Overview',
      platform_instagram: 'Instagram',
      growth: 'Growth Analytics',
      settings: 'Settings'
    };
    if (map[tab]) return map[tab];
    if (!tab) return 'Overview';
    return tab.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <>
      <style>{`
        .navbar-wrapper {
          position: sticky;
          top: 0;
          height: var(--navbar-height, 56px);
          background: var(--bg-navbar);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-primary);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 var(--space-4, 1.5rem);
          z-index: 90;
          transition: background var(--duration-normal) var(--ease-default);
        }

        .navbar-left {
          display: flex;
          align-items: center;
          gap: var(--space-3, 1rem);
          flex: 1;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: var(--space-2, 0.5rem);
          font-size: var(--text-sm, 14px);
          font-weight: 500;
        }

        .breadcrumb-root {
          color: var(--text-muted);
        }

        .breadcrumb-separator {
          color: var(--border-secondary);
        }

        .breadcrumb-current {
          color: var(--text-primary);
          font-weight: 600;
        }

        .navbar-center {
          flex: 1;
          display: flex;
          justify-content: center;
          max-width: 480px;
          margin: 0 var(--space-4, 1.5rem);
        }

        .search-container {
          display: flex;
          align-items: center;
          background: var(--bg-input);
          border: 1px solid var(--border-primary);
          border-radius: var(--radius-md, 8px);
          padding: 0 var(--space-3, 12px);
          height: 36px;
          width: 100%;
          gap: var(--space-2, 8px);
          transition: all var(--duration-normal) var(--ease-default);
        }

        .search-container.focused {
          border-color: var(--border-focus);
          box-shadow: 0 0 0 2px var(--accent-glow, rgba(0, 112, 243, 0.2));
        }

        .search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-primary);
          font-size: var(--text-sm, 14px);
        }
        
        .search-input::placeholder {
          color: var(--text-muted);
        }

        .search-shortcut {
          display: flex;
          align-items: center;
          gap: 2px;
          color: var(--text-muted);
          font-size: 12px;
          background: var(--bg-card);
          border: 1px solid var(--border-primary);
          border-radius: 4px;
          padding: 2px 6px;
          font-weight: 500;
        }

        .navbar-right {
          display: flex;
          align-items: center;
          gap: var(--space-3, 12px);
          flex: 1;
          justify-content: flex-end;
        }

        .theme-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 12px;
          height: 32px;
          border-radius: var(--radius-md, 8px);
          background: var(--bg-card);
          border: 1px solid var(--border-primary);
          color: var(--text-primary);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all var(--duration-normal) var(--ease-default);
        }

        .theme-button:hover {
          border-color: var(--border-secondary);
          background: var(--bg-dropdown);
        }

        .icon-button {
          position: relative;
          width: 32px;
          height: 32px;
          border-radius: var(--radius-md, 8px);
          background: var(--bg-card);
          border: 1px solid var(--border-primary);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--duration-normal) var(--ease-default);
        }

        .icon-button:hover {
          color: var(--text-primary);
          border-color: var(--border-secondary);
          background: var(--bg-dropdown);
        }
        
        .icon-button.active {
          color: var(--accent-primary);
          border-color: var(--border-focus, var(--accent-primary));
        }

        .notif-dot {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 8px;
          height: 8px;
          background-color: #ef4444;
          border: 2px solid var(--bg-navbar);
          border-radius: 50%;
        }

        .avatar-button {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--accent-gradient, linear-gradient(135deg, #0070f3, #f81ce5));
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-size: 14px;
          font-weight: 600;
          border: 2px solid transparent;
          cursor: pointer;
          padding: 0;
          transition: all var(--duration-normal) var(--ease-spring);
        }

        .avatar-button:hover {
          transform: scale(1.05);
          border-color: var(--border-secondary);
        }

        .ds-dropdown-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          width: 100%;
          border: none;
          background: transparent;
          color: var(--text-primary);
          font-size: 13px;
          cursor: pointer;
          border-radius: 6px;
          transition: background 0.2s;
        }
        
        .ds-dropdown-item:hover {
          background: var(--bg-card);
        }
        
        .theme-item {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 8px 12px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          text-align: left;
          width: 100%;
          background: transparent;
          transition: background 0.2s;
        }
        
        .theme-item:hover {
          background: var(--bg-card);
        }
        
        .theme-item.active {
          background: var(--badge-bg, rgba(0, 112, 243, 0.1));
        }
      `}</style>

      <header className="navbar-wrapper">
        
        {/* Left: Breadcrumbs */}
        <div className="navbar-left">
          <div className="breadcrumb">
            <span className="breadcrumb-root">CreatorIQ</span>
            <ChevronRight className="breadcrumb-separator" size={14} />
            <span className="breadcrumb-current">{formatBreadcrumb(activeTab)}</span>
          </div>
        </div>

        {/* Center: Search Command Palette */}
        <div className="navbar-center">
          <div className={`search-container ${isSearchFocused ? 'focused' : ''}`}>
            <Search size={16} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Search analytics, campaigns..." 
              className="search-input"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            <div className="search-shortcut">
              <Command size={10} />
              <span>K</span>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="navbar-right">
          
          {/* Theme Selector */}
          <div style={{ position: 'relative' }} ref={themeDropdownRef}>
            <button 
              type="button" 
              className="theme-button"
              onClick={() => setShowThemeDropdown(!showThemeDropdown)}
            >
              <Palette size={14} color="var(--accent-primary)" />
              <span>{currentThemeObj.name}</span>
              <ChevronDown size={14} color="var(--text-muted)" />
            </button>

            {showThemeDropdown && (
              <div className="ds-dropdown" style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                background: 'var(--bg-dropdown)',
                border: '1px solid var(--border-secondary, var(--border-primary))',
                borderRadius: 'var(--radius-lg, 12px)',
                padding: '8px',
                width: '220px',
                boxShadow: 'var(--shadow-lg, 0 10px 30px -10px rgba(0,0,0,0.3))',
                zIndex: 120,
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', padding: '4px 12px 8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Theme
                </div>
                {themes.map(t => (
                  <button
                    key={t.id}
                    className={`theme-item ${theme === t.id ? 'active' : ''}`}
                    onClick={() => {
                      setTheme(t.id);
                      setShowThemeDropdown(false);
                    }}
                  >
                    <span style={{ fontSize: '13px', fontWeight: 500, color: theme === t.id ? 'var(--accent-primary)' : 'var(--text-primary)' }}>{t.name}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{t.category}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications */}
          <button 
            type="button" 
            className={`icon-button ${showNotifPanel ? 'active' : ''}`}
            onClick={() => setShowNotifPanel(!showNotifPanel)}
            title="Notifications"
          >
            <Bell size={16} />
            {hasUnread && <span className="notif-dot" />}
          </button>

          {/* Settings */}
          <button 
            type="button" 
            className={`icon-button ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
            title="Settings"
          >
            <Settings size={16} />
          </button>

          {/* Profile Dropdown */}
          <div style={{ position: 'relative', marginLeft: '4px' }} ref={profileDropdownRef}>
            <button 
              type="button" 
              className="avatar-button"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            >
              {(userRole || 'C').charAt(0).toUpperCase()}
            </button>

            {showProfileDropdown && (
              <div className="ds-dropdown" style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                background: 'var(--bg-dropdown)',
                border: '1px solid var(--border-secondary, var(--border-primary))',
                borderRadius: 'var(--radius-lg, 12px)',
                padding: '8px',
                minWidth: '200px',
                boxShadow: 'var(--shadow-lg, 0 10px 30px -10px rgba(0,0,0,0.3))',
                zIndex: 120
              }}>
                <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-primary)', marginBottom: '8px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Creator Profile</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{userRole || 'Creator'}</div>
                </div>
                <button 
                  type="button" 
                  className="ds-dropdown-item"
                  onClick={onLogout}
                  style={{ color: '#ef4444' }}
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </header>
    </>
  );
}
