import React, { useState } from 'react';
import { Target, TrendingUp, DollarSign, Award, CheckCircle } from 'lucide-react';

export default function RevenueGoalTracker() {
  const [targetGoal, setTargetGoal] = useState(25000);
  const [currentRevenue, setCurrentRevenue] = useState(18450);

  const percentage = Math.min(100, Math.round((currentRevenue / targetGoal) * 100));
  const remaining = Math.max(0, targetGoal - currentRevenue);

  return (
    <div className="theme-card" style={{ padding: '22px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Target size={18} color="var(--accent-primary)" />
          Monthly Revenue Target & Milestone Goal
        </h3>
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', padding: '4px 10px', borderRadius: '12px' }}>
          {percentage}% Achieved
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px' }}>
        <div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Current Month Earnings</span>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
            ${currentRevenue.toLocaleString()}
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Target Milestone</span>
          <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--accent-primary)', marginTop: '2px' }}>
            ${targetGoal.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div style={{
        width: '100%',
        height: '14px',
        borderRadius: '10px',
        background: 'var(--bg-input)',
        border: '1px solid var(--border-primary)',
        overflow: 'hidden',
        position: 'relative',
        marginBottom: '16px'
      }}>
        <div style={{
          height: '100%',
          width: `${percentage}%`,
          background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #10b981 100%)',
          borderRadius: '10px',
          transition: 'width 0.6s ease'
        }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
        <span>Remaining to goal: <strong style={{ color: 'var(--text-primary)' }}>${remaining.toLocaleString()}</strong></span>
        <span>Est. completion date: <strong style={{ color: '#10b981' }}>Aug 24, 2026</strong></span>
      </div>
    </div>
  );
}
