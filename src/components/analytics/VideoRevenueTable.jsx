import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, Video, Lock as LockIcon } from 'lucide-react';

export default function VideoRevenueTable({ token }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopVideos = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/youtube/analytics/top-videos?max_results=5', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await res.json();
        
        if (!res.ok) {
          throw new Error(result.detail || "Failed to fetch top videos");
        }
        
        if (result.unavailable || result.connected === false) {
          setVideos([]);
        } else {
          // Map backend data to table format
          const formatted = result.data.map(v => {
            const views = v.views || 0;
            const watchTimeHours = ((v.estimatedMinutesWatched || 0) / 60).toFixed(1) + 'k hrs';
            const revenue = v.estimatedRevenue || 0;
            const cpm = v.cpm || 0;
            const rpm = (views > 0) ? (revenue / (views / 1000)) : 0;
            
            return {
              title: v.video || "Unknown Video",
              views: (views > 1000000) ? (views / 1000000).toFixed(1) + 'M' : (views / 1000).toFixed(1) + 'K',
              viewsRaw: views,
              watchTime: watchTimeHours,
              rpm: `$${rpm.toFixed(2)}`,
              cpm: `$${cpm.toFixed(2)}`,
              revenue: `$${revenue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
              revenueRaw: revenue,
              growth: (revenue > 5000) ? 'up' : 'down' // Simplified trend logic based on revenue
            };
          });
          setVideos(formatted);
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (token) {
      fetchTopVideos();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="theme-card" style={{ padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '280px' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading video revenue...</p>
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="theme-card" style={{ padding: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '24px', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LockIcon size={24} color="#ef4444" />
        </div>
        <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>Video Revenue Locked</h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: 0 }}>
          Individual video earnings require a direct OAuth connection via YouTube Analytics API. Please connect your YouTube account in Settings.
        </p>
      </div>
    );
  }

  const highestEarning = [...videos].sort((a, b) => b.revenueRaw - a.revenueRaw)[0];
  const lowestEarning = [...videos].sort((a, b) => a.revenueRaw - b.revenueRaw)[0];
  
  const totalRev = videos.reduce((sum, v) => sum + v.revenueRaw, 0);
  const totalViews = videos.reduce((sum, v) => sum + v.viewsRaw, 0);
  const avgRpm = totalViews > 0 ? (totalRev / (totalViews / 1000)) : 0;

  return (
    <div className="theme-card" style={{ padding: '22px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Video size={18} color="var(--accent-primary)" />
            Monetized Video Earnings Breakdown (Live)
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
              <th style={{ padding: '10px 12px' }}>Video Title / ID</th>
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
          <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {highestEarning ? highestEarning.title : 'N/A'}
          </div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
            {highestEarning ? highestEarning.revenue : '$0'}
          </div>
        </div>

        <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Lowest Earning Video</span>
          <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {lowestEarning ? lowestEarning.title : 'N/A'}
          </div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#ef4444', marginTop: '2px' }}>
            {lowestEarning ? lowestEarning.revenue : '$0'}
          </div>
        </div>

        <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.25)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Avg Revenue / 1k Views</span>
          <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
            Channel Average RPM
          </div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#3b82f6', marginTop: '2px' }}>
            ${avgRpm.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}
