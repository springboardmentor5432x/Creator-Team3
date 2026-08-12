import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function MetricCard({ title, value, change, changeStatus, icon, sparkData }) {
  const points = sparkData || [
    { v: 30 }, { v: 45 }, { v: 35 }, { v: 60 }, { v: 50 }, { v: 75 }, { v: 90 }
  ];

  const isPositive = changeStatus !== 'negative';
  const gradientId = `spark-${(title || '').replace(/\s+/g, '-')}`;

  return (
    <div className="mc-card">
      <style>{`
        .mc-card {
          background: var(--bg-card);
          backdrop-filter: var(--backdrop-blur-sm);
          -webkit-backdrop-filter: var(--backdrop-blur-sm);
          border: 1px solid var(--border-primary);
          border-radius: var(--card-radius);
          padding: var(--space-5);
          box-shadow: var(--shadow-card);
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          transition: all var(--duration-normal) var(--ease-default);
          position: relative;
          overflow: hidden;
        }

        .mc-card::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, 
            transparent 0%, 
            var(--border-secondary) 30%, 
            var(--border-secondary) 70%, 
            transparent 100%
          );
          opacity: 0.5;
        }

        .mc-card:hover {
          border-color: var(--border-hover);
          box-shadow: var(--shadow-md);
          transform: translateY(-1px);
        }

        .mc-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .mc-label {
          font-size: var(--text-xs);
          font-weight: var(--weight-medium);
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: var(--tracking-wider);
        }

        .mc-value-row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: var(--space-3);
        }

        .mc-value {
          font-size: var(--text-2xl);
          font-weight: var(--weight-bold);
          color: var(--text-primary);
          letter-spacing: var(--tracking-tighter);
          font-variant-numeric: tabular-nums;
          line-height: 1;
        }

        .mc-change {
          font-size: var(--text-xs);
          font-weight: var(--weight-semibold);
          display: inline-flex;
          align-items: center;
          gap: var(--space-1);
          padding: var(--space-0_5) var(--space-2);
          border-radius: var(--radius-full);
          white-space: nowrap;
        }

        .mc-change.positive {
          background: var(--success-subtle);
          color: var(--success);
        }

        .mc-change.negative {
          background: var(--error-subtle);
          color: var(--error);
        }

        .mc-spark {
          height: 32px;
          width: 100%;
          margin-top: var(--space-1);
        }
      `}</style>

      <div className="mc-header">
        <span className="mc-label">{title}</span>
      </div>

      <div className="mc-value-row">
        <span className="mc-value">{value}</span>
        {change !== undefined && change !== null && (
          <span className={`mc-change ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(change)}%
          </span>
        )}
      </div>

      <div className="mc-spark">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={points}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isPositive ? 'var(--success)' : 'var(--error)'} stopOpacity={0.15}/>
                <stop offset="95%" stopColor={isPositive ? 'var(--success)' : 'var(--error)'} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke={isPositive ? 'var(--success)' : 'var(--error)'}
              strokeWidth={1.5}
              fillOpacity={1}
              fill={`url(#${gradientId})`}
              dot={false}
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
