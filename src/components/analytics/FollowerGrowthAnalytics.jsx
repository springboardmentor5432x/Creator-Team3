import React, { useState } from 'react';
import { TrendingUp, Users } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function FollowerGrowthAnalytics({ data }) {
  const [timeframe, setTimeframe] = useState('monthly'); // 'daily', 'weekly', 'monthly'

  if (!data || data.length === 0) {
    return null;
  }

  // Calculate totals from the latest data point
  const latestData = data[data.length - 1];
  const totalFollowers = latestData.total;
  
  // Calculate new followers based on timeframe
  const firstData = data[0];
  const newFollowers = totalFollowers - firstData.total;
  const growthPercentage = ((newFollowers / firstData.total) * 100).toFixed(2);

  return (
    <div className="theme-card" style={{ padding: '22px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={20} color="var(--accent-primary)" />
            Follower Growth Analysis
          </h3>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>Track how your audience is growing over time</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['daily', 'weekly', 'monthly'].map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                textTransform: 'capitalize',
                border: timeframe === tf ? '1px solid var(--accent-primary)' : '1px solid var(--border-primary)',
                background: timeframe === tf ? 'var(--badge-bg)' : 'var(--bg-card)',
                color: timeframe === tf ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ padding: '16px', borderRadius: '12px', background: 'var(--bg-input)' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Users size={14} /> Total Followers
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '8px' }}>
            {totalFollowers.toLocaleString()}
          </div>
        </div>
        <div style={{ padding: '16px', borderRadius: '12px', background: 'var(--bg-input)' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>New Followers ({timeframe})</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#10b981', marginTop: '8px' }}>
            +{latestData[timeframe].toLocaleString()}
          </div>
        </div>
        <div style={{ padding: '16px', borderRadius: '12px', background: 'var(--bg-input)' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Growth Percentage</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#10b981', marginTop: '8px' }}>
            +{growthPercentage}%
          </div>
        </div>
      </div>

      <div style={{ height: '300px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" vertical={false} />
            <XAxis dataKey="date" stroke="var(--text-secondary)" tick={{fontSize: 12}} />
            <YAxis stroke="var(--text-secondary)" tick={{fontSize: 12}} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)', borderRadius: '8px', color: 'var(--text-primary)' }}
              itemStyle={{ color: 'var(--accent-primary)', fontWeight: 600 }}
            />
            <Area type="monotone" dataKey={timeframe} name="Growth" stroke="var(--accent-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorGrowth)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
