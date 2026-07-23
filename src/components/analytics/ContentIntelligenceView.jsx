import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, Clock, Award, AlertTriangle, RefreshCw, BarChart3, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

const ContentIntelligenceView = ({ token }) => {
  const { chartColors } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      setLoading(true);
      fetch('http://127.0.0.1:8000/api/analytics/content-intelligence', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(resData => setData(resData))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [token]);

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <RefreshCw className="animate-spin" size={32} style={{ margin: '0 auto 16px' }} />
        <h3 style={{ color: 'var(--text-primary)', margin: '0 0 8px' }}>Analyzing Content Intelligence...</h3>
        <p style={{ margin: 0, fontSize: '14px' }}>Evaluating performance benchmarks across content categories</p>
      </div>
    );
  }

  if (!data || !data.summary) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>Content Intelligence</h1>
        <p style={{ margin: '4px 0 0', fontSize: '14px', color: 'var(--text-muted)' }}>
          Categorized performance benchmarking across Educational, AI, Shorts, Reels, Vlogs, Podcasts, and Tutorials
        </p>
      </div>

      {/* Benchmarks Header Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
        <div className="theme-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', marginBottom: '8px' }}>
            <Award size={18} />
            <span style={{ fontSize: '12px', fontWeight: 600 }}>Best Category</span>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>
            {data.summary.bestPerformingCategory}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Highest average view volume
          </div>
        </div>

        <div className="theme-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f43f5e', marginBottom: '8px' }}>
            <AlertTriangle size={18} />
            <span style={{ fontSize: '12px', fontWeight: 600 }}>Needs Optimization</span>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>
            {data.summary.worstPerformingCategory}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Lowest engagement efficiency
          </div>
        </div>

        <div className="theme-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary)', marginBottom: '8px' }}>
            <Clock size={18} />
            <span style={{ fontSize: '12px', fontWeight: 600 }}>Optimal Posting Window</span>
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {data.summary.bestPostingDay}s @ {data.summary.bestPostingTime}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Peak audience activity
          </div>
        </div>

        <div className="theme-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--chart-4)', marginBottom: '8px' }}>
            <CheckCircle2 size={18} />
            <span style={{ fontSize: '12px', fontWeight: 600 }}>Consistency Meter</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>
            {data.summary.overallConsistencyScore}/100
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {data.summary.weeklyUploadFrequency}
          </div>
        </div>
      </div>

      {/* Category Performance Comparison Chart */}
      <div className="theme-card" style={{ padding: '22px' }}>
        <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>Category Average Views Comparison</h3>
        <p style={{ margin: '0 0 16px', fontSize: '12px', color: 'var(--text-muted)' }}>Average views generated per content format</p>
        <div style={{ width: '100%', height: '260px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.categories}>
              <XAxis dataKey="category" stroke={chartColors.textSecondary} style={{ fontSize: '12px' }} />
              <YAxis stroke={chartColors.textSecondary} style={{ fontSize: '12px' }} tickFormatter={v => `${v/1000}k`} />
              <Tooltip contentStyle={{ backgroundColor: chartColors.bgCard, borderColor: chartColors.borderColor, color: chartColors.textPrimary, borderRadius: '8px' }} />
              <Bar dataKey="avgViews" fill={chartColors.c1} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Content Category Detailed Breakdown Table */}
      <div className="theme-card" style={{ padding: '22px' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>Category Metrics Deep-Dive</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-primary)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '10px' }}>Content Category</th>
                <th>Avg Views</th>
                <th>Engagement</th>
                <th>Avg Watch Time</th>
                <th>Est. Revenue</th>
                <th>Consistency Score</th>
                <th>Best Posting Day</th>
              </tr>
            </thead>
            <tbody>
              {data.categories.map((c, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-primary)' }}>
                  <td style={{ padding: '12px 10px', fontWeight: 600, color: 'var(--text-primary)' }}>{c.category}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{c.avgViews.toLocaleString()}</td>
                  <td style={{ color: '#10b981', fontWeight: 600 }}>{c.engagementRate}%</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{Math.floor(c.avgWatchTimeSec / 60)}m {c.avgWatchTimeSec % 60}s</td>
                  <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>${c.avgRevenue.toLocaleString()}</td>
                  <td>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '10px',
                      background: c.consistencyScore > 85 ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                      color: c.consistencyScore > 85 ? '#10b981' : '#f59e0b',
                      fontSize: '11px',
                      fontWeight: 700
                    }}>
                      {c.consistencyScore}/100
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{c.bestDay}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContentIntelligenceView;
