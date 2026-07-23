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
import DashboardLayout from './DashboardLayout';
import PageTransition from './PageTransition';

import { kpiData as dummyKpiData, platformPerformance as dummyPerformance } from '../../data/dummyAnalytics';

export default function AnalyticsDashboard({ token, onLogout, onAuthUpdate }) {
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notifications, setNotifications] = useState([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [userRole, setUserRole] = useState('Creator');
  
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
        // Fetch Instagram Graph API Live Details
        const resIg = await fetch(`${baseUrl}/api/instagram/profile`, { headers });
        if (resIg.ok) {
          const igJson = await resIg.json();
          setInstagramData(igJson);
        }

        // Fetch KPIs & performance
        const resStats = await fetch(`${baseUrl}/api/analytics`, { headers });
        if (resStats.ok) {
          const stats = await resStats.json();
          if (stats.kpiData) setKpiData(stats.kpiData);
          if (stats.platformComparison || stats.platformPerformance) {
            setPlatformPerformance(stats.platformComparison || stats.platformPerformance);
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
            <div style={{
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: '#fbbf24',
              padding: '12px 18px',
              borderRadius: '12px',
              fontSize: '13px',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>⚠️ <strong>Notice:</strong> {liveDataWarning}</span>
              <button 
                onClick={() => setActiveTab('settings')}
                className="theme-button-primary"
                style={{ fontSize: '12px', padding: '4px 12px' }}
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
          ) : activeTab === 'settings' ? (
            <SettingsView token={token} onAuthUpdate={onAuthUpdate} />
          ) : activeTab === 'debug' ? (
            <DebugView token={token} />
          ) : activeTab === 'admin' ? (
            <AdminPanel token={token} />
          ) : activeTab === 'ai_copilot' ? (
            <AICopilot token={token} />
          ) : activeTab === 'audience' ? (
            <AudiencePieChart data={audienceData} setActiveTab={setActiveTab} token={token} />
          ) : (
            <>
              {/* Default Overview Dashboard */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Instagram Graph API Live Connected Status Card */}
                {instagramData && instagramData.connected ? (
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(225, 48, 108, 0.12), rgba(131, 58, 180, 0.12))',
                    border: '1px solid rgba(225, 48, 108, 0.3)',
                    borderRadius: '16px',
                    padding: '16px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <img 
                        src={instagramData.profile.profile_picture_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"} 
                        alt="Profile" 
                        style={{ width: '46px', height: '46px', borderRadius: '50%', border: '2px solid #e1306c', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-primary)' }}>@{instagramData.profile.username}</span>
                          <span style={{ background: 'rgba(225, 48, 108, 0.2)', color: '#e1306c', fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '12px' }}>
                            META GRAPH API LIVE
                          </span>
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {instagramData.profile.followers_count.toLocaleString()} Followers • Reach: {instagramData.analytics.reach.toLocaleString()} • Engagement: {instagramData.analytics.avg_engagement}%
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', fontSize: '11px', color: 'var(--text-secondary)' }}>
                      <div>Last Synced: <strong>{instagramData.profile.last_synced_at}</strong></div>
                      <div style={{ color: '#10b981', marginTop: '2px' }}>● Live Auto-Sync Active (Every 15m)</div>
                    </div>
                  </div>
                ) : (
                  <div style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '16px',
                    padding: '16px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color: 'var(--text-secondary)',
                    fontSize: '13px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>📸</span>
                      <span><strong>Connect your Instagram Business Account</strong> to view live Meta Graph API analytics, reach, and reels insights.</span>
                    </div>
                    <button 
                      onClick={() => setActiveTab('settings')}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        background: 'var(--accent-primary)',
                        color: '#ffffff',
                        border: 'none',
                        fontWeight: 600,
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      Connect Account ➔
                    </button>
                  </div>
                )}

                {/* Multi-Platform Aggregated Status Grid */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                      🌐 Aggregated Multi-Platform Channel Telemetry
                    </h3>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      Aggregating connected accounts only
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    {(Array.isArray(platformPerformance) ? platformPerformance : []).map((p) => {
                      const isConn = p.status === 'connected';
                      return (
                        <div
                          key={p.platform}
                          className="theme-card"
                          onClick={() => isConn && setActiveTab(`platform_${p.platform.toLowerCase()}`)}
                          style={{
                            padding: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            cursor: isConn ? 'pointer' : 'default',
                            border: isConn ? `1px solid ${p.color}44` : '1px solid var(--border-color)',
                            background: isConn ? `linear-gradient(135deg, ${p.color}11, var(--bg-card))` : 'var(--bg-card)',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '18px' }}>{p.icon}</span>
                              <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)' }}>{p.platform}</span>
                            </div>
                            <span style={{
                              fontSize: '10px',
                              fontWeight: 800,
                              padding: '2px 8px',
                              borderRadius: '10px',
                              background: isConn ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                              color: isConn ? '#10b981' : 'var(--text-secondary)'
                            }}>
                              {isConn ? '● CONNECTED' : 'NOT CONNECTED'}
                            </span>
                          </div>

                          {isConn ? (
                            <>
                              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
                                {p.followers ? p.followers.toLocaleString() : '0'} <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500 }}>followers</span>
                              </div>
                              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                                <span>Views: {(p.views || 0).toLocaleString()}</span>
                                <span style={{ color: p.color, fontWeight: 700 }}>Open ➔</span>
                              </div>
                            </>
                          ) : (
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                              <span>No live feed</span>
                              <button
                                onClick={(e) => { e.stopPropagation(); setActiveTab('settings'); }}
                                style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '11px', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                              >
                                Connect ➔
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <section>
                  <KPICards data={kpiData} />
                </section>
                <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <ViewsChart data={viewsData.length ? viewsData : undefined} />
                  <FollowersChart data={followersData.length ? followersData : undefined} />
                </section>
                <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <AIInsights />
                  <CompareContent />
                </section>
                <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <TrendingContent />
                  <TopContentTable />
                </section>
              </div>
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
