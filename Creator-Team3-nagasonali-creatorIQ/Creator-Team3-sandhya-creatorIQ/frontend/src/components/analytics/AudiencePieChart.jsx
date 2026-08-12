import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = {
  'Female': '#ec4899',       // pink-500
  'Male': '#3b82f6',         // blue-500
  'Non-binary / Other': '#10b981', // emerald-500
  'Other': '#10b981'
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip">
        <span className="tooltip-indicator" style={{ backgroundColor: data.color }}></span>
        <span className="tooltip-label">{data.name}:</span>
        <span className="tooltip-value">{data.value}%</span>
        <style>{`
          .custom-tooltip {
            display: flex;
            align-items: center;
            gap: 8px;
            background: rgba(15, 23, 42, 0.9);
            border: 1px solid rgba(255, 255, 255, 0.15);
            padding: 8px 12px;
            border-radius: 6px;
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 13px;
            font-weight: 600;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(8px);
          }
          .tooltip-indicator {
            width: 8px;
            height: 8px;
            border-radius: 50%;
          }
          .tooltip-label {
            color: #94a3b8;
          }
          .tooltip-value {
            color: #f8fafc;
            font-weight: 700;
          }
        `}</style>
      </div>
    );
  }
  return null;
};

const RenderLegend = ({ payload }) => {
  return (
    <div className="legend-grid">
      {payload.map((entry, index) => {
        const value = entry.payload.value;
        const color = COLORS[entry.value] || entry.color;
        const displayLabel = entry.value === 'Non-binary / Other' ? 'Other' : entry.value;

        return (
          <div key={`item-${index}`} className="legend-item">
            <div className="legend-label-wrapper">
              <span className="legend-color-dot" style={{ backgroundColor: color }}></span>
              <span className="legend-text">{displayLabel}</span>
            </div>
            <span className="legend-percentage">{value}%</span>
          </div>
        );
      })}
      <style>{`
        .legend-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding-left: 20px;
          justify-content: center;
          height: 100%;
        }
        .legend-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: #cbd5e1;
        }
        .legend-label-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .legend-color-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        .legend-text {
          color: #94a3b8;
        }
        .legend-percentage {
          font-weight: 700;
          color: #f8fafc;
        }
        @media (max-width: 640px) {
          .legend-grid {
            padding-left: 0;
            flex-direction: row;
            flex-wrap: wrap;
            gap: 16px;
            justify-content: space-around;
            margin-top: 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default function AudiencePieChart({ data = [] }) {
  const chartData = data.map((item) => ({
    ...item,
    color: COLORS[item.name] || '#64748b'
  }));

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
          font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
        }
        .chart-title-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          margin-bottom: 1.5rem;
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
        .pie-flex-layout {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 220px;
        }
        .pie-chart-wrapper {
          width: 55%;
          height: 220px;
        }
        .legend-wrapper {
          width: 45%;
        }
        @media (max-width: 640px) {
          .pie-flex-layout {
            flex-direction: column;
          }
          .pie-chart-wrapper {
            width: 100%;
            height: 200px;
          }
          .legend-wrapper {
            width: 100%;
          }
        }
      `}</style>

      <div className="chart-title-wrapper">
        <h3 className="chart-title">Audience Demographics</h3>
        <p className="chart-subtitle">Gender distribution percentage</p>
      </div>

      <div className="pie-flex-layout">
        <div className="pie-chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} style={{ outline: 'none' }} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="legend-wrapper">
          <RenderLegend payload={chartData.map(d => ({ value: d.name, color: d.color, payload: d }))} />
        </div>
      </div>
    </div>
  );
}
