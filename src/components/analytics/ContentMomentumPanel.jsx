import React from 'react';
import { Rocket, Flame, TrendingUp, AlertTriangle } from 'lucide-react';

export default function ContentMomentumPanel({ momentumSignals }) {
  const getIcon = (momentum) => {
    if (momentum.includes('Exploding')) return <Flame size={16} color="#fbbf24" />;
    if (momentum.includes('Growing')) return <TrendingUp size={16} color="#10b981" />;
    return <AlertTriangle size={16} color="#ef4444" />;
  };

  const getColor = (momentum) => {
    if (momentum.includes('Exploding')) return '#fbbf24';
    if (momentum.includes('Growing')) return '#10b981';
    return '#ef4444';
  };

  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.6)',
      border: '1px solid var(--border-primary)',
      borderRadius: '16px',
      padding: '24px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <Rocket size={18} color="#e1306c" />
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>Content Momentum</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
        {momentumSignals && momentumSignals.length > 0 ? (
          momentumSignals.map((signal, idx) => (
            <div key={idx} style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                {getIcon(signal.momentum)}
                <span style={{ 
                  color: getColor(signal.momentum), 
                  fontSize: '14px', 
                  fontWeight: 700 
                }}>
                  {signal.momentum}
                </span>
              </div>
              <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {signal.title}
              </p>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {signal.score > 100 ? `+${signal.score - 100}% above average` : `${100 - signal.score}% below average`}
              </div>
            </div>
          ))
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)' }}>
            No recent content data
          </div>
        )}
      </div>
    </div>
  );
}
