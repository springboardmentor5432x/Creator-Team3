import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Users, 
  Sparkles, 
  DollarSign, 
  Zap, 
  Building2, 
  Bot, 
  Settings, 
  Wrench, 
  ShieldCheck, 
  PanelLeftClose, 
  PanelLeftOpen, 
  ChevronDown, 
  ChevronRight 
} from 'lucide-react';

// Brand SVG Icons
const Instagram = (props) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const Youtube = (props) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
  </svg>
);

const Twitter = (props) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

const Linkedin = (props) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const Facebook = (props) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const TwitchIcon = (props) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7"/>
  </svg>
);

export default function Sidebar({ activeTab, setActiveTab, isCollapsed, setIsCollapsed, userRole }) {
  const [platformsOpen, setPlatformsOpen] = useState(true);

  const isPlatformActive = activeTab && activeTab.startsWith('platform_');

  const platforms = [
    { id: 'platform_instagram', label: 'Instagram', icon: Instagram, color: '#e1306c' },
    { id: 'platform_youtube', label: 'YouTube', icon: Youtube, color: '#ff0000' },
    { id: 'platform_twitch', label: 'Twitch', icon: TwitchIcon, color: '#9146ff' },
    { id: 'platform_twitter', label: 'Twitter / X', icon: Twitter, color: '#1da1f2' },
    { id: 'platform_linkedin', label: 'LinkedIn', icon: Linkedin, color: '#0a66c2' },
    { id: 'platform_facebook', label: 'Facebook', icon: Facebook, color: '#1877f2' }
  ];

  const analyticsItems = [
    { id: 'growth', label: 'Growth Analytics', icon: TrendingUp },
    { id: 'audience', label: 'Audience Analytics', icon: Users },
    { id: 'prediction', label: 'Prediction Engine', icon: Sparkles },
    { id: 'revenue', label: 'Revenue Engine', icon: DollarSign },
    { id: 'content', label: 'Content Intelligence', icon: Zap },
    { id: 'team', label: 'Team Workspace', icon: Building2 },
    { id: 'ai_copilot', label: 'AI Copilot', icon: Bot },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'debug', label: 'System Debug', icon: Wrench }
  ];

  return (
    <>
      <style>{`
        .app-sidebar {
          height: 100vh;
          position: fixed;
          top: 0;
          left: 0;
          background: var(--bg-sidebar);
          backdrop-filter: var(--backdrop-blur, blur(12px));
          -webkit-backdrop-filter: var(--backdrop-blur, blur(12px));
          border-right: 1px solid var(--border-primary);
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          gap: var(--space-4, 1.25rem);
          flex-shrink: 0;
          z-index: 100;
          transition: width var(--duration-normal, 0.3s) var(--ease-spring, ease), padding var(--duration-normal, 0.3s) var(--ease-spring, ease);
          box-shadow: var(--shadow-card);
          overflow-y: auto;
        }
        .app-sidebar.expanded {
          width: var(--sidebar-width, 260px);
          padding: var(--space-5, 1.5rem) var(--space-3, 1rem);
        }
        .app-sidebar.collapsed {
          width: var(--sidebar-collapsed-width, 68px);
          padding: var(--space-5, 1.5rem) var(--space-2, 0.5rem);
        }
        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 var(--space-2, 0.5rem);
          height: 40px;
        }
        .sidebar-logo {
          font-size: 1.35rem;
          font-weight: 900;
          background: var(--accent-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          white-space: nowrap;
        }
        .sidebar-collapse-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          width: 28px;
          height: 28px;
          border-radius: var(--radius-md, 8px);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--duration-normal, 0.3s) var(--ease-default, ease);
        }
        .sidebar-collapse-btn:hover, .sidebar-collapse-btn:focus-visible {
          background: var(--bg-hover);
          color: var(--text-primary);
          outline: none;
        }
        .sidebar-collapse-btn:active {
          background: var(--bg-active);
        }
        .sidebar-collapse-btn.collapsed-margin {
          margin: 0 auto;
        }
        .nav-container {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          background: transparent;
          border: none;
          border-left: 2px solid transparent;
          color: var(--text-secondary);
          padding: 8px 12px;
          border-radius: var(--radius-md, 8px);
          font-size: var(--text-sm, 0.88rem);
          font-weight: var(--weight-medium, 500);
          cursor: pointer;
          text-align: left;
          width: 100%;
          transition: all var(--duration-normal, 0.3s) var(--ease-default, ease);
          outline: none;
        }
        .nav-item:hover, .nav-item:focus-visible {
          background: var(--bg-hover);
          color: var(--text-primary);
        }
        .nav-item:active {
          background: var(--bg-active);
        }
        .nav-item.active {
          background: var(--bg-selected);
          color: var(--text-primary);
          border-left-color: var(--accent-primary);
          font-weight: 600;
          border-top-left-radius: 2px;
          border-bottom-left-radius: 2px;
        }
        .nav-item.collapsed-item {
          justify-content: center;
          padding: 10px;
        }
        .nav-icon {
          flex-shrink: 0;
        }
        .nav-icon.active-icon {
          color: var(--accent-primary);
        }
        .ds-section-label {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          background: transparent;
          border: none;
          color: var(--text-muted);
          padding: 6px 14px;
          font-size: var(--text-xs, 0.75rem);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: color var(--duration-normal, 0.3s) var(--ease-default, ease);
          outline: none;
          border-radius: var(--radius-md, 8px);
        }
        .ds-section-label:hover, .ds-section-label:focus-visible {
          color: var(--text-secondary);
          background: var(--bg-hover);
        }
        .ds-section-label-static {
          padding: 12px 14px 4px;
          font-size: var(--text-xs, 0.75rem);
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .separator {
          height: 1px;
          background: var(--border-primary);
          margin: 8px 14px;
          opacity: 0.5;
        }
        .platform-container {
          display: flex;
          flex-direction: column;
          gap: 3px;
          margin-top: 4px;
        }
        .platform-container.expanded {
          padding-left: 10px;
        }
        .platform-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          margin-left: auto;
          box-shadow: 0 0 4px currentColor;
        }
        .platform-dot-collapsed {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
      `}</style>
      <aside className={`app-sidebar ${isCollapsed ? 'collapsed' : 'expanded'}`}>
        <div className="sidebar-header">
          {!isCollapsed && (
            <span className="sidebar-logo">
              CreatorIQ
            </span>
          )}
          <button 
            type="button" 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`sidebar-collapse-btn ${isCollapsed ? 'collapsed-margin' : ''}`}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>

        <nav className="nav-container">
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''} ${isCollapsed ? 'collapsed-item' : ''}`}
            title={isCollapsed ? "Main Dashboard" : undefined}
          >
            <LayoutDashboard className={`nav-icon ${activeTab === 'dashboard' ? 'active-icon' : ''}`} size={18} />
            {!isCollapsed && <span>Main Dashboard</span>}
          </button>

          <div style={{ marginTop: '6px' }}>
            {!isCollapsed ? (
              <button
                type="button"
                onClick={() => setPlatformsOpen(!platformsOpen)}
                className="ds-section-label"
              >
                <span style={{ color: isPlatformActive ? 'var(--accent-primary)' : 'inherit' }}>PLATFORMS</span>
                {platformsOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
            ) : (
              <div className="separator" />
            )}

            {(platformsOpen || isCollapsed) && (
              <div className={`platform-container ${!isCollapsed ? 'expanded' : ''}`}>
                {platforms.map(p => {
                  const isActive = activeTab === p.id;
                  const Icon = p.icon;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setActiveTab(p.id)}
                      className={`nav-item ${isActive ? 'active' : ''} ${isCollapsed ? 'collapsed-item' : ''}`}
                      title={isCollapsed ? p.label : undefined}
                      style={{ position: 'relative' }}
                    >
                      <Icon className="nav-icon" size={18} style={{ color: isActive ? p.color : 'inherit' }} />
                      {!isCollapsed && <span>{p.label}</span>}
                      {!isCollapsed && isActive && (
                        <div className="platform-dot" style={{ backgroundColor: p.color, color: p.color }} />
                      )}
                      {isCollapsed && isActive && (
                        <div className="platform-dot-collapsed" style={{ backgroundColor: p.color }} />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {!isCollapsed && (
            <div className="ds-section-label-static">
              ANALYTICS & ENGINES
            </div>
          )}
          {isCollapsed && <div className="separator" />}

          {analyticsItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`nav-item ${isActive ? 'active' : ''} ${isCollapsed ? 'collapsed-item' : ''}`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`nav-icon ${isActive ? 'active-icon' : ''}`} size={18} />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}

          {userRole === 'Admin' && (
            <>
              {!isCollapsed && (
                <div className="ds-section-label-static" style={{ marginTop: 'auto', paddingTop: '16px' }}>
                  ADMINISTRATION
                </div>
              )}
              {isCollapsed && <div className="separator" style={{ marginTop: 'auto' }} />}
              <button
                type="button"
                onClick={() => setActiveTab('admin')}
                className={`nav-item ${activeTab === 'admin' ? 'active' : ''} ${isCollapsed ? 'collapsed-item' : ''}`}
                title={isCollapsed ? "Admin Panel" : undefined}
                style={{ marginTop: !isCollapsed ? '4px' : 'auto' }}
              >
                <ShieldCheck className={`nav-icon ${activeTab === 'admin' ? 'active-icon' : ''}`} size={18} />
                {!isCollapsed && <span>Admin Panel</span>}
              </button>
            </>
          )}
        </nav>
      </aside>
    </>
  );
}
