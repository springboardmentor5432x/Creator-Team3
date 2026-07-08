import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { monthlyFollowers as defaultData } from '../../data/dummyAnalytics';

// Helper function to format count (e.g., 1200000 -> 1.2M)
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2).replace(/\.00$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K';
  }
  return num;
};

// Custom Tooltip component for premium dashboard style
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{label}</p>
        <div className="tooltip-item" style={{ color: '#3b82f6' }}>
          <span className="tooltip-item-name">Total Followers:</span>
          <span className="tooltip-item-value">{payload[0].value.toLocaleString()}</span>
        </div>
        {payload[0].payload.netGain !== undefined && (
          <div className="tooltip-item" style={{ color: '#10b981' }}>
            <span className="tooltip-item-name">Net Gained:</span>
            <span className="tooltip-item-value">+{payload[0].payload.netGain.toLocaleString()}</span>
          </div>
        )}
        <style>{`
          .custom-tooltip {
            background: rgba(15, 23, 42, 0.9);
            border: 1px solid rgba(255, 255, 255, 0.15);
            padding: 12px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
            font-family: 'Inter', sans-serif;
            backdrop-filter: blur(8px);
          }
          .tooltip-label {
            margin: 0 0 6px 0;
            font-size: 12px;
            font-weight: 600;
            color: #94a3b8;
          }
          .tooltip-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 16px;
            font-size: 13px;
            font-weight: 600;
            margin: 4px 0;
          }
          .tooltip-item-name {
            color: #cbd5e1;
          }
          .tooltip-item-value {
            font-weight: 700;
          }
        `}</style>
      </div>
    );
  }
  return null;
};

export default function FollowersChart({ data = defaultData }) {
  return (
    <div className="chart-card">
      <style>{`
        .chart-card {
          background: rgba(30, 41, 59, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 1.5rem;
          width: 100%;
          box-sizing: border-box;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }
        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .chart-title-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .chart-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #f8fafc;
          margin: 0;
        }
        .chart-subtitle {
          font-size: 0.8125rem;
          color: #94a3b8;
          margin: 0;
        }
        .chart-container {
          width: 100%;
          height: 300px;
        }
      `}</style>

      <div className="chart-header">
        <div className="chart-title-wrapper">
          <h3 className="chart-title">Follower Growth</h3>
          <p className="chart-subtitle">Cumulative monthly growth trajectory</p>
        </div>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="followerColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
            <XAxis 
              dataKey="month" 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={formatNumber}
              domain={['dataMin - 50000', 'auto']}
              dx={-5}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              name="Followers"
              dataKey="count"
              stroke="#3b82f6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#followerColor)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
