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
    <div className="app-layout-wrapper">
      <style>{`
        .app-layout-wrapper {
          display: flex;
          min-height: 100vh;
          width: 100%;
          background: #090d16;
          color: #f8fafc;
          font-family: 'Inter', sans-serif;
          position: relative;
        }

        .main-layout-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          margin-left: 280px;
          min-width: 0; /* Prevents flex children from stretching */
          transition: margin-left 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .main-layout-container.sidebar-collapsed {
          margin-left: 80px;
        }

        .dashboard-content-body {
          flex: 1;
          padding: 2rem;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
          width: 100%;
          max-width: 1600px;
          margin: 0 auto;
        }

        @media (max-width: 1024px) {
          .main-layout-container {
            margin-left: 80px;
          }
        }

        @media (max-width: 768px) {
          .main-layout-container {
            margin-left: 0 !important;
          }
          .dashboard-content-body {
            padding: 1.25rem;
          }
        }
      `}</style>

      {/* FIXED SIDEBAR */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
        userRole={userRole}
      />

      {/* DYNAMIC SCROLL CONTAINER */}
      <div className={`main-layout-container ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
        
        {/* STICKY TOP NAVBAR */}
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

        {/* DASHBOARD PAGE METRICS BODY */}
        <main className="dashboard-content-body">
          {children}
        </main>
      </div>
    </div>
  );
}
