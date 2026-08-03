import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Layers, Grid, Users, Eye, Clock, Award, ArrowUpRight, Filter, RefreshCw, Activity } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

const UpgradedGrowthAnalyticsView = ({ token }) => {
  //alert("Growth Component Loaded");
  console.log("Growth Component Loaded");
  console.log("Token:", token);
  const theme = useTheme();

console.log("Theme =", theme);

const chartColors = theme?.chartColors || {
  c1: "#3b82f6",
  textSecondary: "#94a3b8",
  textPrimary: "#ffffff",
  bgCard: "#1e293b",
  borderColor: "#334155"
};
  const [timeframe, setTimeframe] = useState('monthly');
  const [activeMetric, setActiveMetric] = useState('followers');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedPlatform, setSelectedPlatform] = useState('overall');

  const fetchGrowthData = (selectedTimeframe, plat = selectedPlatform) => {
    console.log("Fetching Growth API...");
    setLoading(true);
    fetch(`http://127.0.0.1:8000/api/analytics/real-growth?platform=${plat}&timeframe=${selectedTimeframe}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
    console.log("Status:", res.status);
    return res.json();
})
      .then(resData => {
        console.log(
          JSON.stringify(resData.chartData.slice(0, 5), null, 2)
        );

        setData(resData);
})
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (token) fetchGrowthData(timeframe, selectedPlatform);
  }, [token, timeframe, selectedPlatform]);

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <RefreshCw className="animate-spin" size={32} style={{ margin: '0 auto 16px' }} />
        <h3 style={{ color: 'var(--text-primary)', margin: '0 0 8px' }}>Aggregating Daily Analytics Snapshots...</h3>
        <p style={{ margin: 0, fontSize: '14px' }}>Calculating period-over-period growth trajectories</p>
      </div>
    );
  }

  console.log("Chart Data:", data);

if (!data || !data.summary) {
    return <div>No data</div>;
}

  const metricOptions = [
    { id: 'followers', label: 'Followers', icon: Users },
    { id: 'views', label: 'Views', icon: Eye },
    { id: 'watchTimeHours', label: 'Watch Time (hrs)', icon: Clock },
    { id: 'engagementRate', label: 'Engagement (%)', icon: Activity }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>Real Growth Analytics</h1>
          <p style={{ margin: '4px 0 0', fontSize: '14px', color: 'var(--text-muted)' }}>
            Historical account snapshots aggregated across daily, weekly, monthly, and yearly intervals
          </p>
        </div>

        {/* Timeframe Selector */}
        <div style={{ display: 'flex', background: 'var(--bg-card)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-primary)' }}>
          {['daily', 'weekly', 'monthly', 'quarterly', 'yearly'].map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: 'none',
                background: timeframe === tf ? 'var(--accent-primary)' : 'transparent',
                color: timeframe === tf ? '#ffffff' : 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 0.2s ease'
              }}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Platform Switcher Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          { id: 'overall', label: 'Overall', icon: '🌐' },
          { id: 'instagram', label: 'Instagram', icon: '📸' },
          { id: 'youtube', label: 'YouTube', icon: '🔴' },
          { id: 'twitter', label: 'Twitter / X', icon: '🐦' },
          { id: 'linkedin', label: 'LinkedIn', icon: '💼' },
          { id: 'twitch', label: 'Twitch', icon: '👾' }
        ].map(p => (
          <button
            key={p.id}
            onClick={() => setSelectedPlatform(p.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '10px',
              border: selectedPlatform === p.id ? '1px solid var(--accent-primary)' : '1px solid var(--border-primary)',
              background: selectedPlatform === p.id ? 'var(--badge-bg)' : 'var(--bg-card)',
              color: selectedPlatform === p.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            <span>{p.icon}</span>
            <span>{p.label}</span>
          </button>
        ))}
      </div>

      {/* Summary KPI Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div className="theme-card" style={{ padding: '18px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Total Audience</span>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
            {data.summary.totalFollowers.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
            <ArrowUpRight size={14} /> +{data.summary.followersGained.toLocaleString()} ({data.summary.growthRatePct}%)
          </div>
        </div>

        <div className="theme-card" style={{ padding: '18px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Total Views</span>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
            {data.summary.totalViews.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Aggregated video impressions
          </div>
        </div>

        <div className="theme-card" style={{ padding: '18px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Avg Engagement</span>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
            {data.summary.avgEngagementRate}%
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Likes, comments & shares
          </div>
        </div>

        <div className="theme-card" style={{ padding: '18px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Watch Time</span>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
            {data.summary.avgWatchTimeHours.toLocaleString()} hrs
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Average per snapshot
          </div>
        </div>
      </div>

<div className="theme-card" style={{ padding: "22px" }}>
  <div style={{ width: "100%", height: "300px" }}>
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data.chartData || []}>
        <XAxis dataKey="date" />
        <YAxis  domain={[
    (dataMin) => dataMin - 100,
    (dataMax) => dataMax + 100
  ]} />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="followers"
          stroke="#3b82f6"
          fill="#3b82f6"
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
</div>   

      
    </div>
  );
};

export default UpgradedGrowthAnalyticsView;
