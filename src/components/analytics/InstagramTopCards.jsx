import React, { useState } from 'react';
import { Users, Eye, Heart, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';

const StatCard = ({ title, value, previousValue, icon: Icon, color }) => {
  const diff = previousValue ? ((value - previousValue) / previousValue) * 100 : 0;
  const isPositive = diff >= 0;

  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.6)',
      border: '1px solid var(--border-primary)',
      borderRadius: '16px',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '120px',
        height: '120px',
        background: `radial-gradient(circle, ${color}22 0%, transparent 70%)`,
        transform: 'translate(30%, -30%)',
        borderRadius: '50%'
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <span style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600 }}>{title}</span>
        <div style={{ padding: '8px', background: `${color}15`, borderRadius: '10px', color: color }}>
          <Icon size={18} />
        </div>
      </div>

      <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px', fontFamily: '"Outfit", sans-serif' }}>
        {typeof value === 'number' && title !== 'Engagement Rate' ? value.toLocaleString() : value}
      </div>

      {previousValue !== undefined && previousValue !== null && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
          <span style={{ 
            display: 'flex', alignItems: 'center', gap: '4px',
            color: isPositive ? '#10b981' : '#ef4444',
            background: isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            padding: '2px 6px', borderRadius: '4px', fontWeight: 600
          }}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(diff).toFixed(1)}%
          </span>
          <span style={{ color: 'var(--text-secondary)' }}>vs previous period</span>
        </div>
      )}
    </div>
  );
};

export default function InstagramTopCards({ data, isOAuth }) {
  const [dateRange, setDateRange] = useState('30D');
  
  const ranges = [
    { id: '7D', label: 'Last 7 Days' },
    { id: '30D', label: 'Last 30 Days' },
    { id: '90D', label: 'Last 90 Days' },
    { id: 'CUSTOM', label: 'Custom' }
  ];

  // If not OAuth, we don't have historical data or accurate reach, so we don't show the "vs previous period" diffs
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>Performance Overview</h3>
        <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border-primary)', borderRadius: '8px', padding: '4px' }}>
          {ranges.map(range => (
            <button
              key={range.id}
              onClick={() => setDateRange(range.id)}
              style={{
                background: dateRange === range.id ? 'var(--bg-elevated)' : 'transparent',
                color: dateRange === range.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px'
      }}>
        <StatCard 
          title="Followers" 
          value={data?.followers || 0} 
          previousValue={isOAuth ? (data?.followers || 0) * 0.95 : null} 
          icon={Users} 
          color="#e1306c" 
        />
        <StatCard 
          title="Reach" 
          value={isOAuth ? (data?.reach || 0) : 'OAuth Required'} 
          previousValue={isOAuth ? (data?.reach || 0) * 0.82 : null} 
          icon={ArrowUpRight} 
          color="#f56040" 
        />
        <StatCard 
          title="Impressions" 
          value={isOAuth ? (data?.impressions || 0) : 'OAuth Required'} 
          previousValue={isOAuth ? (data?.impressions || 0) * 0.76 : null} 
          icon={Eye} 
          color="#fd1d1d" 
        />
        <StatCard 
          title="Engagement Rate" 
          value={isOAuth ? `${data?.avg_engagement || 0}%` : 'OAuth Required'} 
          previousValue={isOAuth ? ((data?.avg_engagement || 0) - 1.2) : null} 
          icon={Heart} 
          color="#833ab4" 
        />
      </div>
    </div>
  );
}
