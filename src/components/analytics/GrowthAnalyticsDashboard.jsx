import React, { useState, useEffect } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function GrowthAnalyticsDashboard({ token, setActiveTab }) {
  const [growth, setGrowth] = useState([]);
  const [categories, setCategories] = useState([]);
  const [consistency, setConsistency] = useState(null);
  const [trends, setTrends] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchGrowthData = async () => {
    try {
      setLoading(true);
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const resGrowth = await fetch('http://127.0.0.1:8000/api/analytics/growth', { headers });
      const resCats = await fetch('http://127.0.0.1:8000/api/analytics/categories', { headers });
      const resConst = await fetch('http://127.0.0.1:8000/api/analytics/consistency', { headers });
      const resTrends = await fetch('http://127.0.0.1:8000/api/analytics/top-posts', { headers });
      const resForecast = await fetch('http://127.0.0.1:8000/api/prediction/forecast', { headers });
      const resPosts = await fetch('http://127.0.0.1:8000/api/analytics/top-content', { headers });

      if (resGrowth.ok && resCats.ok && resConst.ok && resTrends.ok && resForecast.ok && resPosts.ok) {
        setGrowth(await resGrowth.json());
        setCategories(await resCats.json());
        setConsistency(await resConst.json());
        setTrends(await resTrends.json());
        setForecast(await resForecast.json());
        setPosts(await resPosts.json());
      } else {
        throw new Error('Failed to load growth analytics details');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchGrowthData();
    }
  }, [token]);

  if (loading) {
    return <div style={{ color: 'var(--text-secondary)', padding: '3rem', textAlign: 'center' }}>Extrapolating growth dynamics...</div>;
  }

  if (error) {
    return <div style={{ color: '#ef4444', padding: '3rem', textAlign: 'center' }}>⚠️ {error}</div>;
  }

  if (!growth || growth.length === 0) {
    return (
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '24px',
        padding: '4rem 2rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
        maxWidth: '600px',
        margin: '2rem auto',
        fontFamily: 'Inter, sans-serif',
        color: 'var(--text-primary)'
      }}>
        <div style={{ fontSize: '3.5rem' }}>📈</div>
        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>No Connected Accounts</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0, lineHeight: '1.5', maxWidth: '400px' }}>
          No connected social media accounts found. Please connect your YouTube, Instagram, or LinkedIn account in Settings to begin tracking follower growth.
        </p>
        <button 
          type="button" 
          onClick={() => setActiveTab('settings')}
          style={{
            background: 'var(--accent-primary)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            padding: '10px 20px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'opacity 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
          onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
        >
          Go to Connected Accounts Settings
        </button>
      </div>
    );
  }

  return (
    <div className="growth-dashboard">
      <style>{`
        .growth-dashboard {
          font-family: 'Inter', sans-serif;
          color: var(--text-primary, #f8fafc);
          display: flex;
          flex-direction: column;
          gap: 2rem;
          width: 100%;
        }

        .growth-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.5rem;
          width: 100%;
        }

        .growth-card {
          background: var(--bg-secondary, #111827);
          border: 1px solid var(--border-color, rgba(255,255,255,0.08));
          border-radius: 24px;
          padding: 1.5rem;
          box-shadow: 0 4px 30px rgba(0,0,0,0.2);
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .growth-card h3 {
          font-size: 1rem;
          font-weight: 700;
          margin: 0;
        }

        .growth-card p {
          font-size: 0.8125rem;
          color: var(--text-secondary, #94a3b8);
          margin: 0;
        }

        /* Consistency Score styling */
        .consistency-score-circle {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 10px 14px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
          border-radius: 16px;
        }

        .consistency-percentage {
          font-size: 2rem;
          font-weight: 800;
          color: var(--accent-primary, #3b82f6);
        }

        .trends-analysis-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1rem;
        }

        .trend-metric-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
          border-radius: 14px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .trend-metric-label {
          font-size: 0.7rem;
          color: var(--text-secondary, #94a3b8);
          text-transform: uppercase;
        }

        .trend-metric-value {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .custom-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.85rem;
        }

        .custom-table th {
          padding: 12px 16px;
          color: var(--text-secondary);
          border-bottom: 1px solid var(--border-color, rgba(255,255,255,0.08));
          text-transform: uppercase;
          font-size: 0.72rem;
          letter-spacing: 0.05em;
        }

        .custom-table td {
          padding: 14px 16px;
          border-bottom: 1px solid var(--border-color, rgba(255,255,255,0.08));
        }

        .category-best {
          background: rgba(16, 185, 129, 0.12);
          color: #34d399;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 9999px;
          font-size: 0.7rem;
        }
      `}</style>

      {/* Header */}
      <div>
        <h2 style={{ margin: 0, fontSize: '1.5rem' }}>📈 Channel Growth & Projections</h2>
        <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Detailed timeline analytics, category comparisons, and forecast projections.
        </p>
      </div>

      {/* Row 1: Follower & Views Timeline Charts */}
      <div className="growth-grid">
        <div className="growth-card">
          <div>
            <h3>Subscriber Growth Rate</h3>
            <p>Monthly net follower gains timeline</p>
          </div>
          <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer>
              <AreaChart data={growth} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="followerGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-primary, #3b82f6)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent-primary, #3b82f6)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color, rgba(255,255,255,0.08))" />
                <XAxis dataKey="date" stroke="var(--text-secondary)" fontSize={10} />
                <YAxis stroke="var(--text-secondary)" fontSize={10} tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} />
                <Tooltip />
                <Area type="monotone" dataKey="followers" stroke="var(--accent-primary, #3b82f6)" strokeWidth={3} fillOpacity={1} fill="url(#followerGlow)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="growth-card">
          <div>
            <h3>Views & Engagement Growth</h3>
            <p>Viewer reach and algorithms engagement timeline</p>
          </div>
          <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer>
              <BarChart data={growth} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color, rgba(255,255,255,0.08))" />
                <XAxis dataKey="date" stroke="var(--text-secondary)" fontSize={10} />
                <YAxis stroke="var(--text-secondary)" fontSize={10} tickFormatter={(v) => `${(v/1000000).toFixed(1)}M`} />
                <Tooltip />
                <Bar dataKey="views" fill="var(--accent-secondary, #ec4899)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Consistency Score and Projections */}
      <div className="growth-grid">
        {/* Projections Card */}
        <div className="growth-card">
          <div>
            <h3>Linear Projections Forecasts</h3>
            <p>Moving average estimations (Next 7, 30, and 90 Days)</p>
          </div>
          <table className="custom-table" style={{ fontSize: '0.8rem' }}>
            <thead>
              <tr>
                <th>Target Period</th>
                <th>Projected Subs</th>
                <th>Views Target</th>
                <th>Revenue Est</th>
                <th>Confidence</th>
              </tr>
            </thead>
            <tbody>
              {forecast.map((f, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: '700' }}>{f.period}</td>
                  <td>{f.followers?.toLocaleString()}</td>
                  <td>{f.views?.toLocaleString()}</td>
                  <td style={{ fontWeight: '700', color: '#34d399' }}>${f.revenue?.toLocaleString()}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{f.confidence}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Consistency and Posting Trends */}
        <div className="growth-card">
          <div>
            <h3>Consistency Index & Upload Trends</h3>
            <p>Upload frequencies index and posting schedules scores.</p>
          </div>
          <div className="consistency-score-circle">
            <span className="consistency-percentage">{consistency?.consistencyScore}%</span>
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>Upload Consistency Score</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {consistency?.uploadFrequency} • {consistency?.missedUploads} missed uploads this month
              </div>
            </div>
          </div>
          
          <h4 style={{ margin: '0.5rem 0 0.25rem 0', fontSize: '0.85rem' }}>Upload schedules analysis</h4>
          <div className="trends-analysis-grid">
            <div className="trend-metric-card">
              <span className="trend-metric-label">Best upload Day</span>
              <span className="trend-metric-value">{trends?.bestUploadDay}</span>
            </div>
            <div className="trend-metric-card">
              <span className="trend-metric-label">Best time slot</span>
              <span className="trend-metric-value">{trends?.bestUploadTime}</span>
            </div>
            <div className="trend-metric-card">
              <span className="trend-metric-label">Top Category</span>
              <span className="trend-metric-value" style={{ color: 'var(--accent-primary)' }}>{trends?.bestPerformingCategory}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Category Breakdown Table */}
      <div className="growth-card" style={{ width: '100%' }}>
        <div>
          <h3>Content Type Performance Metrics</h3>
          <p>Comparative analysis of metrics averaged per video category</p>
        </div>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Content Niche</th>
              <th>Avg Views</th>
              <th>Avg Watch Time</th>
              <th>Engagement</th>
              <th>Growth Rate</th>
              <th>Est. Revenue</th>
              <th>Status Rating</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c, i) => (
              <tr key={i}>
                <td style={{ fontWeight: '700' }}>{c.type}</td>
                <td>{c.avgViews?.toLocaleString()}</td>
                <td>{c.avgWatchTime} secs</td>
                <td>{c.avgEngagement}%</td>
                <td style={{ color: '#34d399', fontWeight: '600' }}>+{c.growthRate}%</td>
                <td style={{ fontWeight: '700' }}>${c.revenue?.toLocaleString()}</td>
                <td>
                  {i === 0 ? <span className="category-best">Best Performer</span> : <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Standard</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Highest Performing Content Posts List */}
      <div className="growth-card" style={{ width: '100%' }}>
        <div>
          <h3>Highest Performing Posts Ledger</h3>
          <p>Detailed performance records for top-performing assets</p>
        </div>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Platform</th>
              <th>Content Title</th>
              <th>Views Count</th>
              <th>Engagement rate</th>
              <th>Est. Earnings</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p, i) => (
              <tr key={i}>
                <td style={{ fontWeight: '700', color: 'var(--accent-primary)' }}>{p.platform}</td>
                <td>{p.title}</td>
                <td style={{ fontWeight: '700' }}>{p.views}</td>
                <td style={{ color: 'var(--accent-secondary)' }}>{p.engagement}</td>
                <td style={{ fontWeight: '700', color: '#34d399' }}>
                  {p.platform === 'Instagram' ? '$14.40' : (p.platform === 'YouTube' ? '$8.10' : '$3.90')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
