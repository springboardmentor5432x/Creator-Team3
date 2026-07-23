import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Layers, Grid, Users, Eye, Clock, Award, ArrowUpRight, Filter, RefreshCw, Activity } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

const UpgradedGrowthAnalyticsView = ({ token }) => {
  const { chartColors } = useTheme();
  const [timeframe, setTimeframe] = useState('monthly');
  const [activeMetric, setActiveMetric] = useState('followers');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedPlatform, setSelectedPlatform] = useState('overall');

  const fetchGrowthData = (selectedTimeframe, plat = selectedPlatform) => {
    setLoading(true);
    fetch(`http://127.0.0.1:8000/api/analytics/real-growth?platform=${plat}&timeframe=${selectedTimeframe}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(resData => setData(resData))
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

  if (!data || !data.summary) return null;

  const metricOptions = [
    { id: 'followers', label: 'Followers', icon: Users },
    { id: 'views', label: 'Views', icon: Eye },
    { id: 'watchTimeHours', label: 'Watch Time (hrs)', icon: Clock },
    { id: 'engagementRate', label: 'Engagement (%)', icon: Activity }
  ];

  const platformComparison = data.platformComparison || [];
  const growthHeatmap = data.growthHeatmap || [];
  const calendarView = data.calendarView || [];
  const insights = data.insights || [];

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

      {/* Main Growth Chart */}
      <div className="theme-card" style={{ padding: '22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>Growth Progression</h3>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>Historical daily API snapshot curve</p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {metricOptions.map(m => (
              <button
                key={m.id}
                onClick={() => setActiveMetric(m.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-primary)',
                  background: activeMetric === m.id ? 'var(--badge-bg)' : 'transparent',
                  color: activeMetric === m.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ width: '100%', height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.chartData || []}>
              <defs>
                <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColors.c1} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={chartColors.c1} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke={chartColors.textSecondary} style={{ fontSize: '12px' }} />
              <YAxis stroke={chartColors.textSecondary} style={{ fontSize: '12px' }} />
              <Tooltip contentStyle={{ backgroundColor: chartColors.bgCard, borderColor: chartColors.borderColor, color: chartColors.textPrimary, borderRadius: '8px' }} />
              <Area type="monotone" dataKey={activeMetric} stroke={chartColors.c1} strokeWidth={3} fillOpacity={1} fill="url(#growthGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid Section: Heatmap & Calendar View */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Growth Heatmap (7 Days x 24 Hours) */}
        <div className="theme-card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Grid size={18} color="var(--accent-primary)" />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>Best Posting Times Heatmap</h3>
          </div>
          <p style={{ margin: '-10px 0 16px', fontSize: '12px', color: 'var(--text-muted)' }}>Engagement intensity matrix by day & hour</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '4px', fontSize: '11px', textAlign: 'center' }}>
            <div style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Day</div>
            {['00h', '03h', '06h', '09h', '12h', '15h', '18h'].map(h => <div key={h} style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{h}</div>)}

            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
              <React.Fragment key={d}>
                <div style={{ color: 'var(--text-secondary)', fontWeight: 600, padding: '4px 0' }}>{d}</div>
                {growthHeatmap.filter(h => h.day === d).map((cell, idx) => (
                  <div
                    key={idx}
                    title={`${cell.day} ${cell.hour}: ${cell.engagement}% Engagement`}
                    style={{
                      height: '24px',
                      borderRadius: '4px',
                      backgroundColor: `rgba(59, 130, 246, ${cell.intensity / 100})`,
                      border: '1px solid var(--border-primary)',
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Daily Calendar Gain Grid */}
        <div className="theme-card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Calendar size={18} color="var(--chart-3)" />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>Daily Gain Calendar (Last 30 Days)</h3>
          </div>
          <p style={{ margin: '-10px 0 16px', fontSize: '12px', color: 'var(--text-muted)' }}>Net follower growth by calendar date</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
            {calendarView.map((item, idx) => (
              <div
                key={idx}
                title={`${item.date}: +${item.followerGain} followers`}
                style={{
                  padding: '8px 4px',
                  borderRadius: '6px',
                  background: item.status === 'high' ? 'rgba(16, 185, 129, 0.25)' : (item.status === 'medium' ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-input)'),
                  border: '1px solid var(--border-primary)',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.dayNumber}</div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: item.status === 'high' ? '#10b981' : 'var(--text-primary)' }}>+{item.followerGain}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Comparison & Insights */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Platform Comparison Table */}
        <div className="theme-card" style={{ padding: '22px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>Platform Performance Comparison</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-primary)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '8px 0' }}>Platform</th>
                <th>Audience</th>
                <th>Growth</th>
                <th>Engagement</th>
              </tr>
            </thead>
            <tbody>
              {platformComparison.map(p => (
                <tr key={p.platform} style={{ borderBottom: '1px solid var(--border-primary)' }}>
                  <td style={{ padding: '12px 0', fontWeight: 600, color: 'var(--text-primary)' }}>{p.platform}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{(p.subscribers || p.followers || 0).toLocaleString()}</td>
                  <td style={{ color: '#10b981', fontWeight: 600 }}>+{p.growthRate}%</td>
                  <td style={{ color: 'var(--text-primary)' }}>{p.engagement}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Growth Insights */}
        <div className="theme-card" style={{ padding: '22px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>Automated Growth Insights</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {insights.map((insight, idx) => (
              <div key={idx} style={{
                padding: '12px 14px',
                borderRadius: '10px',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-primary)',
                fontSize: '13px',
                color: 'var(--text-secondary)'
              }}>
                🚀 {insight}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradedGrowthAnalyticsView;
