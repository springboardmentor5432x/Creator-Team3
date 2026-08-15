import React from 'react';
import { Users, Lock as LockIcon } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export function AudienceDemographics({ isOAuth, mockData }) {
  if (!isOAuth) {
    return (
      <div className="theme-card" style={{ padding: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '24px', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LockIcon size={24} color="#ef4444" />
        </div>
        <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>Demographics Locked</h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: 0 }}>
          Audience demographics and geographic data require a direct OAuth connection via YouTube Analytics API.
        </p>
      </div>
    );
  }

  // Mock data for authenticated state
  const ageData = [
    { age: '13-17', percentage: 12 },
    { age: '18-24', percentage: 38 },
    { age: '25-34', percentage: 28 },
    { age: '35-44', percentage: 14 },
    { age: '45-54', percentage: 6 },
    { age: '55+', percentage: 2 }
  ];

  return (
    <div className="theme-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={20} color="#3b82f6" /> Audience Demographics
        </h3>
      </div>
      
      <div style={{ width: '100%', height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ageData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="age" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.02)' }}
              contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
            />
            <Bar dataKey="percentage" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
