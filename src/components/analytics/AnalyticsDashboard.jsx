import React, { useState, useEffect } from 'react';
import KPICards from './KPIcards';
import ViewsChart from './ViewsChart';
import FollowersChart from './FollowersChart';
import AudiencePieChart from './AudiencePieChart';
import EngagementBarChart from './EngagementBarChart';

import { kpiData as dummyKpiData, platformPerformance as dummyPerformance } from '../../data/dummyAnalytics';

export default function AnalyticsDashboard({ token, onLogout }) {
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [kpiData, setKpiData] = useState(dummyKpiData);
  const [platformPerformance, setPlatformPerformance] = useState(dummyPerformance);
  const [viewsData, setViewsData] = useState([]);
  const [followersData, setFollowersData] = useState([]);
  const [audienceData, setAudienceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const baseUrl = 'http://localhost:8000';
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
    <div className="dashboard-container">
      {/* Import Inter Font and Set Dashboard-wide Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        .dashboard-container {
          background-color: #0b0f19;
          min-height: 100vh;
          padding: 2.5rem 2rem;
          color: #f8fafc;
          font-family: 'Inter', sans-serif;
          box-sizing: border-box;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
          gap: 1.5rem;
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
          background: linear-gradient(135deg, #f8fafc 0%, #94a3b8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .dashboard-subtitle {
          font-size: 0.875rem;
          color: #64748b;
          margin: 0;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        /* Platform filter pill buttons */
        .filter-group {
          display: flex;
          background: rgba(30, 41, 59, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 9999px;
          padding: 4px;
          gap: 4px;
        }

        .filter-btn {
          background: transparent;
          border: none;
          color: #94a3b8;
          padding: 8px 16px;
          border-radius: 9999px;
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filter-btn:hover {
          color: #cbd5e1;
        }

        .filter-btn.active {
          background: #3b82f6;
          color: #f8fafc;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
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
        }

        .dashboard-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          font-size: 1.125rem;
          color: #94a3b8;
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

      {/* Header Section */}
      <header className="dashboard-header">
        <div className="dashboard-title-group">
          <h1 className="dashboard-title">Creator Analytics</h1>
          <p className="dashboard-subtitle">Milestone 1 Performance Dashboard</p>
        </div>

        {/* Header Actions */}
        <div className="header-actions">
          {/* Dynamic Filters */}
          <div className="filter-group">
            {['All', 'YouTube', 'Instagram', 'TikTok', 'Twitch'].map((platform) => (
              <button
                key={platform}
                className={`filter-btn ${selectedPlatform === platform ? 'active' : ''}`}
                onClick={() => setSelectedPlatform(platform)}
              >
                {platform}
              </button>
            ))}
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
      ) : (
        <>
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
    </div>
  );
}

