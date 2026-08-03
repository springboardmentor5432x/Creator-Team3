import React, { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import PlatformSelector from "../components/analytics/PlatformSelector";
import KPICards from "../components/analytics/KPICards";
import FollowersChart from "../components/analytics/FollowersChart";
import ViewsChart from "../components/analytics/ViewsChart";
import EngagementBarChart from "../components/analytics/EngagementBarChart";
import AudiencePieChart from "../components/analytics/AudiencePieChart";

export default function CreatorAnalytics() {
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [analytics, setAnalytics] = useState(null);
  const [viewsTrend, setViewsTrend] = useState([]);
  const [followersTrend, setFollowersTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const [analyticsRes, viewsRes, followersRes] = await Promise.all([
        fetch("http://localhost:8000/api/analytics", { headers }).catch(() => null),
        fetch("http://localhost:8000/api/analytics/views", { headers }).catch(() => null),
        fetch("http://localhost:8000/api/analytics/followers", { headers }).catch(() => null)
      ]);

      if (analyticsRes && analyticsRes.ok) {
        const data = await analyticsRes.json();
        setAnalytics(data);
      } else {
        // Fallback default structure
        setAnalytics({
          kpiData: {
            followers: { label: "Total Followers", value: 1254300, change: 12.4, status: "positive" },
            views: { label: "Total Views", value: 8432000, change: 8.2, status: "positive" },
            likes: { label: "Total Likes", value: 1240000, change: 5.1, status: "positive" },
            comments: { label: "Total Comments", value: 89300, change: -2.4, status: "negative" },
            engagementRate: { label: "Engagement Rate", value: 4.85, change: 0.6, status: "positive" }
          },
          platformPerformance: [
            { platform: "YouTube", followers: 520000, engagementRate: 5.6, views: 4200000, likes: 580000, comments: 48000, shares: 12000 },
            { platform: "Instagram", followers: 450000, engagementRate: 4.2, views: 1800000, likes: 390000, comments: 22000, shares: 18000 },
            { platform: "LinkedIn", followers: 234300, engagementRate: 7.8, views: 2432000, likes: 270000, comments: 19300, shares: 15200 },
            { platform: "Twitch", followers: 50000, engagementRate: 2.1, views: 0, likes: 0, comments: 0, shares: 0 }
          ]
        });
      }

      if (viewsRes && viewsRes.ok) {
        const vData = await viewsRes.json();
        setViewsTrend(vData);
      }
      if (followersRes && followersRes.ok) {
        const fData = await followersRes.json();
        setFollowersTrend(fData);
      }

    } catch (err) {
      console.error("CreatorAnalytics Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const platformsList = analytics?.platformPerformance || [];
  const filteredPlatforms = selectedPlatform === "All" 
    ? platformsList 
    : platformsList.filter((p) => p.platform.toLowerCase() === selectedPlatform.toLowerCase());

  return (
    <div className="creator-dashboard">
      <Navbar />
      <div className="creator-layout">
        <Sidebar />
        <main className="creator-main">
          
          <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>Advanced Creator Analytics</h1>
              <p style={{ color: '#94a3b8', margin: '4px 0 0' }}>Deep dive into multi-platform reach, growth trends, and viewer retention.</p>
            </div>

            <PlatformSelector
              selectedPlatform={selectedPlatform}
              onSelectPlatform={setSelectedPlatform}
              onPlatformChange={setSelectedPlatform}
            />
          </header>

          {loading ? (
            <div style={{ color: '#94a3b8', padding: '40px 0', textAlign: 'center' }}>Loading live metrics...</div>
          ) : (
            <>
              <KPICards data={analytics?.kpiData || {}} />

              <section className="content-analytics" style={{ marginTop: '28px' }}>
                <div className="section-heading" style={{ marginBottom: '20px' }}>
                  <h2>Growth & Performance Trends</h2>
                  <p>Historical views and follower milestones across platforms</p>
                </div>

                <div className="analytics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
                  <div className="analytics-card" style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px' }}>
                    <h3>Followers Growth Trajectory</h3>
                    <FollowersChart data={followersTrend.length ? followersTrend : [
                      { month: "Jan", count: 10000 }, { month: "Feb", count: 15000 }, { month: "Mar", count: 22000 }
                    ]} />
                  </div>

                  <div className="analytics-card" style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px' }}>
                    <h3>Monthly Views & Engagements</h3>
                    <ViewsChart data={viewsTrend.length ? viewsTrend : [
                      { month: "Jan", views: 50000 }, { month: "Feb", views: 80000 }, { month: "Mar", views: 120000 }
                    ]} />
                  </div>
                </div>
              </section>

              <section className="platform-breakdown" style={{ marginTop: '36px' }}>
                <div className="section-heading" style={{ marginBottom: '16px' }}>
                  <h2>Platform Specific Breakdown</h2>
                  <p>Detailed channel metrics comparison</p>
                </div>

                <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '16px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: '#f8fafc' }}>
                    <thead>
                      <tr style={{ background: '#1f2937', borderBottom: '1px solid #374151', color: '#9ca3af', fontSize: '13px', textTransform: 'uppercase' }}>
                        <th style={{ padding: '16px 20px' }}>Platform</th>
                        <th style={{ padding: '16px 20px' }}>Followers</th>
                        <th style={{ padding: '16px 20px' }}>Total Views</th>
                        <th style={{ padding: '16px 20px' }}>Likes</th>
                        <th style={{ padding: '16px 20px' }}>Comments</th>
                        <th style={{ padding: '16px 20px' }}>Engagement Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPlatforms.map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #1f2937' }}>
                          <td style={{ padding: '16px 20px', fontWeight: 'bold' }}>{item.platform}</td>
                          <td style={{ padding: '16px 20px' }}>{Number(item.followers || 0).toLocaleString()}</td>
                          <td style={{ padding: '16px 20px' }}>{Number(item.views || 0).toLocaleString()}</td>
                          <td style={{ padding: '16px 20px' }}>{Number(item.likes || 0).toLocaleString()}</td>
                          <td style={{ padding: '16px 20px' }}>{Number(item.comments || 0).toLocaleString()}</td>
                          <td style={{ padding: '16px 20px', color: '#34d399', fontWeight: 'bold' }}>{item.engagementRate}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}

        </main>
      </div>
    </div>
  );
}