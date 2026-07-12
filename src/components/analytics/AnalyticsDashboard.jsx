import React, { useState, useEffect } from 'react';
import KPICards from './KPIcards';
import ViewsChart from './ViewsChart';
import FollowersChart from './FollowersChart';
import AudiencePieChart from './AudiencePieChart';
import EngagementBarChart from './EngagementBarChart';
import SettingsView from './SettingsView';
import NotificationsPanel from './NotificationsPanel';

import { kpiData as dummyKpiData, platformPerformance as dummyPerformance } from '../../data/dummyAnalytics';

export default function AnalyticsDashboard({ token, onLogout, onAuthUpdate, currentTheme, onThemeChange }) {
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notifications, setNotifications] = useState([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  
  const [kpiData, setKpiData] = useState(dummyKpiData);
  const [platformPerformance, setPlatformPerformance] = useState(dummyPerformance);
  const [viewsData, setViewsData] = useState([]);
  const [followersData, setFollowersData] = useState([]);
  const [audienceData, setAudienceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const baseUrl = 'http://127.0.0.1:8000';
      const headers = {
        'Authorization': `Bearer ${token}`,
      };

      try {
        setLoading(true);
        // Fetch KPIs & performance
        const resStats = await fetch(`${baseUrl}/api/analytics`, { headers });
        if (!resStats.ok) throw new Error('Failed to load KPIs');
        const stats = await resStats.json();
        setKpiData(stats.kpiData);
        setPlatformPerformance(stats.platformPerformance);

        // Fetch views history
        const resViews = await fetch(`${baseUrl}/api/analytics/views`, { headers });
        if (resViews.ok) {
          const views = await resViews.json();
          setViewsData(views);
        }

        // Fetch followers history
        const resFollowers = await fetch(`${baseUrl}/api/analytics/followers`, { headers });
        if (resFollowers.ok) {
          const followers = await resFollowers.json();
          setFollowersData(followers);
        }

        // Fetch demographics
        const resAudience = await fetch(`${baseUrl}/api/analytics/audience`, { headers });
        if (resAudience.ok) {
          const audience = await resAudience.json();
          setAudienceData(audience);
        }

        // Fetch notifications
        const resNotifs = await fetch(`${baseUrl}/api/notifications`, { headers });
        if (resNotifs.ok) {
          const notifs = await resNotifs.json();
          setNotifications(notifs);
        }

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Error loading data from server. Displaying cached local copy.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  const handleMarkAsRead = async (id) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/notifications/${id}/read`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      }
    } catch (err) {
      console.error("Error marking notification read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/notifications/read-all`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      }
    } catch (err) {
      console.error("Error marking all notifications read:", err);
    }
  };

  const handleClearAll = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/notifications/clear`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setNotifications([]);
      }
    } catch (err) {
      console.error("Error clearing notifications:", err);
    }
  };

  // Filter KPI data based on selected platform
  const getFilteredKpiData = () => {
    if (selectedPlatform === 'All') {
      return kpiData;
    }

    const platformData = platformPerformance.find(
      (p) => p.platform.toLowerCase() === selectedPlatform.toLowerCase()
    );

    if (!platformData) return kpiData;

    // Convert platform performance flat structure to match kpiData structure
    return {
      followers: {
        label: 'Platform Followers',
        value: platformData.followers,
        change: undefined,
        status: 'positive'
      },
      views: {
        label: 'Platform Views',
        value: platformData.views,
        change: undefined,
        status: 'positive'
      },
      likes: {
        label: 'Platform Likes',
        value: platformData.likes,
        change: undefined,
        status: 'positive'
      },
      comments: {
        label: 'Platform Comments',
        value: platformData.comments,
        change: undefined,
        status: 'positive'
      },
      engagementRate: {
        label: 'Engagement Rate',
        value: platformData.engagementRate,
        change: undefined,
        status: 'positive'
      }
    };
  };

  const activeKpiData = getFilteredKpiData();

  return (
    <div className="dashboard-container" data-theme={currentTheme}>
      {/* Dynamic Theme Color Tokens and Dashboard styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        /* Theme tokens */
        .dashboard-container {
          /* 1. Midnight Theme (Default) */
          --bg-primary: #0b0f19;
          --bg-secondary: rgba(30, 41, 59, 0.6);
          --border-color: rgba(255, 255, 255, 0.08);
          --accent-primary: #3b82f6;
          --accent-secondary: #ec4899;
          --accent-glow: rgba(59, 130, 246, 0.15);
          --text-primary: #f8fafc;
          --text-secondary: #94a3b8;

          background-color: var(--bg-primary);
          min-height: 100vh;
          padding: 2.5rem 2rem;
          color: var(--text-primary);
          font-family: 'Inter', sans-serif;
          box-sizing: border-box;
          position: relative;
          overflow: hidden;
        }

        .dashboard-container[data-theme="midnight"] {
          --bg-primary: #0b0f19;
          --bg-secondary: rgba(30, 41, 59, 0.6);
          --border-color: rgba(255, 255, 255, 0.08);
          --accent-primary: #3b82f6;
          --accent-secondary: #ec4899;
          --accent-glow: rgba(59, 130, 246, 0.15);
          --text-primary: #f8fafc;
          --text-secondary: #94a3b8;
        }

        .dashboard-container[data-theme="aurora"] {
          --bg-primary: #06140f;
          --bg-secondary: rgba(16, 44, 34, 0.6);
          --border-color: rgba(52, 211, 153, 0.15);
          --accent-primary: #10b981;
          --accent-secondary: #fbbf24;
          --accent-glow: rgba(16, 185, 129, 0.15);
          --text-primary: #f0fdf4;
          --text-secondary: #a7f3d0;
        }

        .dashboard-container[data-theme="amethyst"] {
          --bg-primary: #0f0b15;
          --bg-secondary: rgba(43, 27, 65, 0.6);
          --border-color: rgba(192, 132, 252, 0.15);
          --accent-primary: #8b5cf6;
          --accent-secondary: #00f0ff;
          --accent-glow: rgba(139, 92, 246, 0.15);
          --text-primary: #faf5ff;
          --text-secondary: #e9d5ff;
        }

        .dashboard-container[data-theme="rose"] {
          --bg-primary: #18090f;
          --bg-secondary: rgba(64, 18, 36, 0.6);
          --border-color: rgba(244, 63, 94, 0.15);
          --accent-primary: #f43f5e;
          --accent-secondary: #f59e0b;
          --accent-glow: rgba(244, 63, 94, 0.15);
          --text-primary: #fff1f2;
          --text-secondary: #fecdd3;
        }

        .dashboard-container[data-theme="cyberpunk"] {
          --bg-primary: #0a0a0c;
          --bg-secondary: rgba(26, 26, 36, 0.7);
          --border-color: rgba(247, 224, 24, 0.3);
          --accent-primary: #00f0ff;
          --accent-secondary: #f7e018;
          --accent-glow: rgba(0, 240, 255, 0.15);
          --text-primary: #ffffff;
          --text-secondary: #f7e018;
        }

        .dashboard-container[data-theme="light"] {
          --bg-primary: #f1f5f9;
          --bg-secondary: rgba(255, 255, 255, 0.75);
          --border-color: rgba(15, 23, 42, 0.08);
          --accent-primary: #2563eb;
          --accent-secondary: #db2777;
          --accent-glow: rgba(37, 99, 235, 0.08);
          --text-primary: #0f172a;
          --text-secondary: #475569;
        }

        /* Ambient Glow Backgrounds */
        .ambient-glow {
          position: absolute;
          top: -10%;
          left: -10%;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: var(--accent-glow);
          filter: blur(120px);
          pointer-events: none;
          z-index: 1;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
          gap: 1.5rem;
          position: relative;
          z-index: 10;
        }

        .dashboard-title-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .dashboard-title {
          font-size: 1.875rem;
          font-weight: 700;
          letter-spacing: -0.03em;
          margin: 0;
          background: linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .dashboard-subtitle {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin: 0;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        /* Navigation tab styling */
        .nav-tabs {
          display: flex;
          background: rgba(30, 41, 59, 0.4);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 4px;
          gap: 4px;
        }

        .nav-tab-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .nav-tab-btn:hover {
          color: var(--text-primary);
        }

        .nav-tab-btn.active {
          background: var(--accent-primary);
          color: #f8fafc;
          box-shadow: 0 4px 12px var(--accent-glow);
        }

        /* Platform filter pill buttons */
        .filter-group {
          display: flex;
          background: rgba(30, 41, 59, 0.4);
          border: 1px solid var(--border-color);
          border-radius: 9999px;
          padding: 4px;
          gap: 4px;
        }

        .filter-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          padding: 8px 16px;
          border-radius: 9999px;
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filter-btn:hover {
          color: var(--text-primary);
        }

        .filter-btn.active {
          background: var(--accent-primary);
          color: #f8fafc;
          box-shadow: 0 4px 12px var(--accent-glow);
        }

        .logout-btn {
          background: transparent;
          border: 1px solid rgba(239, 68, 68, 0.4);
          color: #f87171;
          padding: 8px 16px;
          border-radius: 9999px;
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.1);
          border-color: #f87171;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
        }

        /* Grid Row Layouts */
        .dashboard-row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-bottom: 1.5rem;
          width: 100%;
          position: relative;
          z-index: 5;
        }

        .dashboard-message {
          font-size: 0.875rem;
          padding: 12px 16px;
          border-radius: 12px;
          margin-bottom: 2rem;
          font-weight: 500;
          border: 1px solid rgba(245, 158, 11, 0.25);
          background: rgba(245, 158, 11, 0.12);
          color: #fbbf24;
          position: relative;
          z-index: 10;
        }

        .dashboard-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          font-size: 1.125rem;
          color: var(--text-secondary);
        }

        .dashboard-section {
          position: relative;
          z-index: 5;
        }

        /* Notification Bell Styling */
        .header-actions {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .notif-bell-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .notif-bell-btn {
          background: transparent;
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          transition: all 0.2s ease;
          padding: 0;
        }

        .notif-bell-btn:hover, .notif-bell-btn.active {
          background: var(--accent-glow);
          color: var(--accent-primary);
          border-color: var(--accent-primary);
          box-shadow: 0 0 10px var(--accent-glow);
        }

        .bell-icon {
          width: 18px;
          height: 18px;
        }

        .bell-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: var(--accent-secondary);
          color: #ffffff;
          font-size: 0.65rem;
          font-weight: 700;
          min-width: 15px;
          height: 15px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 3px;
          box-sizing: border-box;
          border: 2px solid var(--bg-primary);
        }

        @media (max-width: 1024px) {
          .dashboard-row {
            grid-template-columns: 1fr;
          }
          .dashboard-header {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>

      {/* Decorative Glow */}
      <div className="ambient-glow"></div>

      {/* Header Section */}
      <header className="dashboard-header">
        <div className="dashboard-title-group">
          <h1 className="dashboard-title">Creator Analytics</h1>
          <p className="dashboard-subtitle">Milestone 1 Performance Dashboard</p>
        </div>

        {/* Header Actions */}
        <div className="header-actions">
          {/* Navigation Tabs */}
          <div className="nav-tabs">
            <button 
              type="button" 
              className={`nav-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>
            <button 
              type="button" 
              className={`nav-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </button>
          </div>

          <div className="notif-bell-container">
            <button 
              type="button" 
              className={`notif-bell-btn ${showNotifPanel ? 'active' : ''}`}
              onClick={() => setShowNotifPanel(!showNotifPanel)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="bell-icon">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="bell-badge">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>
          </div>

          <button type="button" className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Error alert banner */}
      {error && <div className="dashboard-message">{error}</div>}

      {loading ? (
        <div className="dashboard-loading">Loading Dashboard Metrics...</div>
      ) : activeTab === 'settings' ? (
        <SettingsView 
          token={token} 
          onThemeChange={onThemeChange} 
          currentTheme={currentTheme} 
          onAuthUpdate={onAuthUpdate}
        />
      ) : (
        <>
          {/* Dashboard Filters Row */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem', position: 'relative', zIndex: 10 }}>
            <div className="filter-group">
              {['All', 'YouTube', 'Instagram', 'LinkedIn', 'Twitch'].map((platform) => (
                <button
                  key={platform}
                  className={`filter-btn ${selectedPlatform === platform ? 'active' : ''}`}
                  onClick={() => setSelectedPlatform(platform)}
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>

          {/* Top Section: KPI Cards */}
          <section className="dashboard-section">
            <KPICards data={activeKpiData} />
          </section>

          {/* Middle Section: Views Chart & Followers Chart */}
          <section className="dashboard-row">
            <ViewsChart data={viewsData.length ? viewsData : undefined} />
            <FollowersChart data={followersData.length ? followersData : undefined} />
          </section>

          {/* Bottom Section: Audience Pie Chart & Engagement Bar Chart */}
          <section className="dashboard-row">
            <AudiencePieChart data={audienceData.length ? audienceData : undefined} />
            <EngagementBarChart data={platformPerformance} />
          </section>
        </>
      )}
      {showNotifPanel && (
        <NotificationsPanel 
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
          onClearAll={handleClearAll}
          onClose={() => setShowNotifPanel(false)}
        />
      )}
    </div>
  );
}


