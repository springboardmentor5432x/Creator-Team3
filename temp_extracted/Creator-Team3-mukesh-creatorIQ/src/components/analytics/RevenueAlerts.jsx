import React from 'react';
import { Bell, AlertTriangle, TrendingUp, DollarSign, ShieldCheck } from 'lucide-react';

const alerts = [
  {
    id: 1,
    type: 'milestone',
    title: 'AdSense Payout Threshold Reached',
    description: 'Monthly earnings passed $15,000 threshold. Automatic deposit scheduled for 21st.',
    time: '2 hours ago',
    icon: ShieldCheck,
    color: '#10b981'
  },
  {
    id: 2,
    type: 'warning',
    title: 'CPM Rate Spike on Technical Videos',
    description: 'YouTube US tech CPM increased from $6.20 to $7.80 (+25.8% yield bump).',
    time: 'Yesterday',
    icon: TrendingUp,
    color: '#3b82f6'
  },
  {
    id: 3,
    type: 'alert',
    title: 'Sponsorship Payment Confirmation Required',
    description: 'Invoice #8492 for $4,500 pending brand validation on BrandConnect portal.',
    time: '2 days ago',
    icon: AlertTriangle,
    color: '#f59e0b'
  }
];

export default function RevenueAlerts() {
  return (
    <div className="theme-card" style={{ padding: '22px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell size={18} color="var(--accent-primary)" />
          Financial Alerts & Payout Notifications
        </h3>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Real-Time Telemetry</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {alerts.map((item) => {
          const IconComponent = item.icon;
          return (
            <div
              key={item.id}
              style={{
                padding: '14px 16px',
                borderRadius: '12px',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-primary)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}
            >
              <div style={{
                padding: '8px',
                borderRadius: '10px',
                background: `${item.color}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <IconComponent size={18} color={item.color} />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {item.title}
                  </h4>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.time}</span>
                </div>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
