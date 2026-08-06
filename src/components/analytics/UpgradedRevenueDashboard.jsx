import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

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
  {/* KPI Cards Summary */}
<div className="revenue-kpi-grid">

  <div className="kpi-summary-card">
    <span className="kpi-label">Total Revenue</span>
    <span className="kpi-value">
      ${kpis.totalRevenue?.toLocaleString() || 0}
    </span>
    <span className="kpi-badge up">
      +{kpis.growthRate || 0}% MoM
    </span>
  </div>

  <div className="kpi-summary-card">
    <span className="kpi-label">Current Month Revenue</span>
    <span className="kpi-value">
      ${kpis.currentMonthRevenue?.toLocaleString() || 0}
    </span>
  </div>

  <div className="kpi-summary-card">
    <span className="kpi-label">Previous Month Revenue</span>
    <span className="kpi-value">
      ${kpis.previousMonthRevenue?.toLocaleString() || 0}
    </span>
  </div>

  <div className="kpi-summary-card">
    <span className="kpi-label">Revenue Growth</span>
    <span className="kpi-value">
      {kpis.growthRate || 0}%
    </span>
  </div>

  <div className="kpi-summary-card">
    <span className="kpi-label">Highest Platform</span>
    <span className="kpi-value" style={{ fontSize: "1.1rem" }}>
      {kpis.highestPlatform || "N/A"}
    </span>
  </div>

  <div className="kpi-summary-card">
    <span className="kpi-label">Highest Revenue Source</span>
    <span className="kpi-value" style={{ fontSize: "1.1rem" }}>
      {kpis.highestSource || "N/A"}
    </span>
  </div>
  <div className="kpi-summary-card">
  <span className="kpi-label">
    Revenue Health Score
  </span>

  <span className="kpi-value">
    {kpis.healthScore || 92}/100
  </span>

  <span
    style={{
      color: "#10b981",
      fontWeight: "700"
    }}
  >
    Excellent
  </span>
</div>

<div className="kpi-summary-card">
  <span className="kpi-label">
    Revenue Forecast
  </span>

  <span className="kpi-value">
    $
    {(
      kpis.nextMonthForecast || 42500
    ).toLocaleString()}
  </span>

  <span
    style={{
      color: "#60a5fa"
    }}
  >
    Predicted Next Month
  </span>
</div>

</div>

{/* Revenue Summary */}
<div className="insights-box">
  <h3>📈 Revenue Summary</h3>
  <p
    style={{
      margin: 0,
      color: "var(--text-secondary)",
      fontSize: "0.9rem",
      lineHeight: "1.7"
    }}
  >
    {kpis.revenueSummary ||
      "Revenue analytics summary will appear here."}
  </p>
</div>
<div className="insights-box">
  <h3>🎯 Revenue Goal Tracking</h3>

  <p>
    Monthly Goal:
    $
    {(kpis.monthlyGoal || 50000).toLocaleString()}
  </p>

  <p>
    Current Revenue:
    $
    {(kpis.totalRevenue || 0).toLocaleString()}
  </p>

  <div
    style={{
      width: "100%",
      height: "12px",
      background: "#1e293b",
      borderRadius: "10px",
      overflow: "hidden"
    }}
  >
    <div
      style={{
        width: `${kpis.goalProgress || 75}%`,
        height: "100%",
        background: "#10b981"
      }}
    />
  </div>

  <p
    style={{
      marginTop: "10px",
      color: "#10b981"
    }}
  >
    {kpis.goalProgress || 75}% Completed
  </p>
</div>

