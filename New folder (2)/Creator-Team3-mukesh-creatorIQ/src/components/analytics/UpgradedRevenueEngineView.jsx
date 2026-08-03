import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Download, Sliders, Info, ShieldCheck, HelpCircle, ArrowUpRight, BarChart2, PieChart as PieIcon, RefreshCw, Zap } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import RevenueSettingsModal from './RevenueSettingsModal';

const UpgradedRevenueEngineView = ({ token }) => {
  const { chartColors } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [exporting, setExporting] = useState(false);

  const fetchEstimation = () => {
    setLoading(true);
    fetch('http://127.0.0.1:8000/api/revenue/estimate', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(resData => {
        setData(resData);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (token) fetchEstimation();
  }, [token]);

  const handleExport = (format = 'csv') => {
    setExporting(true);
    fetch(`http://127.0.0.1:8000/api/revenue/export?format=${format}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => format === 'json' ? res.json() : res.blob())
      .then(result => {
        if (format === 'json') {
          const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
          const dlAnchor = document.createElement('a');
          dlAnchor.setAttribute("href", dataStr);
          dlAnchor.setAttribute("download", "creatoriq_revenue_estimation.json");
          document.body.appendChild(dlAnchor);
          dlAnchor.click();
          dlAnchor.remove();
        } else {
          const url = window.URL.createObjectURL(result);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'creatoriq_revenue_estimation_report.csv';
          document.body.appendChild(a);
          a.click();
          a.remove();
        }
      })
      .catch(err => console.error(err))
      .finally(() => setExporting(false));
  };

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <RefreshCw className="animate-spin" size={32} style={{ margin: '0 auto 16px' }} />
        <h3 style={{ color: 'var(--text-primary)', margin: '0 0 8px' }}>Calculating Revenue Estimation Engine...</h3>
        <p style={{ margin: 0, fontSize: '14px' }}>Parsing connected analytics metrics & regional CPM parameters</p>
      </div>
    );
  }

  if (!data || !data.summary) return null;

  const PIE_COLORS = [chartColors.c1, chartColors.c2, chartColors.c3, chartColors.c4, chartColors.c5];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>Estimated YouTube Revenue Engine</h1>
            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: '20px',
              background: 'rgba(255, 0, 0, 0.15)',
              color: '#ff0000',
              border: '1px solid rgba(255, 0, 0, 0.3)',
              letterSpacing: '0.5px'
            }}>
              🔴 YOUTUBE EXCLUSIVE
            </span>
          </div>
          <p style={{ margin: '4px 0 0', fontSize: '14px', color: 'var(--text-muted)' }}>
            Transparent financial estimates calculated from connected analytics and customizable CPM settings
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setShowSettings(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 16px',
              borderRadius: '10px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-primary)',
              color: 'var(--text-primary)',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            <Sliders size={16} color="var(--accent-primary)" />
            Configure Formulas & CPM
          </button>

          <button
            onClick={() => handleExport('csv')}
            disabled={exporting}
            className="theme-button-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 18px', fontSize: '13px' }}
          >
            <Download size={16} />
            {exporting ? 'Exporting...' : 'Export Report'}
          </button>
        </div>
      </div>

      {/* Transparent Disclaimer Alert */}
      <div className="theme-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', background: 'var(--badge-bg)', borderColor: 'var(--border-hover)' }}>
        <Info size={20} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
          <strong style={{ color: 'var(--text-primary)' }}>Notice on Data Transparency:</strong> Official platform APIs (YouTube, Instagram) do not expose private creator earnings. All monetary figures below are estimated using connected metrics (Views, Engagement, Followers, Region, CPM).
        </div>
      </div>

      {/* Top Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
        {/* Card 1: Estimated Monthly Revenue */}
        <div className="theme-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Est. Monthly Revenue</span>
            <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '12px', background: 'rgba(59,130,246,0.15)', color: 'var(--accent-primary)' }}>
              ESTIMATED
            </span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
            ${data.summary.estimatedMonthlyRevenue.toLocaleString()}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#10b981' }}>
            <ArrowUpRight size={16} />
            <span>+{data.summary.moMRevenueGrowth}% vs last month</span>
          </div>
        </div>

        {/* Card 2: Estimated Annual Revenue */}
        <div className="theme-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Est. Annual Revenue</span>
            <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '12px', background: 'rgba(59,130,246,0.15)', color: 'var(--accent-primary)' }}>
              ESTIMATED
            </span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
            ${data.summary.estimatedAnnualRevenue.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Based on 12-month run-rate
          </div>
        </div>

        {/* Card 3: Top Revenue Source */}
        <div className="theme-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Highest Revenue Source</span>
            <BarChart2 size={18} color="var(--chart-2)" />
          </div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
            {data.summary.highestRevenueSource}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            ${data.summary.highestSourceAmount.toLocaleString()}/mo
          </div>
        </div>

        {/* Card 4: Confidence Score */}
        <div className="theme-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Calculation Confidence</span>
            <ShieldCheck size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
            {data.summary.confidenceScore}%
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            High statistical metric coverage
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Monthly Trend Area Chart */}
        <div className="theme-card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>Estimated Revenue Trajectory</h3>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>12-month calculated revenue trend</p>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <HelpCircle size={14} /> Formula: (Monthly Views / 1000) * CPM + Sponsorships
            </span>
          </div>

          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.monthlyTrend}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColors.c1} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={chartColors.c1} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke={chartColors.textSecondary} tickLine={false} style={{ fontSize: '12px' }} />
                <YAxis stroke={chartColors.textSecondary} tickLine={false} style={{ fontSize: '12px' }} tickFormatter={val => `$${val / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: chartColors.bgCard, borderColor: chartColors.borderColor, color: chartColors.textPrimary, borderRadius: '8px' }}
                  formatter={val => [`$${val.toLocaleString()} (Est.)`, 'Revenue']}
                />
                <Area type="monotone" dataKey="estimatedRevenue" stroke={chartColors.c1} strokeWidth={3} fillOpacity={1} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Source Breakdown Donut Chart */}
        <div className="theme-card" style={{ padding: '22px' }}>
          <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>Revenue Sources Breakdown</h3>
          <p style={{ margin: '0 0 16px', fontSize: '12px', color: 'var(--text-muted)' }}>Share by monetization model</p>

          <div style={{ width: '100%', height: '190px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.sources} dataKey="amount" nameKey="source" cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4}>
                  {data.sources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: chartColors.bgCard, borderColor: chartColors.borderColor, color: chartColors.textPrimary, borderRadius: '8px' }}
                  formatter={val => [`$${val.toLocaleString()}`, 'Estimated']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
            {data.sources.map((s, idx) => (
              <div key={s.source} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: PIE_COLORS[idx % PIE_COLORS.length] }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{s.source}</span>
                </div>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{s.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Contribution & Financial Insights */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Platform Share */}
        <div className="theme-card" style={{ padding: '22px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>Platform Revenue Contribution</h3>
          <div style={{ width: '100%', height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.platformBreakdown} layout="vertical">
                <XAxis type="number" stroke={chartColors.textSecondary} style={{ fontSize: '12px' }} tickFormatter={v => `$${v}`} />
                <YAxis type="category" dataKey="platform" stroke={chartColors.textSecondary} style={{ fontSize: '12px' }} width={90} />
                <Tooltip contentStyle={{ backgroundColor: chartColors.bgCard, borderColor: chartColors.borderColor, color: chartColors.textPrimary, borderRadius: '8px' }} />
                <Bar dataKey="amount" fill={chartColors.c1} radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dynamic Financial Insights */}
        <div className="theme-card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Zap size={18} color="var(--chart-4)" />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>Automated Financial Insights</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data.insights.map((insight, idx) => (
              <div key={idx} style={{
                padding: '12px 14px',
                borderRadius: '10px',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-primary)',
                fontSize: '13px',
                color: 'var(--text-secondary)',
                lineHeight: '1.4'
              }}>
                💡 {insight}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <RevenueSettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        token={token}
        onSettingsSaved={() => fetchEstimation()}
      />
    </div>
  );
};

export default UpgradedRevenueEngineView;
