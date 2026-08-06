import React, { useEffect, useState } from 'react';
import { Briefcase, Calendar, DollarSign, CheckCircle2, Clock } from 'lucide-react';

export default function SponsorshipTracker({ token }) {
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    const fetchSponsorships = async () => {
      try {
        const authToken = token || localStorage.getItem('token');
        const res = await fetch('http://127.0.0.1:8000/api/revenue/sponsorships', {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        if (res.ok) {
          const resData = await res.json();
          setDeals(Array.isArray(resData) ? resData : []);
        }
      } catch (err) {
        console.error("Failed to fetch sponsorship deals:", err);
      }
    };
    fetchSponsorships();
  }, [token]);

  const fallbackDeals = [
    { id: 1, brandName: "TechGear Pro", campaignName: "Q3 Developer Setup", amount: 4500, startDate: "2026-06-01", endDate: "2026-07-01", status: "Active", paymentStatus: "Paid" },
    { id: 2, brandName: "CloudScale AI", campaignName: "AI Backend Masterclass", amount: 6200, startDate: "2026-06-15", endDate: "2026-07-30", status: "Active", paymentStatus: "Invoiced" },
    { id: 3, brandName: "CodeStream", campaignName: "IDE Integration Showcase", amount: 3200, startDate: "2026-05-01", endDate: "2026-05-30", status: "Completed", paymentStatus: "Paid" }
  ];

  const displayDeals = deals.length > 0 ? deals : fallbackDeals;
  const totalAmount = displayDeals.reduce((sum, d) => sum + (d.amount || 0), 0);

  return (
    <div className="theme-card" style={{ padding: '22px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Briefcase size={18} color="var(--accent-primary)" />
            Brand Sponsorship Deals & Campaigns
          </h3>
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
            Active brand deals, contract values, campaign dates, and invoice payment statuses
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Total Sponsorship Value</span>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#10b981' }}>
            ${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-primary)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '10px 12px' }}>Brand</th>
              <th style={{ padding: '10px 12px' }}>Campaign Name</th>
              <th style={{ padding: '10px 12px' }}>Deal Amount</th>
              <th style={{ padding: '10px 12px' }}>Campaign Period</th>
              <th style={{ padding: '10px 12px' }}>Campaign Status</th>
              <th style={{ padding: '10px 12px', textAlign: 'right' }}>Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {displayDeals.map((d, idx) => (
              <tr key={d.id || idx} style={{ borderBottom: '1px solid var(--border-primary)' }}>
                <td style={{ padding: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>{d.brandName}</td>
                <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{d.campaignName}</td>
                <td style={{ padding: '12px', fontWeight: 800, color: '#10b981' }}>${(d.amount || 0).toLocaleString()}</td>
                <td style={{ padding: '12px', color: 'var(--text-muted)', fontSize: '12px' }}>{d.startDate} → {d.endDate}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{
                    padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 700,
                    background: d.status === 'Active' ? 'rgba(16,185,129,0.15)' : 'rgba(148,163,184,0.15)',
                    color: d.status === 'Active' ? '#10b981' : 'var(--text-muted)'
                  }}>
                    {d.status}
                  </span>
                </td>
                <td style={{ padding: '12px', textAlign: 'right' }}>
                  <span style={{
                    padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 700,
                    background: d.paymentStatus === 'Paid' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                    color: d.paymentStatus === 'Paid' ? '#10b981' : '#f59e0b'
                  }}>
                    {d.paymentStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
