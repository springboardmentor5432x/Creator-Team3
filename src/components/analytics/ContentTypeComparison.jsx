import React from 'react';
import { Brain, PlaySquare, Image as ImageIcon, Layers } from 'lucide-react';

export default function ContentTypeComparison({ contentBreakdown, insight }) {
  if (!contentBreakdown || Object.keys(contentBreakdown).length === 0) return null;

  const types = [
    { id: 'REELS', label: 'Reels', icon: PlaySquare, color: '#f56040' },
    { id: 'POSTS', label: 'Posts', icon: ImageIcon, color: '#833ab4' },
    { id: 'CAROUSELS', label: 'Carousels', icon: Layers, color: '#e1306c' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{
        background: 'rgba(15, 23, 42, 0.6)',
        border: '1px solid var(--border-primary)',
        borderRadius: '16px',
        padding: '24px',
        overflowX: 'auto'
      }}>
        <h3 style={{ margin: '0 0 24px 0', fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
          Content Type Performance
        </h3>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-primary)' }}>
              <th style={{ padding: '0 16px 16px 0', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '13px' }}>METRIC</th>
              {types.map(t => (
                <th key={t.id} style={{ padding: '0 16px 16px 16px', color: 'var(--text-primary)', fontWeight: 600, fontSize: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <t.icon size={16} color={t.color} />
                    {t.label}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <td style={{ padding: '16px 16px 16px 0', color: 'var(--text-secondary)', fontSize: '14px' }}>Reach</td>
              {types.map(t => (
                <td key={t.id} style={{ padding: '16px', color: 'var(--text-primary)', fontWeight: 600 }}>
                  {contentBreakdown[t.id]?.reach?.toLocaleString() || 0}
                </td>
              ))}
            </tr>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <td style={{ padding: '16px 16px 16px 0', color: 'var(--text-secondary)', fontSize: '14px' }}>Engagement</td>
              {types.map(t => (
                <td key={t.id} style={{ padding: '16px', color: 'var(--text-primary)', fontWeight: 600 }}>
                  {contentBreakdown[t.id]?.engagement || 0}%
                </td>
              ))}
            </tr>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <td style={{ padding: '16px 16px 16px 0', color: 'var(--text-secondary)', fontSize: '14px' }}>Saves</td>
              {types.map(t => (
                <td key={t.id} style={{ padding: '16px', color: 'var(--text-primary)', fontWeight: 600 }}>
                  {contentBreakdown[t.id]?.saves?.toLocaleString() || 0}
                </td>
              ))}
            </tr>
            <tr>
              <td style={{ padding: '16px 16px 0 0', color: 'var(--text-secondary)', fontSize: '14px' }}>Shares</td>
              {types.map(t => (
                <td key={t.id} style={{ padding: '16px 16px 0 16px', color: 'var(--text-primary)', fontWeight: 600 }}>
                  {contentBreakdown[t.id]?.shares?.toLocaleString() || 0}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* CreatorIQ Insight */}
      {insight && (
        <div style={{
          background: 'linear-gradient(90deg, rgba(225, 48, 108, 0.1) 0%, rgba(131, 58, 180, 0.1) 100%)',
          border: '1px solid rgba(225, 48, 108, 0.3)',
          borderRadius: '12px',
          padding: '20px',
          display: 'flex',
          gap: '16px',
          alignItems: 'flex-start'
        }}>
          <div style={{ background: 'linear-gradient(45deg, #f56040, #e1306c)', padding: '10px', borderRadius: '10px' }}>
            <Brain size={20} color="white" />
          </div>
          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 700, color: '#e1306c', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              CreatorIQ Intelligence
            </h4>
            <p style={{ margin: 0, color: 'var(--text-primary)', fontSize: '15px', lineHeight: '1.5' }}>
              {insight}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
