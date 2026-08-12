import React, { useState, useEffect } from 'react';
import KPICards from './KPIcards';
import ViewsChart from './ViewsChart';
import FollowersChart from './FollowersChart';
import AudiencePieChart from './AudiencePieChart';
import EngagementBarChart from './EngagementBarChart';
import SettingsView from './SettingsView';
import NotificationsPanel from './NotificationsPanel';
import AdminPanel from './AdminPanel';
import LinkAnalyzer from './LinkAnalyzer';
import RevenueTracker from './RevenueTracker';
import BrandDashboardView from './BrandDashboardView';
import AIInsights from './AIInsights';
import CompareContent from './CompareContent';
import TrendingContent from './TrendingContent';
import TopContentTable from './TopContentTable';
import AICopilot from './AICopilot';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import PredictionView from './PredictionView';
import UpgradedRevenueDashboard from './UpgradedRevenueDashboard';
import GrowthAnalyticsDashboard from './GrowthAnalyticsDashboard';
import DashboardLayout from './DashboardLayout';
import PageTransition from './PageTransition';

import { kpiData as dummyKpiData, platformPerformance as dummyPerformance } from '../../data/dummyAnalytics';

export default function AnalyticsDashboard({ token, onLogout, onAuthUpdate, currentTheme, onThemeChange }) {
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notifications, setNotifications] = useState([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userRole, setUserRole] = useState('Creator');
  
  const [kpiData, setKpiData] = useState(dummyKpiData);
  const [platformPerformance, setPlatformPerformance] = useState(dummyPerformance);
  const [viewsData, setViewsData] = useState([]);
  const [followersData, setFollowersData] = useState([]);
  const [audienceData, setAudienceData] = useState([]);
  const [revenueRecords, setRevenueRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liveDataWarning, setLiveDataWarning] = useState('');

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
        
        if (stats.live_data === false) {
          setLiveDataWarning(stats.error + " " + stats.action_required);
        } else {
          setLiveDataWarning('');
        }

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

        // Fetch revenue records
        const resRevenue = await fetch(`${baseUrl}/api/revenue`, { headers });
        if (resRevenue.ok) {
          const rev = await resRevenue.json();
          setRevenueRecords(rev);
        }

        // Fetch user details for role validation
        const resUser = await fetch(`${baseUrl}/api/user/details`, { headers });
        if (resUser.ok) {
          const userData = await resUser.json();
          setUserRole(userData.account.role);
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

  // Group by Month for Revenue Chart
  const getRevenueChartData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlySum = {};

    revenueRecords.forEach(r => {
      const d = new Date(r.date);
      const mLabel = `${months[d.getMonth()]} ${d.getFullYear().toString().substring(2)}`;
      monthlySum[mLabel] = (monthlySum[mLabel] || 0) + r.amount;
    });

    return Object.keys(monthlySum).map(key => ({
      month: key,
      earnings: monthlySum[key]
    })).reverse();
  };

  const revenueChartData = getRevenueChartData();

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
    const baseKpis = {
      followers: {
        label: selectedPlatform === 'YouTube' ? 'Subscribers' : 'Platform Followers',
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

    if (selectedPlatform === 'Instagram') {
      baseKpis.reelsViews = {
        label: 'Instagram Reels Views',
        value: platformData.reels_views || 1100000,
        change: undefined,
        status: 'positive'
      };
      baseKpis.postViews = {
        label: 'Regular Post Views',
        value: platformData.post_views || 700000,
        change: undefined,
        status: 'positive'
      };
    } else if (selectedPlatform === 'YouTube') {
      baseKpis.shortsViews = {
        label: 'YouTube Shorts Views',
        value: platformData.shorts_views || 1500000,
        change: undefined,
        status: 'positive'
      };
      baseKpis.videoViews = {
        label: 'Regular Video Views',
        value: platformData.video_views || 2700000,
        change: undefined,
        status: 'positive'
      };
    }

    return baseKpis;
  };

  const activeKpiData = getFilteredKpiData();

  const getHeaderInfo = () => {
    switch (userRole) {
      case 'Admin':
        return { title: 'Admin Control Center', subtitle: 'Manage platform users and view telemetry metrics' };
      case 'Agency':
        return { title: 'Agency Portfolio Hub', subtitle: 'Oversee creator performance and client engagements' };
      case 'Brand':
        return { title: 'Brand Sponsor Hub', subtitle: 'Analyze campaign briefs and influencer engagement stats' };
      case 'Creator':
      default:
        return { title: 'Creator Analytics', subtitle: 'Milestone 1 Performance Dashboard' };
    }
  };
  const headerInfo = getHeaderInfo();

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
        }

        .dashboard-sidebar {
          width: 240px;
          background: var(--bg-secondary, #1e293b);
          border-right: 1px solid var(--border-color, rgba(255,255,255,0.08));
          display: flex;
          flex-direction: column;
          padding: 1.75rem 1.25rem;
          box-sizing: border-box;
          gap: 2rem;
          flex-shrink: 0;
        }

        .dashboard-logo-container {
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--text-primary);
          background: linear-gradient(135deg, var(--accent-primary, #3b82f6), var(--accent-secondary, #ec4899));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          padding-left: 8px;
        }

        .sidebar-menu {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
        }

        .sidebar-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          background: transparent;
          border: none;
          color: var(--text-secondary, #94a3b8);
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .sidebar-btn:hover {
          background: rgba(255, 255, 255, 0.03);
          color: var(--text-primary);
        }

        .sidebar-btn.active {
          background: var(--accent-primary, #3b82f6);
          color: #ffffff;
          box-shadow: 0 4px 12px var(--accent-glow, rgba(59,130,246,0.15));
        }

        .dashboard-main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow-x: hidden;
          padding: 2rem;
          box-sizing: border-box;
          gap: 2rem;
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

        .dashboard-row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          width: 100%;
        }

        .dashboard-message {
          font-size: 0.875rem;
          padding: 12px 16px;
          border-radius: 12px;
          font-weight: 500;
          border: 1px solid rgba(245, 158, 11, 0.25);
          background: rgba(245, 158, 11, 0.12);
          color: #fbbf24;
        }

        .dashboard-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          color: var(--text-secondary);
        }

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
.filter-btn.active {
          background: var(--accent-primary);
          color: #f8fafc;
        }
      `}</style>

      <DashboardLayout
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        notifications={notifications}
        showNotifPanel={showNotifPanel}
        setShowNotifPanel={setShowNotifPanel}
        onLogout={onLogout}
        currentTheme={currentTheme}
        onThemeChange={onThemeChange}
      >
        <PageTransition key={activeTab}>
          {liveDataWarning && activeTab !== 'settings' && (
            <div className="live-data-warning-banner" style={{
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#f87171',
              padding: '14px 20px',
              borderRadius: '16px',
              fontSize: '0.85rem',
              fontWeight: 500,
              marginBottom: '2rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                ⚠️ <strong>Notice:</strong> {liveDataWarning}
              </span>
              <button 
                type="button" 
                onClick={() => setActiveTab('settings')}
                style={{
                  background: 'var(--accent-primary)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '6px 14px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
              >
                Connect Social Account
              </button>
            </div>
          )}
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
          ) : activeTab === 'admin' ? (
            <AdminPanel token={token} />
          ) : activeTab === 'content' ? (
            <LinkAnalyzer token={token} />
          ) : activeTab === 'revenue' ? (
            <UpgradedRevenueDashboard token={token} setActiveTab={setActiveTab} />
          ) : activeTab === 'growth' ? (
            <GrowthAnalyticsDashboard token={token} setActiveTab={setActiveTab} />
          ) : activeTab === 'audience' ? (
            <AudiencePieChart data={audienceData} setActiveTab={setActiveTab} />
          ) : activeTab === 'reports' ? (
            <div className="demographics-card" style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '20px',
              padding: '2rem',
              textAlign: 'center'
            }}>
              <h3>📑 Quarterly Earnings & Growth Reports</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Generate or export CSV financial statements and timeline insights.</p>
              <button type="button" className="export-btn" style={{ marginTop: '1rem' }} onClick={() => window.open('http://127.0.0.1:8000/api/revenue/export', '_blank')}>
                Download Annual Financial Report
              </button>
            </div>
          ) : activeTab === 'integrations' ? (
            <SettingsView 
              token={token} 
              onThemeChange={onThemeChange} 
              currentTheme={currentTheme} 
              onAuthUpdate={onAuthUpdate}
              initialSubView="connected"
            />
          ) : activeTab === 'analytics' ? (
            <>
              {/* Standard Dashboard overview section */}
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
              <section className="dashboard-section">
                <KPICards data={activeKpiData} />
              </section>
              <section className="dashboard-row">
                <ViewsChart data={viewsData.length ? viewsData : undefined} />
                <FollowersChart data={followersData.length ? followersData : undefined} />
              </section>
              <section className="dashboard-row">
                <AudiencePieChart data={audienceData} isWidget={true} />
                <EngagementBarChart data={platformPerformance} />
              </section>
            </>
          ) : (
            <>
              {/* Main Creator Dashboard overview */}
              {(userRole === 'Agency' || userRole === 'Brand') ? (
                <BrandDashboardView token={token} />
              ) : (
                <>
                  <section className="dashboard-section">
                    <KPICards data={activeKpiData} />
                  </section>
                  
                  {/* AI Insights & Content Analysis Widgets */}
                  <section className="dashboard-row">
                    <AIInsights />
                    <CompareContent />
                  </section>

                  <section className="dashboard-row">
                    <TrendingContent />
                    <TopContentTable />
                  </section>
                  
                  {/* Copilot chat assistant inside dashboard helper */}
                  <div style={{ marginTop: '2rem' }}>
                    <AICopilot token={token} />
                  </div>
                </>
              )}
            </>
          )}
        </PageTransition>
      </DashboardLayout>

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
