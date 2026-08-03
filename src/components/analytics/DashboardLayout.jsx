import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

export default function DashboardLayout({ 
  children,
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
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="ds-layout">
      <style>{`
        .ds-layout {
          display: flex;
          min-height: 100vh;
          width: 100%;
          background: var(--bg-primary);
          color: var(--text-primary);
          font-family: var(--font-sans);
          position: relative;
        }

        .ds-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          margin-left: var(--sidebar-width);
          min-width: 0;
          transition: margin-left var(--duration-slow) var(--ease-spring);
        }

        .ds-main.collapsed {
          margin-left: var(--sidebar-collapsed-width);
        }

        .ds-content {
          flex: 1;
          padding: var(--space-6) var(--space-8);
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
          width: 100%;
          max-width: 1440px;
          margin: 0 auto;
          animation: fadeIn var(--duration-normal) var(--ease-default);
        }

        @media (max-width: 1024px) {
          .ds-main {
            margin-left: var(--sidebar-collapsed-width);
          }
        }

        @media (max-width: 768px) {
          .ds-main {
            margin-left: 0 !important;
          }
          .ds-content {
            padding: var(--space-4);
          }
        }
      `}</style>

      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
        userRole={userRole}
      />

      <div className={`ds-main ${isCollapsed ? 'collapsed' : ''}`}>
        <TopNavbar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userRole={userRole}
          notifications={notifications}
          showNotifPanel={showNotifPanel}
          setShowNotifPanel={setShowNotifPanel}
          onLogout={onLogout}
          currentTheme={currentTheme}
          onThemeChange={onThemeChange}
        />

        <main className="ds-content">
          {children}
        </main>
      </div>
    </div>
  );
}
