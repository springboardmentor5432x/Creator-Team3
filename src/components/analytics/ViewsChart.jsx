import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { monthlyViews as defaultData } from '../../data/dummyAnalytics';

// Helper function to format views count (e.g., 600000 -> 600K)
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
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
        {payload.map((item) => (
          <div key={item.name} className="tooltip-item" style={{ color: item.color }}>
            <span className="tooltip-item-name">{item.name}:</span>
            <span className="tooltip-item-value">{item.value.toLocaleString()}</span>
          </div>
        ))}
        <style>{`
          .custom-tooltip {
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
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

export default function ViewsChart({ data = defaultData }) {
  return (
    <div className="chart-card">
      <style>{`
        .chart-card {
          background: var(--bg-secondary);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid var(--border-color);
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
          color: var(--text-primary);
          margin: 0;
        }
        .chart-subtitle {
          font-size: 0.8125rem;
          color: var(--text-secondary);
          margin: 0;
        }
        .chart-container {
          width: 100%;
          height: 300px;
        }
        .recharts-legend-wrapper {
          padding-top: 10px;
        }
      `}</style>

      <div className="chart-header">
        <div className="chart-title-wrapper">
          <h3 className="chart-title">Views Trend</h3>
          <p className="chart-subtitle">Monthly views & viewer reactions</p>
        </div>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
             data={data}
             margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
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
              dx={-5}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle" 
              iconSize={8}
              wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)' }}
            />
            <Line
              type="monotone"
              name="Views"
              dataKey="views"
              stroke="var(--accent-primary)"
              strokeWidth={3}
              dot={{ stroke: 'var(--accent-primary)', strokeWidth: 1, r: 3, fill: '#1e293b' }}
              activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--accent-primary)' }}
            />
            <Line
              type="monotone"
              name="Likes"
              dataKey="likes"
              stroke="var(--accent-secondary)"
              strokeWidth={2}
              dot={{ stroke: 'var(--accent-secondary)', strokeWidth: 1, r: 2, fill: '#1e293b' }}
              activeDot={{ r: 4, strokeWidth: 0, fill: 'var(--accent-secondary)' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
