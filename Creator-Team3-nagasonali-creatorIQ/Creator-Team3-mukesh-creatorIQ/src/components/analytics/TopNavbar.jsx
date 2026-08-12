import React, { useState } from 'react';
import { Palette, Bell, Settings, Search, LogOut, ChevronDown } from 'lucide-react';
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

  const unreadCount = notifications ? notifications.filter(n => !n.read).length : 0;
  const currentThemeObj = themes.find(t => t.id === theme) || themes[0];

  return (
    <header className="top-navbar" style={{
      position: 'sticky',
      top: 0,
      background: 'var(--bg-navbar)',
      backdropFilter: 'var(--backdrop-filter)',
      WebkitBackdropFilter: 'var(--backdrop-filter)',
      borderBottom: '1px solid var(--border-primary)',
      height: '70px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      boxSizing: 'border-box',
      zIndex: 90
    }}>
      {/* Modern Search Input */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'var(--bg-input)',
        border: '1px solid var(--border-primary)',
        borderRadius: '12px',
        padding: '8px 14px',
        gap: '10px',
        width: '320px',
        boxSizing: 'border-box'
      }}>
        <Search size={16} color="var(--text-muted)" />
        <input 
          type="text" 
          placeholder="Search analytics, campaigns..." 
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text-primary)',
            fontSize: '13px',
            width: '100%'
          }}
        />
        <span style={{
          fontSize: '10px',
          fontWeight: 700,
          padding: '2px 6px',
          background: 'var(--bg-card)',
          borderRadius: '4px',
          border: '1px solid var(--border-primary)',
          color: 'var(--text-muted)'
        }}>⌘K</span>
      </div>

      {/* Right Row Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        
        {/* 7-Theme Selector Dropdown */}
        <div style={{ position: 'relative' }}>
          <button 
            type="button" 
            onClick={() => setShowThemeDropdown(!showThemeDropdown)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              borderRadius: '10px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-primary)',
              color: 'var(--text-primary)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Palette size={16} color="var(--accent-primary)" />
            <span>{currentThemeObj.name}</span>
            <ChevronDown size={14} color="var(--text-muted)" />
          </button>

          {showThemeDropdown && (
            <div style={{
              position: 'absolute',
              top: '48px',
              right: 0,
              background: 'var(--bg-dropdown)',
              border: '1px solid var(--border-hover)',
              borderRadius: '14px',
              padding: '8px',
              width: '220px',
              boxShadow: 'var(--shadow-modal)',
              zIndex: 120,
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', padding: '6px 10px', textTransform: 'uppercase' }}>
                Select Global Theme
              </div>
              {themes.map(t => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id);
                    setShowThemeDropdown(false);
                  }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: 'none',
                    background: theme === t.id ? 'var(--badge-bg)' : 'transparent',
                    color: theme === t.id ? 'var(--accent-primary)' : 'var(--text-primary)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%'
                  }}
                >
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>{t.name}</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{t.category}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Bell */}
        <button 
          type="button" 
          onClick={() => setShowNotifPanel(!showNotifPanel)}
          style={{
            position: 'relative',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-primary)',
            color: 'var(--text-secondary)',
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          title="Notifications"
        >
          <Bell size={16} />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-3px',
              right: '-3px',
              background: '#ef4444',
              color: '#ffffff',
              fontSize: '10px',
              fontWeight: 800,
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>{unreadCount}</span>
          )}
        </button>

        {/* Settings button */}
        <button 
          type="button" 
          onClick={() => setActiveTab('settings')}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-primary)',
            color: activeTab === 'settings' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          title="Account Settings"
        >
          <Settings size={16} />
        </button>

        {/* Profile Details Dropdown */}
        <div style={{ position: 'relative' }}>
          <button 
            type="button" 
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '14px',
              color: '#ffffff'
            }}>
              {(userRole || 'C').charAt(0).toUpperCase()}
            </div>
          </button>

          {showProfileDropdown && (
            <div style={{
              position: 'absolute',
              top: '48px',
              right: 0,
              background: 'var(--bg-dropdown)',
              border: '1px solid var(--border-hover)',
              borderRadius: '14px',
              padding: '12px',
              minWidth: '180px',
              boxShadow: 'var(--shadow-modal)',
              zIndex: 120
            }}>
              <div style={{ borderBottom: '1px solid var(--border-primary)', paddingBottom: '8px', marginBottom: '8px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Creator Profile</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{userRole || 'Creator'}</div>
              </div>
              <button 
                type="button" 
                onClick={onLogout}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
