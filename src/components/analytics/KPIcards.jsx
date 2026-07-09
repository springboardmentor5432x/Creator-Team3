import React from 'react';
import { kpiData as defaultKpiData } from '../../data/dummyAnalytics';

// Helper function to format numbers (e.g., 1254300 -> 1.25M)
const formatNumber = (num) => {
  if (num === undefined || num === null || isNaN(num)) return '0';
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2).replace(/\.00$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toLocaleString();
};

export default function KPICards({ data = defaultKpiData }) {
  // Extract specified metrics
  const metrics = [
    {
      key: 'followers',
      label: data.followers?.label || 'Followers',
      value: data.followers?.value,
      change: data.followers?.change,
      status: data.followers?.status || 'positive',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="kpi-icon">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      color: 'var(--accent-primary)',
      bgLight: 'var(--accent-glow)'
    },
    {
      key: 'views',
      label: data.views?.label || 'Total Views',
      value: data.views?.value,
      change: data.views?.change,
      status: data.views?.status || 'positive',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="kpi-icon">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
      color: 'var(--accent-secondary)',
      bgLight: 'rgba(236, 72, 153, 0.1)'
    },
    {
      key: 'likes',
      label: data.likes?.label || 'Total Likes',
      value: data.likes?.value,
      change: data.likes?.change,
      status: data.likes?.status || 'positive',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="kpi-icon">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
      color: 'var(--accent-primary)',
      bgLight: 'var(--accent-glow)'
    },
    {
      key: 'comments',
      label: data.comments?.label || 'Total Comments',
      value: data.comments?.value,
      change: data.comments?.change,
      status: data.comments?.status || 'positive',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="kpi-icon">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
      color: 'var(--accent-secondary)',
      bgLight: 'rgba(6, 182, 212, 0.1)'
    },
    {
      key: 'engagementRate',
      label: data.engagementRate?.label || 'Engagement Rate',
      value: data.engagementRate?.value,
      change: data.engagementRate?.change,
      status: data.engagementRate?.status || 'positive',
      suffix: '%',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="kpi-icon">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
      color: 'var(--accent-primary)',
      bgLight: 'var(--accent-glow)'
    }
  ];

  return (
    <div className="kpi-grid">
      {/* Scope styles specifically for the KPI Component */}
      <style>{`
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
          width: 100%;
          margin-bottom: 2rem;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }
        .kpi-card {
          background: var(--bg-secondary);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
        }
        .kpi-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255, 255, 255, 0.15);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }
        .kpi-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .kpi-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .kpi-icon-container {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 12px;
          transition: transform 0.3s ease;
        }
        .kpi-card:hover .kpi-icon-container {
          transform: scale(1.1);
        }
        .kpi-icon {
          width: 20px;
          height: 20px;
        }
        .kpi-content {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .kpi-value-container {
          display: flex;
          align-items: baseline;
        }
        .kpi-value {
          font-size: 1.875rem;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.02em;
        }
        .kpi-trend {
          display: inline-flex;
          align-items: center;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.25rem 0.625rem;
          border-radius: 9999px;
          margin-top: 0.25rem;
          width: fit-content;
        }
        .kpi-trend.positive {
          background: rgba(16, 185, 129, 0.12);
          color: #34d399;
        }
        .kpi-trend.negative {
          background: rgba(239, 68, 68, 0.12);
          color: #f87171;
        }
        .kpi-trend svg {
          width: 12px;
          height: 12px;
          margin-right: 4px;
        }
        /* Glass glow effect behind the card */
        .kpi-glow {
          position: absolute;
          top: -20%;
          right: -20%;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          filter: blur(40px);
          opacity: 0.15;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .kpi-card:hover .kpi-glow {
          opacity: 0.25;
        }
      `}</style>

      {metrics.map((metric) => {
        const isPositive = metric.change >= 0;
        const displayValue = metric.key === 'engagementRate' 
          ? `${metric.value}%` 
          : formatNumber(metric.value);

        return (
          <div key={metric.key} className="kpi-card" title={metric.value ? metric.value.toLocaleString() : ''}>
            {/* Ambient background glow */}
            <div className="kpi-glow" style={{ backgroundColor: metric.color }}></div>
            
            <div className="kpi-header">
              <span className="kpi-label">{metric.label}</span>
              <div 
                className="kpi-icon-container" 
                style={{ backgroundColor: metric.bgLight, color: metric.color }}
              >
                {metric.icon}
              </div>
            </div>

            <div className="kpi-content">
              <div className="kpi-value-container">
                <span className="kpi-value">{displayValue}</span>
              </div>

              {metric.change !== undefined && (
                <div className={`kpi-trend ${isPositive ? 'positive' : 'negative'}`}>
                  {isPositive ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="19" x2="12" y2="5"></line>
                      <polyline points="5 12 12 5 19 12"></polyline>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <polyline points="19 12 12 19 5 12"></polyline>
                    </svg>
                  )}
                  {Math.abs(metric.change)}%
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
