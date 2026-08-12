import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

export default function MetricCard({ title, value, change, changeStatus, icon, sparkData }) {
  // Generate safe fallback sparkline points if none provided
  const points = sparkData || [
    { v: 30 }, { v: 45 }, { v: 35 }, { v: 60 }, { v: 50 }, { v: 75 }, { v: 90 }
  ];

  const isPositive = changeStatus !== 'negative';
  const strokeColor = isPositive ? '#10b981' : '#ef4444';
  const fillColor = isPositive ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)';

  return (
    <div className="metric-card">
      <style>{`
        .metric-card {
          background: rgba(30, 41, 59, 0.35);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 24px;
          padding: 1.5rem;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.25);
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }

        .metric-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 100%);
          pointer-events: none;
        }

        .metric-card:hover {
          transform: translateY(-4px);
          border-color: rgba(59, 130, 246, 0.35);
          box-shadow: 0 12px 40px rgba(59, 130, 246, 0.12);
          background: rgba(30, 41, 59, 0.45);
        }

        .card-top-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .card-title {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-secondary, #94a3b8);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .card-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.04);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .card-val-row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
        }

        .card-val {
          font-size: 1.85rem;
          font-weight: 800;
          color: var(--text-primary, #f8fafc);
          letter-spacing: -0.02em;
        }

        .card-badge {
          font-size: 0.78rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: 8px;
        }

        .card-badge.up {
          background: rgba(16, 185, 129, 0.12);
          color: #34d399;
        }

        .card-badge.down {
          background: rgba(239, 68, 68, 0.12);
          color: #f87171;
        }

        .sparkline-box {
          height: 36px;
          width: 100%;
          margin-top: 0.25rem;
        }
      `}</style>

      <div className="card-top-row">
        <span className="card-title">{title}</span>
        <span className="card-icon">{icon || '📊'}</span>
      </div>

      <div className="card-val-row">
        <span className="card-val">{value}</span>
        <span className={`card-badge ${isPositive ? 'up' : 'down'}`}>
          {isPositive ? '▲' : '▼'} {Math.abs(change)}%
        </span>
      </div>

      <div className="sparkline-box">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={points}>
            <defs>
              <linearGradient id={`grad-${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.15}/>
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke={strokeColor}
              strokeWidth={1.5}
              fillOpacity={1}
              fill={`url(#grad-${title})`}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
