import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PIE_COLORS = ['#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6'];

export default function UpgradedRevenueDashboard({ token, setActiveTab }) {
  const [filter, setFilter] = useState('30'); // 7, 30, 90, 180, 365
  const [data, setData] = useState(null);
  const [brands, setBrands] = useState([]);
  const [sponsorships, setSponsorships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const resSummary = await fetch(`http://127.0.0.1:8000/api/revenue/summary?days=${filter}`, { headers });
      const resBrands = await fetch('http://127.0.0.1:8000/api/revenue/brands', { headers });
      const resSponsors = await fetch('http://127.0.0.1:8000/api/revenue/sponsorships', { headers });
      
      if (resSummary.ok && resBrands.ok && resSponsors.ok) {
        const summary = await resSummary.json();
        const brandData = await resBrands.json();
        const sponsorData = await resSponsors.json();
        
        setData(summary);
        setBrands(brandData);
        setSponsorships(sponsorData);
      } else {
        throw new Error('Failed to load revenue dashboard metrics');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchRevenueData();
    }
  }, [token, filter]);

  const handleExportCSV = () => {
    window.open('http://127.0.0.1:8000/api/revenue/export', '_blank');
  };

  if (loading) {
    return <div style={{ color: 'var(--text-secondary)', padding: '3rem', textAlign: 'center' }}>Compiling financial ledger...</div>;
  }

  if (error) {
    return <div style={{ color: '#ef4444', padding: '3rem', textAlign: 'center' }}>⚠️ {error}</div>;
  }

  if (data && data.error) {
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
        <div style={{ fontSize: '3.5rem' }}>💰</div>
        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>No Connected Accounts</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0, lineHeight: '1.5', maxWidth: '400px' }}>
          {data.error} {data.action_required}
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

  const kpis = data?.summary || {};
  const charts = data?.charts || {};
  const insights = data?.insights || [];

  return (
    <div className="revenue-dashboard">
      <style>{`
        .revenue-dashboard {
          font-family: 'Inter', sans-serif;
          color: var(--text-primary, #f8fafc);
          display: flex;
          flex-direction: column;
          gap: 2rem;
          width: 100%;
        }

        .dashboard-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .filter-export-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .time-select {
          background: rgba(30, 41, 59, 0.6);
          border: 1px solid var(--border-color, rgba(255,255,255,0.08));
          color: var(--text-primary);
          padding: 10px 16px;
          border-radius: 12px;
          outline: none;
          font-size: 0.85rem;
          cursor: pointer;
        }

        .export-btn {
          background: var(--accent-primary, #3b82f6);
          color: #ffffff;
          border: none;
          border-radius: 12px;
          padding: 10px 18px;
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .export-btn:hover {
          filter: brightness(1.1);
          transform: translateY(-1px);
        }

        /* KPI Grid */
        .revenue-kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.25rem;
        }

        .kpi-summary-card {
          background: var(--bg-secondary, #111827);
          border: 1px solid var(--border-color, rgba(255,255,255,0.08));
          border-radius: 20px;
          padding: 1.5rem;
          box-shadow: 0 4px 30px rgba(0,0,0,0.2);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .kpi-label {
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--text-secondary, #94a3b8);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .kpi-value {
          font-size: 1.65rem;
          font-weight: 800;
        }

        .kpi-badge {
          font-size: 0.75rem;
          padding: 3px 8px;
          border-radius: 9999px;
          width: fit-content;
          font-weight: 700;
        }

        .kpi-badge.up {
          background: rgba(16, 185, 129, 0.1);
          color: #34d399;
        }

        /* Charts Row */
        .revenue-charts-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        @media (max-width: 1024px) {
          .revenue-charts-grid {
            grid-template-columns: 1fr;
          }
        }

        .revenue-chart-card {
          background: var(--bg-secondary, #111827);
          border: 1px solid var(--border-color, rgba(255,255,255,0.08));
          border-radius: 24px;
          padding: 1.5rem;
          box-shadow: 0 4px 30px rgba(0,0,0,0.2);
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .chart-card-title {
          font-size: 1rem;
          font-weight: 700;
          margin: 0;
        }

        /* Tables and Insights */
        .insights-box {
          background: var(--accent-glow, rgba(59, 130, 246, 0.05));
          border: 1px solid var(--accent-primary, #3b82f6);
          border-radius: 20px;
          padding: 1.25rem 1.5rem;
        }

        .insights-box h3 {
          font-size: 0.95rem;
          font-weight: 700;
          margin: 0 0 0.75rem 0;
          color: var(--accent-primary);
        }

        .insights-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding-left: 1.2rem;
          margin: 0;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .table-card {
          background: var(--bg-secondary, #111827);
          border: 1px solid var(--border-color, rgba(255,255,255,0.08));
          border-radius: 20px;
          padding: 1.5rem;
          box-shadow: 0 4px 30px rgba(0,0,0,0.2);
          overflow-x: auto;
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

        .status-pill {
          padding: 2px 8px;
          border-radius: 9999px;
          font-size: 0.7rem;
          font-weight: 700;
        }

        .status-pill.active {
          background: rgba(59, 130, 246, 0.12);
          color: #60a5fa;
        }

        .status-pill.completed {
          background: rgba(16, 185, 129, 0.12);
          color: #34d399;
        }
      `}</style>

      {/* Header */}
      <div className="dashboard-header-row">
        <div>
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>💰 Revenue Analytics Center</h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Real-time and estimated income statistics across platforms and brand collaborations.
          </p>
        </div>
        <div className="filter-export-row">
          <select 
            className="time-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 3 Months</option>
            <option value="180">Last 6 Months</option>
            <option value="365">Last 1 Year</option>
          </select>
          <button 
            type="button" 
            className="export-btn"
            onClick={handleExportCSV}
          >
            Export CSV Report
          </button>
        </div>
      </div>

      {/* KPI Cards Summary */}
      <div className="revenue-kpi-grid">
        <div className="kpi-summary-card">
          <span className="kpi-label">Total Revenue</span>
          <span className="kpi-value">${kpis.totalRevenue?.toLocaleString()}</span>
          <span className="kpi-badge up">+{kpis.growthRate}% MoM</span>
        </div>
        <div className="kpi-summary-card">
          <span className="kpi-label">Monthly Revenue</span>
          <span className="kpi-value">${kpis.monthlyRevenue?.toLocaleString()}</span>
        </div>
        <div className="kpi-summary-card">
          <span className="kpi-label">Highest Source</span>
          <span className="kpi-value" style={{ fontSize: '1.25rem', fontWeight: '700' }}>{kpis.highestSource}</span>
        </div>
        <div className="kpi-summary-card">
          <span className="kpi-label">Highest Platform</span>
          <span className="kpi-value" style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--accent-primary)' }}>{kpis.highestPlatform}</span>
        </div>
        <div className="kpi-summary-card">
          <span className="kpi-label">Highest Brand</span>
          <span className="kpi-value" style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--accent-secondary)' }}>{kpis.highestBrand}</span>
        </div>
      </div>

      {/* Financial Insights box */}
      {insights.length > 0 && (
        <div className="insights-box">
          <h3>⚡ Financial Projections & Insights</h3>
          <ul className="insights-list">
            {insights.map((insight, idx) => (
              <li key={idx}>{insight}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Row 1 Charts: Trend Analysis */}
      <div className="revenue-charts-grid">
        <div className="revenue-chart-card">
          <h4 className="chart-card-title">Monthly Revenue Trends</h4>
          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer>
              <AreaChart data={charts.trends || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaRevGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-primary, #3b82f6)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent-primary, #3b82f6)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color, rgba(255,255,255,0.08))" />
                <XAxis dataKey="period" stroke="var(--text-secondary)" fontSize={11} />
                <YAxis stroke="var(--text-secondary)" fontSize={11} tickFormatter={(val) => `$${val}`} />
                <Tooltip 
                  contentStyle={{ background: 'var(--bg-secondary, #1e293b)', borderColor: 'var(--border-color, rgba(255,255,255,0.08))' }}
                  formatter={(val) => [`$${val.toLocaleString()}`, 'Earnings']}
                />
                <Area type="monotone" dataKey="revenue" stroke="var(--accent-primary, #3b82f6)" strokeWidth={3} fillOpacity={1} fill="url(#areaRevGlow)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="revenue-chart-card">
          <h4 className="chart-card-title">Revenue by Platform</h4>
          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer>
              <BarChart data={charts.platform || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color, rgba(255,255,255,0.08))" />
                <XAxis dataKey="platform" stroke="var(--text-secondary)" fontSize={11} />
                <YAxis stroke="var(--text-secondary)" fontSize={11} tickFormatter={(val) => `$${val}`} />
                <Tooltip 
                  contentStyle={{ background: 'var(--bg-secondary, #1e293b)', borderColor: 'var(--border-color, rgba(255,255,255,0.08))' }}
                  formatter={(val) => [`$${val.toLocaleString()}`, 'Earnings']}
                />
                <Bar dataKey="earnings" fill="var(--accent-secondary, #ec4899)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2 Charts: Source breakdown */}
      <div className="revenue-charts-grid">
        <div className="revenue-chart-card">
          <h4 className="chart-card-title">Revenue Source Breakdown</h4>
          <div style={{ display: 'flex', alignItems: 'center', height: 200 }}>
            <div style={{ flex: 1, height: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.source || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {(charts.source || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '130px' }}>
              {(charts.source || []).map((entry, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <div>
                    <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: PIE_COLORS[index % PIE_COLORS.length], marginRight: '6px' }}></span>
                    <span>{entry.name}</span>
                  </div>
                  <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>${entry.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Campaign Revenue Table */}
        <div className="table-card">
          <h4 className="chart-card-title" style={{ marginBottom: '1.25rem' }}>Brand Campaign Logs</h4>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Brand</th>
                <th>Campaign</th>
                <th>Revenue</th>
                <th>Date</th>
                <th>Platform</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((b, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: '700' }}>{b.brand}</td>
                  <td>{b.campaign}</td>
                  <td style={{ fontWeight: '700', color: '#34d399' }}>${b.revenue.toLocaleString()}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{b.date}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{b.platform}</td>
                  <td>
                    <span className={`status-pill ${b.status.toLowerCase()}`}>{b.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sponsorship Tracking List Table */}
      <div className="table-card" style={{ width: '100%' }}>
        <h4 className="chart-card-title" style={{ marginBottom: '1.25rem' }}>Sponsorship Program Schedules</h4>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Sponsor Name</th>
              <th>Campaign Niche</th>
              <th>Amount</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Platform</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sponsorships.map((s, i) => (
              <tr key={i}>
                <td style={{ fontWeight: '700' }}>{s.sponsor}</td>
                <td>{s.campaign}</td>
                <td style={{ fontWeight: '700', color: '#60a5fa' }}>${s.amount.toLocaleString()}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{s.startDate}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{s.endDate}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{s.platform}</td>
                <td>
                  <span className={`status-pill ${s.status.toLowerCase()}`}>{s.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
