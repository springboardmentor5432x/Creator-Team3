import React from 'react';
import { ArrowUpRight, ArrowDownRight, Video, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

const videos = [
  {
    title: "AI Automation Guide 2026",
    views: "2.1M",
    watchTime: "180K hrs",
    rpm: "$4.80",
    cpm: "$6.30",
    revenue: "$10,080",
    growth: "up",
  },
  {
    title: "Python FastAPI Backend Course",
    views: "1.4M",
    watchTime: "120K hrs",
    rpm: "$5.20",
    cpm: "$7.10",
    revenue: "$7,280",
    growth: "up",
  },
  {
    title: "Data Science & ML Pipeline",
    views: "900K",
    watchTime: "80K hrs",
    rpm: "$4.30",
    cpm: "$6.00",
    revenue: "$3,870",
    growth: "down",
  },
  {
    title: "React 19 & Tailwind Full Masterclass",
    views: "760K",
    watchTime: "72K hrs",
    rpm: "$4.60",
    cpm: "$6.50",
    revenue: "$3,496",
    growth: "up",
  },
  {
    title: "Machine Learning Model Deployment",
    views: "610K",
    watchTime: "55K hrs",
    rpm: "$4.10",
    cpm: "$5.90",
    revenue: "$2,501",
    growth: "down",
  },
];

export default function VideoRevenueTable() {
  return (
    <div className="theme-card" style={{ padding: '22px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Video size={18} color="var(--accent-primary)" />
            Monetized Video Earnings Breakdown
          </h3>
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
            Individual performance, RPM/CPM rates, and total generated revenue per video
          </p>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-primary)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '10px 12px' }}>Video Title</th>
              <th style={{ padding: '10px 12px', textAlign: 'center' }}>Views</th>
              <th style={{ padding: '10px 12px', textAlign: 'center' }}>Watch Time</th>
              <th style={{ padding: '10px 12px', textAlign: 'center' }}>RPM</th>
              <th style={{ padding: '10px 12px', textAlign: 'center' }}>CPM</th>
              <th style={{ padding: '10px 12px', textAlign: 'center' }}>Est. Revenue</th>
              <th style={{ padding: '10px 12px', textAlign: 'center' }}>Trend</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((video, index) => (
              <tr 
                key={index}
                style={{ 
                  borderBottom: '1px solid var(--border-primary)',
                  transition: 'background 0.2s ease'
                }}
              >
                <td style={{ padding: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {video.title}
                </td>
                <td style={{ padding: '12px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  {video.views}
                </td>
                <td style={{ padding: '12px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  {video.watchTime}
                </td>
                <td style={{ padding: '12px', textAlign: 'center', color: 'var(--text-primary)', fontWeight: 600 }}>
                  {video.rpm}
                </td>
                <td style={{ padding: '12px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  {video.cpm}
                </td>
                <td style={{ padding: '12px', textAlign: 'center', fontWeight: 800, color: '#10b981' }}>
                  {video.revenue}
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  {video.growth === 'up' ? (
                    <span style={{ color: '#10b981', display: 'inline-flex', alignItems: 'center' }}>
                      <ArrowUpRight size={18} />
                    </span>
                  ) : (
                    <span style={{ color: '#ef4444', display: 'inline-flex', alignItems: 'center' }}>
                      <ArrowDownRight size={18} />
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '24px' }}>
        <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Highest Earning Video</span>
          <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
            AI Automation Guide 2026
          </div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
            $10,080
          </div>
        </div>

        <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Lowest Earning Video</span>
          <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
            Machine Learning Deployment
          </div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#ef4444', marginTop: '2px' }}>
            $2,501
          </div>
        </div>

        <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.25)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Avg Revenue / 1k Views</span>
          <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
            Channel Average RPM
          </div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#3b82f6', marginTop: '2px' }}>
            $4.86
          </div>
        </div>
      </div>
    </div>
  );
}
