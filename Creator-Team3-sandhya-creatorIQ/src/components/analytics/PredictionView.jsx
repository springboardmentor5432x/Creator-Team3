import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function PredictionView({ token }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://127.0.0.1:8000/api/prediction', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const json = await res.json();
          setData(json);
        } else {
          throw new Error('Failed to load predictions from backend');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      fetchPredictions();
    }
  }, [token]);

  if (loading) {
    return <div style={{ color: 'var(--text-secondary)', padding: '2rem', textAlign: 'center' }}>Running statistical forecast model...</div>;
  }

  if (error) {
    return <div style={{ color: '#ef4444', padding: '2rem', textAlign: 'center' }}>⚠️ {error}</div>;
  }

  // Build chart coordinates combining current state + predicted states
  const currentF = data?.current?.followers || 520000;
  const currentV = data?.current?.views || 4200000;

  const followerSeries = [
    { period: 'Current', count: currentF, type: 'actual' },
    ...(data?.predictions || []).map(p => ({
      period: p.period,
      count: p.predicted_followers,
      confidence: p.confidence,
      type: 'predicted'
    }))
  ];

  const viewsSeries = [
    { period: 'Current', count: currentV, type: 'actual' },
    ...(data?.predictions || []).map(p => ({
      period: p.period,
      count: p.predicted_views,
      confidence: p.confidence,
      type: 'predicted'
    }))
  ];

  return (
    <div className="predictions-panel">
      <style>{`
        .predictions-panel {
          font-family: 'Inter', sans-serif;
          color: var(--text-primary, #f8fafc);
          display: flex;
          flex-direction: column;
          gap: 2rem;
          width: 100%;
        }

        .predictions-title-row {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .predictions-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
        }

        .predictions-subtitle {
          font-size: 0.875rem;
          color: var(--text-secondary, #94a3b8);
          margin: 0;
        }

        .predictions-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          width: 100%;
        }

        @media (max-width: 1024px) {
          .predictions-grid {
            grid-template-columns: 1fr;
          }
        }

        .prediction-card {
          background: var(--bg-secondary, #111827);
          border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
          border-radius: 24px;
          padding: 1.75rem;
          backdrop-filter: blur(12px);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .prediction-card h3 {
          font-size: 1.1rem;
          font-weight: 700;
          margin: 0;
        }

        .prediction-card p {
          font-size: 0.8125rem;
          color: var(--text-secondary, #94a3b8);
          margin: 0;
        }

        .confidence-indicator {
          margin-top: 1rem;
          padding: 10px 14px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
          border-radius: 12px;
          font-size: 0.8rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      `}</style>

      <div className="predictions-title-row">
        <h2 className="predictions-title">🤖 Predictive Analytics Center</h2>
        <p className="predictions-subtitle">Statistical trend projections for subscribers and views based on historic growth curves.</p>
      </div>

      <div className="predictions-grid">
        {/* Followers Chart */}
        <div className="prediction-card">
          <div>
            <h3>Subscriber Growth Projections</h3>
            <p>Projected follower counts over the next 3 months.</p>
          </div>
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer>
              <AreaChart data={followerSeries} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="followerPredGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-primary, #3b82f6)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--accent-primary, #3b82f6)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color, rgba(255,255,255,0.08))" />
                <XAxis dataKey="period" stroke="var(--text-secondary)" fontSize={11} />
                <YAxis stroke="var(--text-secondary)" fontSize={11} tickFormatter={(val) => val.toLocaleString()} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'var(--bg-secondary, #1e293b)', 
                    borderColor: 'var(--border-color, rgba(255,255,255,0.08))',
                    borderRadius: '12px',
                    color: '#f8fafc'
                  }}
                  formatter={(value) => [value.toLocaleString(), 'Subscribers']}
                />
                <Area type="monotone" dataKey="count" stroke="var(--accent-primary, #3b82f6)" strokeWidth={3} fillOpacity={1} fill="url(#followerPredGlow)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="confidence-indicator">
            <span style={{ color: 'var(--text-secondary)' }}>Extrapolated Model Confidence:</span>
            <span style={{ fontWeight: '700', color: 'var(--accent-primary)' }}>
              ~{data?.predictions?.[2]?.confidence}%
            </span>
          </div>
        </div>

        {/* Views Chart */}
        <div className="prediction-card">
          <div>
            <h3>View Count Projections</h3>
            <p>Projected views over the next 3 months.</p>
          </div>
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer>
              <AreaChart data={viewsSeries} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="viewsPredGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-secondary, #ec4899)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--accent-secondary, #ec4899)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color, rgba(255,255,255,0.08))" />
                <XAxis dataKey="period" stroke="var(--text-secondary)" fontSize={11} />
                <YAxis stroke="var(--text-secondary)" fontSize={11} tickFormatter={(val) => val.toLocaleString()} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'var(--bg-secondary, #1e293b)', 
                    borderColor: 'var(--border-color, rgba(255,255,255,0.08))',
                    borderRadius: '12px',
                    color: '#f8fafc'
                  }}
                  formatter={(value) => [value.toLocaleString(), 'Views']}
                />
                <Area type="monotone" dataKey="count" stroke="var(--accent-secondary, #ec4899)" strokeWidth={3} fillOpacity={1} fill="url(#viewsPredGlow)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="confidence-indicator">
            <span style={{ color: 'var(--text-secondary)' }}>Extrapolated Model Confidence:</span>
            <span style={{ fontWeight: '700', color: 'var(--accent-secondary)' }}>
              ~{data?.predictions?.[2]?.confidence}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
