import React from 'react';

export default function Sidebar({ activeTab, setActiveTab, isCollapsed, setIsCollapsed, userRole }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'revenue', label: 'Revenue', icon: '💰' },
    { id: 'growth', label: 'Growth', icon: '📈' },
    { id: 'audience', label: 'Audience', icon: '👥' },
    { id: 'content', label: 'Content', icon: '🔗' },
    { id: 'reports', label: 'Reports', icon: '📑' },
    { id: 'integrations', label: 'Integrations', icon: '🔌' }
  ];

  if (userRole === 'Admin') {
    menuItems.push({ id: 'admin', label: 'Admin Panel', icon: '🛡️' });
  }

  return (
    <aside className={`app-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <style>{`
        .app-sidebar {
          width: 280px;
          height: 100vh;
          position: fixed;
          top: 0;
          left: 0;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-right: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          flex-direction: column;
          padding: 1.5rem 1rem;
          box-sizing: border-box;
          gap: 2rem;
          flex-shrink: 0;
          z-index: 100;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 4px 0 24px rgba(0, 0, 0, 0.3);
        }

        .app-sidebar.collapsed {
          width: 80px;
          padding: 1.5rem 0.5rem;
        }

        .sidebar-logo-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 0.5rem;
          height: 40px;
        }

        .sidebar-logo {
          font-size: 1.35rem;
          font-weight: 900;
          background: linear-gradient(135deg, #3b82f6 0%, #ec4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          white-space: nowrap;
          opacity: 1;
          transition: opacity 0.2s ease;
        }

        .app-sidebar.collapsed .sidebar-logo {
          opacity: 0;
          width: 0;
          overflow: hidden;
          padding: 0;
        }

        .collapse-btn {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: var(--text-secondary, #94a3b8);
          width: 28px;
          height: 28px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .collapse-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-primary, #f8fafc);
        }

        .sidebar-menu-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
        }

        .sidebar-item-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          background: transparent;
          border: none;
          color: var(--text-secondary, #94a3b8);
          padding: 12px 14px;
          border-radius: 14px;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          text-align: left;
          width: 100%;
          position: relative;
          white-space: nowrap;
          overflow: hidden;
        }

        .app-sidebar.collapsed .sidebar-item-btn {
          justify-content: center;
          padding: 12px 0;
        }

        .sidebar-item-btn:hover {
          background: rgba(255, 255, 255, 0.03);
          color: var(--text-primary, #f8fafc);
          transform: translateX(2px);
        }

        .app-sidebar.collapsed .sidebar-item-btn:hover {
          transform: none;
        }

        .sidebar-item-btn.active {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.18) 0%, rgba(59, 130, 246, 0.05) 100%);
          color: #60a5fa;
          border: 1px solid rgba(59, 130, 246, 0.25);
          box-shadow: inset 0 0 12px rgba(59, 130, 246, 0.1);
        }

        .sidebar-icon {
          font-size: 1.15rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .sidebar-label {
          transition: opacity 0.2s ease;
          opacity: 1;
        }

        .app-sidebar.collapsed .sidebar-label {
          opacity: 0;
          width: 0;
          overflow: hidden;
        }
      `}</style>

      <div className="sidebar-logo-row">
        <span className="sidebar-logo">CreatorIQ</span>
        <button 
          type="button" 
          className="collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? "➔" : "⟤"}
        </button>
      </div>

      <nav className="sidebar-menu-list">
        {menuItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`sidebar-item-btn ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
            title={isCollapsed ? item.label : undefined}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
