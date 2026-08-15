import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { BarChart3 } from 'lucide-react';

const COLORS = {
  likes: '#ef4444',
  comments: '#3b82f6',
  saves: '#f59e0b',
  shares: '#10b981'
};

const LABELS = {
  likes: '❤️ Likes',
  comments: '💬 Comments',
  saves: '🔖 Saves',
  shares: '🔄 Shares'
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--bg-secondary, #1e1b2e)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '10px',
        padding: '10px 14px',
        fontSize: '13px'
      }}>
        <span style={{ color: payload[0].payload.color, fontWeight: 700 }}>
          {payload[0].name}: {payload[0].value}%
        </span>
      </div>
    );
  }
  return null;
};

const EngagementBreakdownChart = ({ engagementBreakdown }) => {
  if (!engagementBreakdown || Object.keys(engagementBreakdown).length === 0) {
    return (
      <div className="theme-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '280px', color: 'var(--text-secondary)' }}>
        Engagement breakdown data unavailable
      </div>
    );
  }

  const data = Object.entries(engagementBreakdown).map(([key, value]) => ({
    name: LABELS[key] || key,
    value: value,
    color: COLORS[key] || '#8b5cf6',
    key: key
  }));

  return (
    <div className="theme-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <BarChart3 size={18} color="#8b5cf6" />
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: '"Outfit", sans-serif' }}>
          Engagement Breakdown
        </h3>
      </div>

      {/* Donut Chart */}
      <div style={{ position: 'relative', width: '100%', height: '200px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  style={{ cursor: 'pointer', transition: 'opacity 0.3s ease' }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', pointerEvents: 'none'
        }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Engagement
          </span>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Split
          </span>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {data.map(item => (
          <div key={item.key} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '8px 12px', borderRadius: '10px',
            background: `${item.color}08`,
            border: `1px solid ${item.color}20`,
            transition: 'all 0.3s ease',
            cursor: 'default'
          }}
            onMouseEnter={e => { e.currentTarget.style.background = `${item.color}15`; e.currentTarget.style.transform = 'scale(1.02)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = `${item.color}08`; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color, flexShrink: 0 }} />
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', flex: 1 }}>{item.name}</span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: item.color }}>{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EngagementBreakdownChart;
