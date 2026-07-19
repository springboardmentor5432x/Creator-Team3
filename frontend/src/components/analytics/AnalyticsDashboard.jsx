import React, { useState, useEffect } from 'react';
import KPICards from './KPIcards';
import ViewsChart from './ViewsChart';
import FollowersChart from './FollowersChart';
import AudiencePieChart from './AudiencePieChart';
import EngagementBarChart from './EngagementBarChart';

export default function AnalyticsDashboard({ token }) {
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('http://localhost:8000/api/analytics', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to load dashboard metrics');
        }
        const data = await response.json();
        setAnalyticsData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAnalytics();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="premium-spinner"></div>
        <p className="loader-text">Assembling real-time creator metrics...</p>
        <style>{`
          .loader-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 60vh;
            color: var(--text-secondary);
          }
          .premium-spinner {
            width: 48px;
            height: 48px;
            border: 3px solid rgba(59, 130, 246, 0.1);
            border-radius: 50%;
            border-top-color: var(--accent-blue);
            animation: spin 1s ease-in-out infinite;
            margin-bottom: 16px;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          .loader-text {
            font-size: 0.95rem;
            font-weight: 500;
            letter-spacing: 0.02em;
          }
        `}</style>
      </div>
    );
  }

  if (error || !analyticsData) {
    return (
      <div className="error-container">
        <div className="error-icon-badge">!</div>
        <p className="error-title">Data Retrieval Offline</p>
        <p className="error-msg">{error || 'Unable to sync metrics.'}</p>
        <style>{`
          .error-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 50vh;
            text-align: center;
            padding: 20px;
          }
          .error-icon-badge {
            width: 50px;
            height: 50px;
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.2);
            color: #f87171;
            font-size: 24px;
            font-weight: 700;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 16px;
          }
          .error-title {
            font-size: 1.2rem;
            font-weight: 700;
            margin-bottom: 6px;
          }
          .error-msg {
            color: var(--text-secondary);
            font-size: 0.9rem;
          }
        `}</style>
      </div>
    );
  }

  const { kpiData, platformPerformance, monthlyViews, monthlyFollowers, audienceDemographics } = analyticsData;

  const getFilteredKpiData = () => {
    if (selectedPlatform === 'All') {
      return kpiData;
    }

    const platformData = platformPerformance.find(
      (p) => p.platform.toLowerCase() === selectedPlatform.toLowerCase()
    );

    if (!platformData) return kpiData;

    return {
      followers: {
        label: 'Platform Followers',
        value: platformData.followers,
        status: 'positive'
      },
      views: {
        label: 'Platform Views',
        value: platformData.views,
        status: 'positive'
      },
      likes: {
        label: 'Platform Likes',
        value: platformData.likes,
        status: 'positive'
      },
      comments: {
        label: 'Platform Comments',
        value: platformData.comments,
        status: 'positive'
      },
      engagementRate: {
        label: 'Engagement Rate',
        value: platformData.engagementRate,
        status: 'positive'
      }
    };
  };

  const activeKpiData = getFilteredKpiData();

  return (
    <div className="dashboard-content">
      {/* Import Inter Font and Set Dashboard-wide Styles */}
      <style>{`
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1.5rem;
        }

        .dashboard-title-group {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .dashboard-title {
          font-size: 1.75rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin: 0;
          background: linear-gradient(135deg, #f8fafc 0%, #94a3b8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .dashboard-subtitle {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin: 0;
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

        /* Grid Row Layouts */
        .dashboard-row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-bottom: 1.5rem;
          width: 100%;
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
      </header>

      {/* Top Section: KPI Cards */}
      <section className="dashboard-section">
        <KPICards data={activeKpiData} />
      </section>

      {/* Middle Section: Views Chart & Followers Chart */}
      <section className="dashboard-row">
        <ViewsChart data={monthlyViews[selectedPlatform]} />
        <FollowersChart data={monthlyFollowers[selectedPlatform]} />
      </section>

      {/* Bottom Section: Audience Pie Chart & Engagement Bar Chart */}
      <section className="dashboard-row">
        <AudiencePieChart data={audienceDemographics[selectedPlatform]} />
        <EngagementBarChart data={platformPerformance} />
      </section>
    </div>
  );
}
