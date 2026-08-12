import React, { useEffect, useState } from 'react';
import { Link2, ExternalLink, ShoppingCart, DollarSign, ArrowUpRight } from 'lucide-react';

export default function AffiliateAnalytics({ token }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchAffiliates = async () => {
      try {
        const authToken = token || localStorage.getItem('token');
        const res = await fetch('http://127.0.0.1:8000/api/revenue/affiliates', {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        if (res.ok) {
          const resData = await res.json();
          setData(resData);
        }
      } catch (err) {
        console.error("Failed to fetch affiliate analytics:", err);
      }
    };
    fetchAffiliates();
  }, [token]);

  const fallbackData = {
    totalRevenue: 9592.00,
    products: [
      { product: "Ultimate Web Dev Equipment Kit", link: "creatoriq.link/dev-setup", platform: "Amazon", clicks: 14200, conversions: 426, convRate: "3.0%", commissionRate: "12%", totalEarnings: "$2,840.00" },
      { product: "AI Video Editing Masterclass", link: "creatoriq.link/ai-video", platform: "Impact", clicks: 9800, conversions: 392, convRate: "4.0%", commissionRate: "20%", totalEarnings: "$3,920.00" },
      { product: "FastAPI & React Boilerplate Pro", link: "creatoriq.link/stack-template", platform: "Gumroad", clicks: 7400, conversions: 296, convRate: "4.0%", commissionRate: "15%", totalEarnings: "$2,220.00" },
      { product: "Custom Mechanical Keyboard", link: "creatoriq.link/keyboard", platform: "ShareASale", clicks: 5100, conversions: 102, convRate: "2.0%", commissionRate: "8%", totalEarnings: "$612.00" }
    ]
  };

  const displayData = (data && data.products) ? data : fallbackData;

  return (
    <div className="theme-card" style={{ padding: '22px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link2 size={18} color="var(--accent-primary)" />
            Affiliate Marketing & Link Tracking
          </h3>
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
            Track product link clicks, conversion rates, and commissions earned across affiliate platforms
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Total Affiliate Revenue</span>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#10b981' }}>
            ${(displayData.totalRevenue || 9592.00).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-primary)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '10px 12px' }}>Product / Campaign</th>
              <th style={{ padding: '10px 12px' }}>Platform Network</th>
              <th style={{ padding: '10px 12px' }}>Tracking Link</th>
              <th style={{ padding: '10px 12px', textAlign: 'center' }}>Clicks</th>
              <th style={{ padding: '10px 12px', textAlign: 'center' }}>Conversions</th>
              <th style={{ padding: '10px 12px', textAlign: 'center' }}>Conv. Rate</th>
              <th style={{ padding: '10px 12px', textAlign: 'center' }}>Commission</th>
            </tr>
          </thead>
          <tbody>
            {displayData.products.map((p, idx) => (
              <tr key={p.id || idx} style={{ borderBottom: '1px solid var(--border-primary)' }}>
                <td style={{ padding: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{p.product}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '10px', background: 'rgba(59,130,246,0.15)', color: 'var(--accent-primary)' }}>
                    {p.platform || 'General'}
                  </span>
                </td>
                <td style={{ padding: '12px', color: 'var(--accent-primary)', fontSize: '12px' }}>
                  <a href={`https://${p.link}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    {p.link} <ExternalLink size={12} />
                  </a>
                </td>
                <td style={{ padding: '12px', textAlign: 'center', color: 'var(--text-secondary)' }}>{(p.clicks || 0).toLocaleString()}</td>
                <td style={{ padding: '12px', textAlign: 'center', color: 'var(--text-secondary)' }}>{p.conversions}</td>
                <td style={{ padding: '12px', textAlign: 'center', color: '#10b981', fontWeight: 600 }}>{p.convRate}</td>
                <td style={{ padding: '12px', textAlign: 'center', fontWeight: 800, color: '#10b981' }}>{p.totalEarnings}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
