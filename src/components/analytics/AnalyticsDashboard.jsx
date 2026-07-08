import React, { useState } from 'react';
import KPICards from './KPIcards';
import ViewsChart from './ViewsChart';
import FollowersChart from './FollowersChart';
import AudiencePieChart from './AudiencePieChart';
import EngagementBarChart from './EngagementBarChart';

import { kpiData, platformPerformance } from '../../data/dummyAnalytics';

export default function AnalyticsDashboard() {
  const [selectedPlatform, setSelectedPlatform] = useState('All');

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
        change: undefined, // no comparative change data for specific platforms
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
        <ViewsChart />
        <FollowersChart />
      </section>

      {/* Bottom Section: Audience Pie Chart & Engagement Bar Chart */}
      <section className="dashboard-row">
        <AudiencePieChart />
        <EngagementBarChart />
      </section>
    </div>
  );
}
