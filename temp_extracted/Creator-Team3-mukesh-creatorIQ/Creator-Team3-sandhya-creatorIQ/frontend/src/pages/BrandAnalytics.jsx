import React, { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import BrandSidebar from "../components/layout/BrandSidebar";

import BrandKPICards from "../components/dashboard/BrandKPICards";
import CampaignChart from "../components/analytics/CampaignChart";
import BrandEngagement from "../components/analytics/BrandEngagement";

export default function BrandAnalytics() {
  const [roiMetrics, setRoiMetrics] = useState({
    totalSpend: "$97,000",
    totalReach: "5.15M",
    avgEngagement: "6.4%",
    estimatedROI: "3.4x"
  });

  return (
    <div className="brand-dashboard">
      <Navbar />
      <div className="brand-dashboard-body">
        <BrandSidebar />
        <main className="brand-main-content">
          
          <header style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>Brand ROI & Campaign Performance</h1>
            <p style={{ color: '#94a3b8', margin: '4px 0 0' }}>Analyze campaign reach, influencer conversions, and return on ad spend.</p>
          </header>

          <BrandKPICards />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px', marginTop: '24px' }}>
            <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px' }}>
              <h3 style={{ margin: '0 0 16px' }}>Campaign Reach & Impressions</h3>
              <CampaignChart />
            </div>

            <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px' }}>
              <h3 style={{ margin: '0 0 16px' }}>Audience Engagement Distribution</h3>
              <BrandEngagement />
            </div>
          </div>

          <section style={{ marginTop: '32px', background: '#111827', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px' }}>
            <h3 style={{ margin: '0 0 16px' }}>Influencer ROI Performance Table</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: '#f8fafc' }}>
                <thead>
                  <tr style={{ background: '#1f2937', borderBottom: '1px solid #374151', color: '#9ca3af', fontSize: '13px', textTransform: 'uppercase' }}>
                    <th style={{ padding: '14px 16px' }}>Creator</th>
                    <th style={{ padding: '14px 16px' }}>Campaign</th>
                    <th style={{ padding: '14px 16px' }}>Deliverable</th>
                    <th style={{ padding: '14px 16px' }}>Views Generated</th>
                    <th style={{ padding: '14px 16px' }}>Click-Through Rate</th>
                    <th style={{ padding: '14px 16px' }}>Est. ROI</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #1f2937' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 'bold' }}>Alex Smith</td>
                    <td style={{ padding: '14px 16px' }}>Summer Product Launch</td>
                    <td style={{ padding: '14px 16px', color: '#9ca3af' }}>YouTube Video</td>
                    <td style={{ padding: '14px 16px' }}>420,000</td>
                    <td style={{ padding: '14px 16px' }}>4.8%</td>
                    <td style={{ padding: '14px 16px', color: '#34d399', fontWeight: 'bold' }}>3.8x</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #1f2937' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 'bold' }}>Jamie Miller</td>
                    <td style={{ padding: '14px 16px' }}>Influencer Awareness Drive</td>
                    <td style={{ padding: '14px 16px', color: '#9ca3af' }}>Instagram Reel</td>
                    <td style={{ padding: '14px 16px' }}>680,000</td>
                    <td style={{ padding: '14px 16px' }}>5.2%</td>
                    <td style={{ padding: '14px 16px', color: '#34d399', fontWeight: 'bold' }}>4.1x</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}