import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Eye, Heart, Users, ArrowUpRight, Lock as LockIcon } from 'lucide-react';

export default function InstagramAccountGraph({ chartData, isOAuth }) {
  const [activeMetric, setActiveMetric] = useState('reach');

  const metrics = [
    { id: 'reach', label: 'Reach', icon: ArrowUpRight, color: '#f56040' },
    { id: 'impressions', label: 'Impressions', icon: Eye, color: '#fd1d1d' },
    { id: 'engagement', label: 'Engagement', icon: Heart, color: '#833ab4' }
  ];

  const activeColor = metrics.find(m => m.id === activeMetric)?.color || '#f56040';

  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.6)',
      border: '1px solid var(--border-primary)',
      borderRadius: '16px',
      padding: '24px',
      position: 'relative',
      height: '100%'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>Account Performance</h3>
        
        {isOAuth && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {metrics.map(metric => (
              <button
                key={metric.id}
                onClick={() => setActiveMetric(metric.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: activeMetric === metric.id ? `${metric.color}22` : 'transparent',
                  color: activeMetric === metric.id ? metric.color : 'var(--text-secondary)',
                  border: `1px solid ${activeMetric === metric.id ? metric.color : 'var(--border-primary)'}`,
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <metric.icon size={14} />
                {metric.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{ height: '280px', position: 'relative' }}>
        {!isOAuth ? (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(4px)',
            borderRadius: '12px',
            zIndex: 10
          }}>
            <LockIcon size={32} color="var(--text-secondary)" style={{ marginBottom: '16px' }} />
            <h4 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>OAuth Required</h4>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '13px', textAlign: 'center', maxWidth: '300px' }}>
              Historical account performance requires connecting a professional Instagram account via Meta.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={activeColor} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={activeColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" fontSize={12} tickMargin={10} axisLine={false} tickLine={false} />
              <YAxis 
                stroke="rgba(255,255,255,0.2)" 
                fontSize={12} 
                tickFormatter={(val) => activeMetric === 'engagement' ? `${val}%` : val >= 1000000 ? `${(val / 1000000).toFixed(1)}M` : val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val} 
                axisLine={false} 
                tickLine={false} 
              />
              <Tooltip 
                contentStyle={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid var(--border-primary)', borderRadius: '8px' }}
                itemStyle={{ color: activeColor }}
              />
              <Area type="monotone" dataKey={activeMetric} stroke={activeColor} strokeWidth={3} fillOpacity={1} fill="url(#colorMetric)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