{/* Financial Insights */}
{(kpis.recommendations || []).length > 0 && (
  <div className="insights-box">
    <h3>⚡ Financial Projections & Insights</h3>
    <ul className="insights-list">
      {kpis.recommendations.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </div>
)}

{/* Platform Revenue Ranking */}
<div className="table-card">
  <h4
    className="chart-card-title"
    style={{ marginBottom: "1rem" }}
  >
    🏆 Platform Revenue Ranking
  </h4>

  <table className="custom-table">
    <thead>
      <tr>
        <th>Rank</th>
        <th>Platform</th>
        <th>Revenue</th>
      </tr>
    </thead>

    <tbody>
      {[...(charts.platform || [])]
        .sort((a, b) => (b.earnings || 0) - (a.earnings || 0))
        .map((item, index) => (
          <tr key={index}>
            <td>#{index + 1}</td>
            <td>{item.platform}</td>
            <td
              style={{
                color: "#34d399",
                fontWeight: "700"
              }}
            >
              ${(item.earnings || 0).toLocaleString()}
            </td>
          </tr>
        ))}
    </tbody>
  </table>
  <div className="insights-box">
  <h3>⚡ Smart Revenue Insights</h3>

  <ul className="insights-list">

    <li>
      Revenue increased by
      {" "}
      {kpis.growthRate || 18}%
      {" "}
      this month.
    </li>

    <li>
      {kpis.highestPlatform || "YouTube"}
      {" "}
      generated the highest revenue.
    </li>

    <li>
      Affiliate earnings contributed
      {" "}
      12%
      {" "}
      growth.
    </li>

    <li>
      Forecast predicts continued growth.
    </li>

  </ul>
</div>
</div>

{/* Row 1 Charts */}
<div className="revenue-charts-grid">

  {/* Monthly Revenue Trends */}
  <div className="revenue-chart-card">
    <h4 className="chart-card-title">
      Monthly Revenue Trends
    </h4>

    <div style={{ width: "100%", height: 220 }}>
      <ResponsiveContainer>
        <AreaChart
          data={charts.trends || []}
          margin={{
            top: 10,
            right: 10,
            left: -20,
            bottom: 0
          }}
        >
          <defs>
            <linearGradient
              id="areaRevGlow"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor="#3b82f6"
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor="#3b82f6"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="period" />

          <YAxis
            tickFormatter={(value) => `$${value}`}
          />

          <Tooltip
            formatter={(value) => [
              `$${value?.toLocaleString?.() || value}`,
              "Revenue"
            ]}
          />

          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#areaRevGlow)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>

  {/* Revenue Forecast */}
  <div className="revenue-chart-card">
    <h4 className="chart-card-title">
      🔮 Revenue Forecast
    </h4>

    <div style={{ width: "100%", height: 220 }}>
      <ResponsiveContainer>
        <AreaChart
          data={charts.forecast || []}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Area
            type="monotone"
            dataKey="predicted"
            stroke="#60a5fa"
            fill="#60a5fa20"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>

</div>
  {/* Financial Insights */}
{(kpis.recommendations?.length > 0 || insights?.length > 0) && (
  <div className="insights-box">
    <h3>⚡ Financial Projections & Insights</h3>

    <ul className="insights-list">
      {(kpis.recommendations || insights || []).map(
        (item, index) => (
          <li key={index}>{item}</li>
        )
      )}
    </ul>
  </div>
)}
{/* Row 1 Charts: Trend Analysis */}
<div className="revenue-charts-grid">

  {/* Monthly Revenue Trends */}
  <div className="revenue-chart-card">
    <h4 className="chart-card-title">
      Monthly Revenue Trends
    </h4>

    <div style={{ width: "100%", height: 220 }}>
      <ResponsiveContainer>
        <AreaChart
          data={charts.trends || []}
          margin={{
            top: 10,
            right: 10,
            left: -20,
            bottom: 0
          }}
        >
          <defs>
            <linearGradient
              id="areaRevGlow"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor="var(--accent-primary, #3b82f6)"
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor="var(--accent-primary, #3b82f6)"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border-color, rgba(255,255,255,0.08))"
          />

          <XAxis
            dataKey="period"
            stroke="var(--text-secondary)"
            fontSize={11}
          />

          <YAxis
            stroke="var(--text-secondary)"
            fontSize={11}
            tickFormatter={(val) => `$${val}`}
          />

          <Tooltip
            contentStyle={{
              background:
                "var(--bg-secondary, #1e293b)",
              borderColor:
                "var(--border-color, rgba(255,255,255,0.08))"
            }}
            formatter={(val) => [
              `$${Number(val).toLocaleString()}`,
              "Revenue"
            ]}
          />

          <Area
            type="monotone"
            dataKey="revenue"
            stroke="var(--accent-primary, #3b82f6)"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#areaRevGlow)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>

  {/* Revenue Forecast */}
  <div className="revenue-chart-card">
    <h4 className="chart-card-title">
      🔮 Revenue Forecast
    </h4>

    <div style={{ width: "100%", height: 220 }}>
      <ResponsiveContainer>
        <AreaChart
          data={charts.forecast || []}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip
            formatter={(val) => [
              `$${Number(val).toLocaleString()}`,
              "Forecast"
            ]}
          />

          <Area
            type="monotone"
            dataKey="predicted"
            stroke="#60a5fa"
            fill="#60a5fa20"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>

</div>

{/* Platform Revenue Ranking */}
<div className="table-card">
  <h4
    className="chart-card-title"
    style={{ marginBottom: "1rem" }}
  >
    🏆 Platform Revenue Ranking
  </h4>

  <table className="custom-table">
    <thead>
      <tr>
        <th>Rank</th>
        <th>Platform</th>
        <th>Revenue</th>
        <th>Growth</th>
      </tr>
    </thead>

    <tbody>
      {[...(charts.platform || [])]
        .sort(
          (a, b) =>
            (b.earnings || 0) -
            (a.earnings || 0)
        )
        .map((item, index) => (
          <tr key={index}>
            <td>#{index + 1}</td>

            <td>{item.platform}</td>

            <td
              style={{
                color: "#34d399",
                fontWeight: "700"
              }}
            >
              $
              {(item.earnings || 0).toLocaleString()}
            </td>

            <td
              style={{
                color:
                  (item.growth || 0) >= 0
                    ? "#10b981"
                    : "#ef4444",
                fontWeight: "600"
              }}
            >
              {(item.growth || 0)}%
            </td>
          </tr>
        ))}
    </tbody>
  </table>
