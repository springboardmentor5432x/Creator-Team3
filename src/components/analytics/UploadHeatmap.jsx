import React from 'react';
import { Calendar } from 'lucide-react';

export function UploadHeatmap({ recentVideos }) {
  if (!recentVideos || recentVideos.length === 0) return null;

  // Extract upload dates (YYYY-MM-DD)
  const uploadDates = new Set(recentVideos.map(v => v.published_at));

  // Generate last 30 days
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    days.push({
      date: dateStr,
      hasUpload: uploadDates.has(dateStr)
    });
  }

  return (
    <div className="theme-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={20} color="#3b82f6" /> 30-Day Upload Consistency
        </h3>
      </div>
      
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
        {days.map((day, idx) => (
          <div 
            key={idx}
            title={day.date}
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '4px',
              background: day.hasUpload ? '#22c55e' : 'rgba(255,255,255,0.05)',
              border: day.hasUpload ? '1px solid #16a34a' : '1px solid rgba(255,255,255,0.1)'
            }}
          />
        ))}
      </div>
      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
        <span>30 Days Ago</span>
        <span>Today</span>
      </div>
    </div>
  );
}
