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
import UpgradedRevenueEngineView from './UpgradedRevenueEngineView';
import UpgradedGrowthAnalyticsView from './UpgradedGrowthAnalyticsView';
import ContentIntelligenceView from './ContentIntelligenceView';
import MathematicalPredictionView from './MathematicalPredictionView';
import BrandDashboardView from './BrandDashboardView';
import AIInsights from './AIInsights';
import CompareContent from './CompareContent';
import TrendingContent from './TrendingContent';
import TopContentTable from './TopContentTable';
import AICopilot from './AICopilot';
import PlatformDashboardView from './PlatformDashboardView';
import DebugView from './DebugView';
import TeamWorkspaceView from './TeamWorkspaceView';
import AudienceAnalyticsView from './AudienceAnalyticsView';
import ReportsView from './ReportsView';
import NotificationCenterView from '../notifications/NotificationCenterView';
import DashboardLayout from './DashboardLayout';
import PageTransition from './PageTransition';
import { useTheme } from '../../context/ThemeContext';
import HyperAIOrb from '../hyper/HyperAIOrb';

import { kpiData as dummyKpiData, platformPerformance as dummyPerformance } from '../../data/dummyAnalytics';

export default function AnalyticsDashboard({ token, onLogout, onAuthUpdate }) {
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notifications, setNotifications] = useState([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [userRole, setUserRole] = useState('Creator');
  const { isHyperUI } = useTheme();
  
  const [kpiData, setKpiData] = useState(dummyKpiData);
  const [platformPerformance, setPlatformPerformance] = useState(dummyPerformance);
  const [viewsData, setViewsData] = useState([]);
  const [followersData, setFollowersData] = useState([]);
  const [audienceData, setAudienceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [instagramData, setInstagramData] = useState(null);
  const [liveDataWarning, setLiveDataWarning] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const baseUrl = 'http://127.0.0.1:8000';
      const headers = {
        'Authorization': `Bearer ${token}`,
      };

      try {
        setLoading(true);
        // Removed invalid /api/instagram/profile fetch, Instagram data will be parsed from /api/analytics


        // Fetch KPIs & performance
        const resStats = await fetch(`${baseUrl}/api/analytics`, { headers });
        if (resStats.ok) {
          const stats = await resStats.json();
          if (stats.kpiData) setKpiData(stats.kpiData);
          if (stats.platformComparison || stats.platformPerformance) {
            const perf = stats.platformComparison || stats.platformPerformance;
            setPlatformPerformance(perf);
            
            // Extract Instagram data for the top live card
            const igPerf = perf.find(p => p.platform === 'Instagram' && p.status === 'connected');
            if (igPerf) setInstagramData(igPerf);
          }
          if (stats.live_data === false) {
            setLiveDataWarning(stats.error + " " + (stats.action_required || ""));
          } else {
            setLiveDataWarning('');
          }
        }

        // Fetch views history
        const resViews = await fetch(`${baseUrl}/api/analytics/views`, { headers });
        if (resViews.ok) setViewsData(await resViews.json());

        // Fetch followers history
        const resFollowers = await fetch(`${baseUrl}/api/analytics/followers`, { headers });
        if (resFollowers.ok) setFollowersData(await resFollowers.json());

        // Fetch demographics
        const resAudience = await fetch(`${baseUrl}/api/analytics/audience`, { headers });
        if (resAudience.ok) setAudienceData(await resAudience.json());

        // Fetch notifications
        const resNotifs = await fetch(`${baseUrl}/api/notifications`, { headers });
        if (resNotifs.ok) setNotifications(await resNotifs.json());

        // Fetch user details for role validation
        const resUser = await fetch(`${baseUrl}/api/user/details`, { headers });
        if (resUser.ok) {
          const userData = await resUser.json();
          setUserRole(userData.account.role);
        }

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Error loading data from server.');
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
      console.error(err);
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
      console.error(err);
    }
  };

  const handleClearAll = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/notifications/clear`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setNotifications([]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', color: 'var(--text-primary)' }}>
      <style>{`
        .dash-warning {
          background: var(--warning-subtle);
          border: 1px solid rgba(245, 158, 11, 0.2);
          color: var(--warning);
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-xl);
          font-size: var(--text-sm);
          display: flex;
          justify-content: space-between;
          align-items: center;
          animation: fadeInDown var(--duration-slow) var(--ease-spring) both;
        }

        .dash-overview {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }

        .dash-section-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }

        .dash-section-title {
          margin: 0;
          font-size: var(--text-md);
          font-weight: var(--weight-semibold);
          color: var(--text-primary);
          letter-spacing: var(--tracking-tight);
        }

        .dash-section-subtitle {
          font-size: var(--text-xs);
          color: var(--text-muted);
        }

        .dash-platform-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: var(--space-3);
        }

        .dash-platform-card {
          padding: var(--space-4);
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          cursor: pointer;
          transition: all var(--duration-normal) var(--ease-default);
          border-radius: var(--card-radius);
          background: var(--bg-card);
          border: 1px solid var(--border-primary);
          box-shadow: var(--shadow-card);
        }

        .dash-platform-card:hover {
          border-color: var(--border-hover);
          box-shadow: var(--shadow-md);
          transform: translateY(-1px);
        }

        .dash-platform-card.disconnected {
          cursor: default;
          opacity: 0.6;
        }

        .dash-platform-card.disconnected:hover {
          transform: none;
          box-shadow: var(--shadow-card);
        }

        .dash-platform-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .dash-platform-name {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-weight: var(--weight-semibold);
          font-size: var(--text-sm);
          color: var(--text-primary);
        }

        .dash-platform-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          display: inline-block;
        }

        .dash-platform-followers {
          font-size: var(--text-xl);
          font-weight: var(--weight-bold);
          color: var(--text-primary);
          letter-spacing: var(--tracking-tighter);
          font-variant-numeric: tabular-nums;
        }

        .dash-platform-followers span {
          font-size: var(--text-xs);
          color: var(--text-muted);
          font-weight: var(--weight-normal);
          margin-left: var(--space-1);
        }

        .dash-platform-meta {
          font-size: var(--text-xs);
          color: var(--text-muted);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .dash-platform-cta {
          font-weight: var(--weight-semibold);
          transition: color var(--duration-fast) var(--ease-default);
        }

        .dash-charts-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-4);
        }

        .dash-ig-banner {
          background: var(--bg-card);
          border: 1px solid var(--border-primary);
          border-radius: var(--card-radius);
          padding: var(--space-4) var(--space-5);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: var(--space-4);
          animation: fadeInUp var(--duration-slow) var(--ease-spring) both;
          box-shadow: var(--shadow-card);
        }

        .dash-ig-left {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .dash-ig-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 2px solid var(--accent-primary);
          object-fit: cover;
        }

        .dash-ig-name {
          font-weight: var(--weight-semibold);
          font-size: var(--text-base);
          color: var(--text-primary);
        }

        .dash-ig-stats {
          font-size: var(--text-xs);
          color: var(--text-muted);
          margin-top: var(--space-0_5);
          font-variant-numeric: tabular-nums;
        }

        @media (max-width: 900px) {
          .dash-charts-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .dash-platform-grid {
            grid-template-columns: 1fr;
          }
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
      >
        <PageTransition key={activeTab}>
          {liveDataWarning && activeTab !== 'settings' && (
            <div className="dash-warning">
              <span><strong>Notice:</strong> {liveDataWarning}</span>
              <button 
                onClick={() => setActiveTab('settings')}
                className="ds-btn-secondary ds-btn-sm"
              >
                Settings
              </button>
            </div>
          )}

          {activeTab && activeTab.startsWith('platform_') ? (
            <PlatformDashboardView platformKey={activeTab} token={token} setActiveTab={setActiveTab} />
          ) : activeTab === 'revenue' ? (
            <UpgradedRevenueEngineView token={token} />
          ) : activeTab === 'growth' ? (
            <UpgradedGrowthAnalyticsView token={token} />
          ) : activeTab === 'content' ? (
            <ContentIntelligenceView token={token} />
          ) : activeTab === 'prediction' ? (
            <MathematicalPredictionView token={token} />
          ) : activeTab === 'settings' || activeTab === 'connections' ? (
            <SettingsView token={token} onAuthUpdate={onAuthUpdate} defaultTab={activeTab === 'connections' ? 'connections' : 'account'} />
          ) : activeTab === 'debug' ? (
            <DebugView token={token} />
          ) : activeTab === 'admin' ? (
            <AdminPanel token={token} />
          ) : activeTab === 'ai_copilot' ? (
            <AICopilot token={token} />
          ) : activeTab === 'team' ? (
            <TeamWorkspaceView token={token} />
          ) : activeTab === 'reports' ? (
            <ReportsView token={token} />
          ) : activeTab === 'notifications' ? (
            <NotificationCenterView token={token} />
          ) : activeTab === 'audience' ? (
            <AudienceAnalyticsView token={token} />
          ) : (

            <div className="dash-overview">
              {/* Instagram Live Banner */}
              {instagramData && instagramData.status === 'connected' ? (
                <div className="dash-ig-banner">
                  <div className="dash-ig-left">
                    <img 
                      src={`https://api.dicebear.com/7.x/identicon/svg?seed=${instagramData.account_name}`} 
                      alt="Profile" 
                      className="dash-ig-avatar"
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <span className="dash-ig-name">{instagramData.account_name}</span>
                        <span className="ds-badge ds-badge-default">LIVE</span>
                      </div>
                      <div className="dash-ig-stats">
                        {(instagramData.followers || 0).toLocaleString()} followers · {(instagramData.views || 0).toLocaleString()} views
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                      Real-time sync
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--success)', marginTop: 'var(--space-0_5)' }}>
                      ● Active
                    </div>
                  </div>
                </div>
              ) : (
                <div className="dash-ig-banner" style={{ opacity: 0.7 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                    <span>Connect your Instagram account to view live analytics</span>
                  </div>
                  <button 
                    onClick={() => setActiveTab('settings')}
                    className="ds-btn-primary ds-btn-sm"
                  >
                    Connect
                  </button>
                </div>
              )}

              {/* Platform Status Grid */}
              <div>
                <div className="dash-section-header" style={{ marginBottom: 'var(--space-3)' }}>
                  <h3 className="dash-section-title">Connected Platforms</h3>
                  <span className="dash-section-subtitle">Real-time telemetry</span>
                </div>

                <div className="dash-platform-grid stagger-children">
                  {(Array.isArray(platformPerformance) ? platformPerformance : []).map((p) => {
                    const isConn = p.status === 'connected';
                    return (
                      <div
                        key={p.platform}
                        className={`dash-platform-card ${!isConn ? 'disconnected' : ''}`}
                        onClick={() => isConn && setActiveTab(`platform_${p.platform.toLowerCase()}`)}
                        style={isConn ? { borderColor: `${p.color}33` } : undefined}
                      >
                        <div className="dash-platform-top">
                          <div className="dash-platform-name">
                            <span className="dash-platform-dot" style={{ background: isConn ? p.color : 'var(--text-muted)' }} />
                            {p.platform}
                          </div>
                          <span className={`ds-badge ${isConn ? 'ds-badge-success' : 'ds-badge-default'}`}>
                            {isConn ? 'LIVE' : 'OFFLINE'}
                          </span>
                        </div>

                        {isConn ? (
                          <>
                            <div className="dash-platform-followers">
                              {p.followers ? p.followers.toLocaleString() : '0'}
                              <span>followers</span>
                            </div>
                            <div className="dash-platform-meta">
                              <span>{(p.views || 0).toLocaleString()} views</span>
                              <span className="dash-platform-cta" style={{ color: p.color }}>View →</span>
                            </div>
                          </>
                        ) : (
                          <div className="dash-platform-meta" style={{ marginTop: 'var(--space-1)' }}>
                            <span>Not connected</span>
                            <button
                              onClick={(e) => { e.stopPropagation(); setActiveTab('settings'); }}
                              className="ds-btn-ghost ds-btn-sm"
                              style={{ padding: 0, fontSize: 'var(--text-xs)' }}
                            >
                              Connect →
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* KPI Metrics */}
              <section>
                <KPICards data={kpiData} />
              </section>

              {/* Charts */}
              <section className="dash-charts-grid">
                <ViewsChart data={viewsData.length ? viewsData : undefined} />
                <FollowersChart data={followersData.length ? followersData : undefined} />
              </section>
              <section className="dash-charts-grid">
                <AIInsights />
                <CompareContent />
              </section>
              <section className="dash-charts-grid">
                <TrendingContent />
                <TopContentTable />
              </section>
            </div>
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

      {isHyperUI && <HyperAIOrb />}
    </div>
  );
}