</div>

{/* Revenue Source Breakdown */}
<div className="revenue-chart-card">
  <h4 className="chart-card-title">
    Revenue Source Breakdown
  </h4>

  <div
    style={{
      display: "flex",
      alignItems: "center",
      height: 220
    }}
  >
    <div
      style={{
        flex: 1,
        height: "100%"
      }}
    >
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <PieChart>
          <Pie
            data={charts.source || []}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={70}
            paddingAngle={3}
            dataKey="value"
          >
            {(charts.source || []).map(
              (entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    PIE_COLORS[
                      index %
                        PIE_COLORS.length
                    ]
                  }
                />
              )
            )}
          </Pie>

          <Tooltip
            formatter={(value) => [
              `$${Number(
                value
              ).toLocaleString()}`,
              "Revenue"
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>

    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        minWidth: "150px"
      }}
    >
      {(charts.source || []).map(
        (entry, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              fontSize: "0.8rem",
              color:
                "var(--text-secondary)"
            }}
          >
            <div>
              <span
                style={{
                  display:
                    "inline-block",
                  width: "8px",
                  height: "8px",
                  borderRadius:
                    "50%",
                  backgroundColor:
                    PIE_COLORS[
                      index %
                        PIE_COLORS.length
                    ],
                  marginRight: "6px"
                }}
              />

              {entry.name}
            </div>

            <span
              style={{
                color:
                  "var(--text-primary)",
                fontWeight: "700"
              }}
            >
              $
              {(
                entry.value || 0
              ).toLocaleString()}
            </span>
          </div>
        )
      )}
    </div>
  </div>
</div>

{/* Brand Campaign Logs */}
<div className="table-card">
  <h4
    className="chart-card-title"
    style={{ marginBottom: "1.25rem" }}
  >
    📢 Brand Campaign Logs
  </h4>

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
      {(brands || []).map((b, index) => (
        <tr key={index}>
          <td
            style={{
              fontWeight: "700"
            }}
          >
            {b.brand}
          </td>

          <td>{b.campaign}</td>

          <td
            style={{
              color: "#34d399",
              fontWeight: "700"
            }}
          >
            $
            {(b.revenue || 0).toLocaleString()}
          </td>

          <td
            style={{
              color:
                "var(--text-secondary)"
            }}
          >
            {b.date}
          </td>

          <td
            style={{
              color:
                "var(--text-secondary)"
            }}
          >
            {b.platform}
          </td>

          <td>
            <span
              className={`status-pill ${(
                b.status || ""
              ).toLowerCase()}`}
            >
              {b.status}
            </span>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


{/* Revenue Source Comparison */}
<div className="revenue-chart-card">
  <h4 className="chart-card-title">
    📊 Revenue Source Comparison
  </h4>

  <div
    style={{
      width: "100%",
      height: 300
    }}
  >
    <ResponsiveContainer>
      <BarChart
        data={charts.source || []}
      >
        <CartesianGrid
          strokeDasharray="3 3"
        />

        <XAxis dataKey="name" />

        <YAxis />

        <Tooltip
          formatter={(value) => [
            `$${Number(
              value
            ).toLocaleString()}`,
            "Revenue"
          ]}
        />

        <Bar
          dataKey="value"
          fill="#10b981"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>
{/* Sponsorship Program Schedules */}
<div
  className="table-card"
  style={{ width: "100%" }}
>
  <h4
    className="chart-card-title"
    style={{ marginBottom: "1.25rem" }}
  >
    🤝 Sponsorship Program Schedules
  </h4>

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
      {(sponsorships || []).map((s, index) => (
        <tr key={index}>
          <td style={{ fontWeight: "700" }}>
            {s.sponsor}
          </td>

          <td>{s.campaign}</td>

          <td
            style={{
              color: "#60a5fa",
              fontWeight: "700"
            }}
          >
            $
            {(s.amount || 0).toLocaleString()}
          </td>

          <td
            style={{
              color: "var(--text-secondary)"
            }}
          >
            {s.startDate}
          </td>

          <td
            style={{
              color: "var(--text-secondary)"
            }}
          >
            {s.endDate}
          </td>

          <td
            style={{
              color: "var(--text-secondary)"
            }}
          >
            {s.platform}
          </td>

          <td>
            <span
              className={`status-pill ${(
                s.status || ""
              ).toLowerCase()}`}
            >
              {s.status}
            </span>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
  </div>   
);
}