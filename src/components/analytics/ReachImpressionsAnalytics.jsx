import React from 'react';
import { Eye, Monitor } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function ReachImpressionsAnalytics({ data }) {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="theme-card" style={{ padding: '22px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Eye size={20} color="#3b82f6" />
          Reach vs Impressions Analysis
        </h3>
        <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>Understand content visibility and audience exposure</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Average Reach</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#3b82f6', marginTop: '8px' }}>
            {Math.round(data.reduce((sum, item) => sum + item.reach, 0) / data.length).toLocaleString()}
          </div>
        </div>
        <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Average Impressions</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#8b5cf6', marginTop: '8px' }}>
            {Math.round(data.reduce((sum, item) => sum + item.impressions, 0) / data.length).toLocaleString()}
          </div>
        </div>
        <div style={{ padding: '16px', borderRadius: '12px', background: 'var(--bg-input)' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Impressions per Reach</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '8px' }}>
            {(data.reduce((sum, item) => sum + item.impressions, 0) / data.reduce((sum, item) => sum + item.reach, 0)).toFixed(2)}x
          </div>
        </div>
      </div>

      <div style={{ height: '300px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" vertical={false} />
            <XAxis dataKey="date" stroke="var(--text-secondary)" tick={{fontSize: 12}} />
            <YAxis stroke="var(--text-secondary)" tick={{fontSize: 12}} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)', borderRadius: '8px', color: 'var(--text-primary)' }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Line type="monotone" dataKey="reach" name="Reach" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="impressions" name="Impressions" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
