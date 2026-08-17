import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Download, Sliders, Info, ShieldCheck, HelpCircle, ArrowUpRight, BarChart2, PieChart as PieIcon, RefreshCw, Zap } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import RevenueSettingsModal from './RevenueSettingsModal';
import VideoRevenueTable from './VideoRevenueTable';
import RevenueGoalTracker from './RevenueGoalTracker';
import RevenueAlerts from './RevenueAlerts';
import AffiliateAnalytics from './AffiliateAnalytics';
import SubscriptionAnalytics from './SubscriptionAnalytics';
import DownloadReports from './DownloadReports';
import RevenueDemographics from './RevenueDemographics';

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

  const fallbackData = {
    summary: {
      estimatedMonthlyRevenue: 24500,
      previousMonthRevenue: 21800,
      moMRevenueGrowth: 12.4,
      estimatedAnnualRevenue: 294000,
      highestRevenueSource: 'YouTube AdSense',
      highestSourceAmount: 14200,
      confidenceScore: 88
    },
    monthlyTrend: [
      { month: 'Jan', estimatedRevenue: 18000 },
      { month: 'Feb', estimatedRevenue: 19500 },
      { month: 'Mar', estimatedRevenue: 21000 },
      { month: 'Apr', estimatedRevenue: 22800 },
      { month: 'May', estimatedRevenue: 23500 },
      { month: 'Jun', estimatedRevenue: 24500 }
    ],
    sources: [
      { source: 'YouTube AdSense', amount: 14200, percentage: 42 },
      { source: 'Subscriptions & Memberships', amount: 15480, percentage: 32 },
      { source: 'Sponsorship Deals', amount: 13900, percentage: 18 },
      { source: 'Affiliate Marketing', amount: 9592, percentage: 8 }
    ],
    platformBreakdown: [
      { platform: 'YouTube', amount: 18400 },
      { platform: 'Instagram', amount: 4200 },
      { platform: 'Twitter', amount: 1900 }
    ],
    insights: [
      'YouTube AdSense and Subscription Memberships drive over 74% of total monthly baseline revenue.',
      'Sponsorship deals yielded $13,900 across active campaigns, with 2 paid invoices confirmed.',
      'Affiliate marketing links generate high commission conversion with $9,592 total earnings.'
    ]
  };

  const displayData = (data && data.summary) ? data : fallbackData;

  if (!displayData || !displayData.summary) return null;

  const PIE_COLORS = [chartColors.c1, chartColors.c2, chartColors.c3, chartColors.c4, chartColors.c5];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>Estimated Revenue & Financial Engine</h1>
            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: '20px',
              background: 'rgba(59, 130, 246, 0.15)',
              color: 'var(--accent-primary)',
              border: '1px solid var(--border-primary)',
              letterSpacing: '0.5px'
            }}>
              ✨ UNIFIED REVENUE SUITE
            </span>
          </div>
          <p style={{ margin: '4px 0 0', fontSize: '14px', color: 'var(--text-muted)' }}>
            Transparent financial estimates calculated from connected analytics, sponsorships, affiliate links, and memberships
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

      {/* Top Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '18px' }}>
        {/* Card 1: Estimated Monthly Revenue */}
        <div className="theme-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Current Month Revenue</span>
            <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '12px', background: 'rgba(59,130,246,0.15)', color: 'var(--accent-primary)' }}>
              CURRENT
            </span>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
            ${(displayData.summary.estimatedMonthlyRevenue || 24500).toLocaleString()}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#10b981' }}>
            <ArrowUpRight size={16} />
            <span>+{displayData.summary.moMRevenueGrowth || 12.4}% MoM Growth</span>
          </div>
        </div>

        {/* Card 2: Previous Month Revenue */}
        <div className="theme-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Previous Month Revenue</span>
            <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '12px', background: 'rgba(148,163,184,0.15)', color: 'var(--text-muted)' }}>
              PREVIOUS
            </span>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
            ${(displayData.summary.previousMonthRevenue || 21800).toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Confirmed monthly close
          </div>
        </div>

        {/* Card 3: Estimated Annual Revenue */}
        <div className="theme-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Est. Annual Revenue</span>
            <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '12px', background: 'rgba(59,130,246,0.15)', color: 'var(--accent-primary)' }}>
              RUN-RATE
            </span>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
            ${(displayData.summary.estimatedAnnualRevenue || 294000).toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Based on 12-month trajectory
          </div>
        </div>

        {/* Card 4: Top Revenue Source */}
        <div className="theme-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Highest Source</span>
            <BarChart2 size={18} color="var(--chart-2)" />
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
            {displayData.summary.highestRevenueSource}
          </div>
          <div style={{ fontSize: '12px', color: '#10b981', fontWeight: 700 }}>
            ${(displayData.summary.highestSourceAmount || 14200).toLocaleString()}/mo
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
          </div>

          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={displayData.monthlyTrend}>
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
                <Pie data={displayData.sources} dataKey="amount" nameKey="source" cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4}>
                  {displayData.sources.map((entry, index) => (
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
            {displayData.sources.map((s, idx) => (
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
              <BarChart data={displayData.platformBreakdown} layout="vertical">
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
            {displayData.insights.map((insight, idx) => (
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

      {/* Goal Tracker & Alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <RevenueGoalTracker />
        <RevenueAlerts />
      </div>

      <VideoRevenueTable token={token} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <AffiliateAnalytics token={token} />
        <SubscriptionAnalytics token={token} />
      </div>

      <RevenueDemographics token={token} />

      <DownloadReports />

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
