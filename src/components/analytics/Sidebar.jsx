import React, { useState } from 'react';

export default function Sidebar({ activeTab, setActiveTab, isCollapsed, setIsCollapsed, userRole }) {
  const [platformsOpen, setPlatformsOpen] = useState(true);

  const isPlatformActive = activeTab && activeTab.startsWith('platform_');

  return (
    <aside className={`app-sidebar ${isCollapsed ? 'collapsed' : ''}`} style={{
      width: isCollapsed ? '80px' : '260px',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      background: 'var(--bg-sidebar)',
      backdropFilter: 'var(--backdrop-filter)',
      WebkitBackdropFilter: 'var(--backdrop-filter)',
      borderRight: '1px solid var(--border-primary)',
      display: 'flex',
      flexDirection: 'column',
      padding: isCollapsed ? '1.5rem 0.5rem' : '1.5rem 1rem',
      boxSizing: 'border-box',
      gap: '1.25rem',
      flexShrink: 0,
      zIndex: 100,
      transition: 'all 0.3s ease',
      boxShadow: 'var(--shadow-card)',
      overflowY: 'auto'
    }}>
      {/* Sidebar Header / Logo */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 0.5rem',
        height: '40px'
      }}>
        {!isCollapsed && (
          <span style={{
            fontSize: '1.35rem',
            fontWeight: 900,
            background: 'var(--accent-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            whiteSpace: 'nowrap'
          }}>
            CreatorIQ
          </span>
        )}
        <button 
          type="button" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-primary)',
            color: 'var(--text-secondary)',
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            marginLeft: isCollapsed ? 'auto' : '0',
            marginRight: isCollapsed ? 'auto' : '0'
          }}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? "➔" : "❮"}
        </button>
      </div>

      {/* Navigation List */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
        {/* Main Aggregated Dashboard */}
        <button
          type="button"
          onClick={() => setActiveTab('dashboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: activeTab === 'dashboard' ? 'var(--badge-bg)' : 'transparent',
            border: activeTab === 'dashboard' ? '1px solid var(--border-hover)' : '1px solid transparent',
            color: activeTab === 'dashboard' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            padding: '10px 14px',
            borderRadius: '12px',
            fontSize: '0.88rem',
            fontWeight: 600,
            cursor: 'pointer',
            textAlign: 'left',
            width: '100%',
            justifyContent: isCollapsed ? 'center' : 'flex-start'
          }}
        >
          <span style={{ fontSize: '1.15rem' }}>🏠</span>
          {!isCollapsed && <span>Main Dashboard</span>}
        </button>

        {/* Platforms Expandable Section */}
        <div style={{ marginTop: '6px' }}>
          {!isCollapsed ? (
            <button
              type="button"
              onClick={() => setPlatformsOpen(!platformsOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                background: 'transparent',
                border: 'none',
                color: isPlatformActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                padding: '6px 14px',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                cursor: 'pointer'
              }}
            >
              <span>PLATFORMS</span>
              <span style={{ fontSize: '10px' }}>{platformsOpen ? '▼' : '▶'}</span>
            </button>
          ) : (
            <div style={{ height: '1px', background: 'var(--border-primary)', margin: '8px 0' }} />
          )}

          {(platformsOpen || isCollapsed) && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '4px', paddingLeft: isCollapsed ? 0 : '10px' }}>
              {[
                { id: 'platform_instagram', label: 'Instagram', icon: '📸', color: '#e1306c' },
                { id: 'platform_youtube', label: 'YouTube', icon: '🔴', color: '#ff0000' },
                { id: 'platform_twitter', label: 'Twitter / X', icon: '🐦', color: '#1da1f2' },
                { id: 'platform_linkedin', label: 'LinkedIn', icon: '💼', color: '#0a66c2' },
                { id: 'platform_twitch', label: 'Twitch', icon: '👾', color: '#9146ff' }
              ].map(p => {
                const isActive = activeTab === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setActiveTab(p.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      background: isActive ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                      border: isActive ? `1px solid ${p.color}` : '1px solid transparent',
                      color: isActive ? '#ffffff' : 'var(--text-secondary)',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      fontSize: '0.82rem',
                      fontWeight: isActive ? 700 : 500,
                      cursor: 'pointer',
                      textAlign: 'left',
                      width: '100%',
                      justifyContent: isCollapsed ? 'center' : 'flex-start'
                    }}
                    title={isCollapsed ? p.label : undefined}
                  >
                    <span>{p.icon}</span>
                    {!isCollapsed && <span>{p.label}</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Analytics Header Section */}
        {!isCollapsed && (
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '12px 14px 4px' }}>
            ANALYTICS & ENGINES
          </div>
        )}

        {/* Analytics Navigation Items */}
        {[
          { id: 'growth', label: 'Growth Analytics', icon: '📈' },
          { id: 'audience', label: 'Audience Analytics', icon: '👥' },
          { id: 'prediction', label: 'Prediction Engine', icon: '🔮' },
          { id: 'revenue', label: 'Revenue Engine', icon: '💰' },
          { id: 'content', label: 'Content Intelligence', icon: '⚡' },
          { id: 'ai_copilot', label: 'AI Copilot', icon: '🤖' },
          { id: 'settings', label: 'Settings', icon: '⚙️' }
        ].map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: isActive ? 'var(--badge-bg)' : 'transparent',
                border: isActive ? '1px solid var(--border-hover)' : '1px solid transparent',
                color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                padding: '10px 14px',
                borderRadius: '12px',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                justifyContent: isCollapsed ? 'center' : 'flex-start'
              }}
              title={isCollapsed ? item.label : undefined}
            >
              <span style={{ fontSize: '1.15rem' }}>{item.icon}</span>
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          );
        })}

        {userRole === 'Admin' && (
          <button
            type="button"
            onClick={() => setActiveTab('admin')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: activeTab === 'admin' ? 'var(--badge-bg)' : 'transparent',
              border: activeTab === 'admin' ? '1px solid var(--border-hover)' : '1px solid transparent',
              color: activeTab === 'admin' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              padding: '10px 14px',
              borderRadius: '12px',
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              justifyContent: isCollapsed ? 'center' : 'flex-start'
            }}
          >
            <span style={{ fontSize: '1.15rem' }}>🛡️</span>
            {!isCollapsed && <span>Admin Panel</span>}
          </button>
        )}
      </nav>
    </aside>
  );
}
