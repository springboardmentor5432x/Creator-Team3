import React, { useState, useEffect } from 'react';
import { Users, Lock as LockIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function RevenueDemographics({ token }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDemographics = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/youtube/analytics/demographics', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await res.json();
        
        if (!res.ok) {
          throw new Error(result.detail || "Failed to fetch demographics");
        }
        
        if (result.unavailable || result.connected === false) {
          setData(null);
        } else {
          setData(result.data?.age || []);
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (token) {
      fetchDemographics();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="theme-card" style={{ padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '280px' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading demographics...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="theme-card" style={{ padding: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '24px', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LockIcon size={24} color="#ef4444" />
        </div>
        <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>Demographics Locked</h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: 0 }}>
          Audience demographics data requires a direct OAuth connection via YouTube Analytics API. Please connect your YouTube account in Settings.
        </p>
      </div>
    );
  }

  return (
    <div className="theme-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={20} color="#3b82f6" /> Monetizable Audience Demographics (YouTube)
        </h3>
      </div>
      
      <div style={{ width: '100%', height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="group" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
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
