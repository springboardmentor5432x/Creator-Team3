import React from 'react';
import { Heart } from 'lucide-react';

const InstagramHealthScore = ({ healthScore }) => {
  if (!healthScore) {
    return (
      <div className="theme-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '280px', color: 'var(--text-secondary)' }}>
        Health score data unavailable
      </div>
    );
  }

  const { total, engagement, growth, consistency, grade } = healthScore;
  
  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const scoreColor = getScoreColor(total);
  
  // SVG arc calculations
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const progress = (total / 100) * circumference;
  const offset = circumference - progress;

  const subScores = [
    { label: 'Engagement', value: engagement, max: 40, color: '#8b5cf6' },
    { label: 'Growth', value: growth, max: 30, color: '#06b6d4' },
    { label: 'Consistency', value: consistency, max: 30, color: '#f97316' }
  ];

  return (
    <div className="theme-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Heart size={18} color="#e11d48" />
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: '"Outfit", sans-serif' }}>
          Instagram Health Score
        </h3>
      </div>

      {/* Radial Gauge */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <div style={{ position: 'relative', width: '170px', height: '170px' }}>
          <svg width="170" height="170" viewBox="0 0 170 170" style={{ transform: 'rotate(-90deg)' }}>
            {/* Background circle */}
            <circle
              cx="85" cy="85" r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="12"
            />
            {/* Progress arc */}
            <circle
              cx="85" cy="85" r={radius}
              fill="none"
              stroke={scoreColor}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.5s ease' }}
            />
          </svg>
          {/* Center text */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px'
          }}>
            <span style={{
              fontSize: '36px', fontWeight: 900, color: scoreColor,
              fontFamily: '"Outfit", sans-serif',
              animation: 'pulse 2s ease-in-out infinite'
            }}>
              {total}
            </span>
            <span style={{
              fontSize: '14px', fontWeight: 700, color: scoreColor,
              background: `${scoreColor}15`, padding: '2px 10px', borderRadius: '8px'
            }}>
              Grade {grade}
            </span>
          </div>
        </div>
      </div>

      {/* Sub-scores */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {subScores.map(s => (
          <div key={s.label} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>{s.label}</span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: s.color }}>{s.value}/{s.max}</span>
            </div>
            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                width: `${(s.value / s.max) * 100}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${s.color}88, ${s.color})`,
                borderRadius: '4px',
                transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)'
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstagramHealthScore;
