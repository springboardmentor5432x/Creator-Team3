import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

import KPICards from "../components/analytics/KPIcards";
import FollowersChart from "../components/analytics/FollowersChart";
import ViewsChart from "../components/analytics/ViewsChart";
import EngagementBarChart from "../components/analytics/EngagementBarChart";
import AudiencePieChart from "../components/analytics/AudiencePieChart";

import AIInsights from "../components/analytics/AIInsights";
import CompareContent from "../components/analytics/CompareContent";
import TrendingContent from "../components/analytics/TrendingContent";
import TopContentTable from "../components/analytics/TopContentTable";

export default function CreatorDashboard() {
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [kpiData, setKpiData] = useState(null);
  const [platformPerformance, setPlatformPerformance] = useState([]);
  const [viewsData, setViewsData] = useState([]);
  const [followersData, setFollowersData] = useState([]);
  const [audienceData, setAudienceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login again.");
      setLoading(false);
      return;
    }

    const baseUrl = "http://127.0.0.1:8000";
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      setLoading(true);
      // Fetch KPIs & performance
      const resStats = await fetch(`${baseUrl}/api/analytics`, { headers });
      if (!resStats.ok) throw new Error("Failed to load KPIs");
      const stats = await resStats.json();
      setKpiData(stats.kpiData);
      setPlatformPerformance(stats.platformPerformance);

      // Fetch views history
      const resViews = await fetch(`${baseUrl}/api/analytics/views`, { headers });
      if (resViews.ok) {
        const views = await resViews.json();
        setViewsData(views);
      }

      // Fetch followers history
      const resFollowers = await fetch(`${baseUrl}/api/analytics/followers`, { headers });
      if (resFollowers.ok) {
        const followers = await resFollowers.json();
        setFollowersData(followers);
      }

      // Fetch demographics
      const resAudience = await fetch(`${baseUrl}/api/analytics/audience`, { headers });
      if (resAudience.ok) {
        const audience = await resAudience.json();
        setAudienceData(audience);
      }
    } catch (err) {
      console.error(err);
      setError("Error loading data from server. Displaying local copy.");
    } finally {
      setLoading(false);
    }
  };

  const getFilteredKpiData = () => {
    if (!kpiData) return null;
    if (selectedPlatform === "All") {
      return kpiData;
    }

    const platformData = platformPerformance.find(
      (p) => p.platform.toLowerCase() === selectedPlatform.toLowerCase()
    );

    if (!platformData) return kpiData;

    return {
      followers: {
        label: "Platform Followers",
        value: platformData.followers,
        change: undefined,
        status: "positive",
      },
      views: {
        label: "Platform Views",
        value: platformData.views,
        change: undefined,
        status: "positive",
      },
      likes: {
        label: "Platform Likes",
        value: platformData.likes,
        change: undefined,
        status: "positive",
      },
      comments: {
        label: "Platform Comments",
        value: platformData.comments,
        change: undefined,
        status: "positive",
      },
      engagementRate: {
        label: "Engagement Rate",
        value: platformData.engagementRate,
        change: undefined,
        status: "positive",
      },
    };
  };

  if (loading) {
    return <div className="dashboard-message">Loading dashboard metrics...</div>;
  }

  const activeKpiData = getFilteredKpiData();

  return (
    <div className="creator-dashboard-view">
      <Navbar />

      <div className="creator-layout" style={{ display: "flex", minHeight: "calc(100vh - 70px)" }}>
        <Sidebar />

        <main className="creator-main" style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
          {error && <div className="dashboard-message error">{error}</div>}

          {/* Platform Filters */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <div>
              <h1 style={{ margin: 0, fontSize: "1.875rem" }}>Creator Dashboard</h1>
              <p style={{ margin: "4px 0 0 0", color: "#94a3b8", fontSize: "0.875rem" }}>Track your creator metrics and growth</p>
            </div>
            <div className="filter-group" style={{ display: "flex", gap: "8px", background: "rgba(30,41,59,0.4)", padding: "4px", borderRadius: "999px", border: "1px solid rgba(255,255,255,0.08)" }}>
              {["All", "YouTube", "Instagram", "LinkedIn", "Facebook"].map((platform) => (
                <button
                  key={platform}
                  className={`filter-btn ${selectedPlatform === platform ? "active" : ""}`}
                  style={{
                    border: "none",
                    background: selectedPlatform === platform ? "#3b82f6" : "transparent",
                    color: selectedPlatform === platform ? "white" : "#94a3b8",
                    padding: "8px 16px",
                    borderRadius: "999px",
                    fontSize: "0.8125rem",
                    cursor: "pointer",
                    fontWeight: "600",
                    transition: "0.2s"
                  }}
                  onClick={() => setSelectedPlatform(platform)}
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>

          {/* Core KPIs */}
          {activeKpiData && <KPICards data={activeKpiData} />}

          {/* Visual Widgets Grid */}
          <div className="creator-dashboard-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginTop: "1.5rem" }}>
            <div className="analytics-card" style={{ background: "rgba(30, 41, 59, 0.4)", border: "1px solid rgba(255,255,255,0.08)", padding: "1.5rem", borderRadius: "20px" }}>
              <h3 style={{ margin: "0 0 1rem 0" }}>Views Trend</h3>
              <ViewsChart data={viewsData} />
            </div>

            <div className="analytics-card" style={{ background: "rgba(30, 41, 59, 0.4)", border: "1px solid rgba(255,255,255,0.08)", padding: "1.5rem", borderRadius: "20px" }}>
              <h3 style={{ margin: "0 0 1rem 0" }}>Followers Growth</h3>
              <FollowersChart data={followersData} />
            </div>
          </div>

          <div className="creator-dashboard-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginTop: "1.5rem" }}>
            <div className="analytics-card" style={{ background: "rgba(30, 41, 59, 0.4)", border: "1px solid rgba(255,255,255,0.08)", padding: "1.5rem", borderRadius: "20px" }}>
              <h3 style={{ margin: "0 0 1rem 0" }}>Audience Demographics</h3>
              <AudiencePieChart data={audienceData} />
            </div>

            <div className="analytics-card" style={{ background: "rgba(30, 41, 59, 0.4)", border: "1px solid rgba(255,255,255,0.08)", padding: "1.5rem", borderRadius: "20px" }}>
              <h3 style={{ margin: "0 0 1rem 0" }}>Engagement Overview</h3>
              <EngagementBarChart data={platformPerformance} />
            </div>
          </div>

          {/* AI Insights & Content Analysis Widgets */}
          <div className="creator-dashboard-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginTop: "1.5rem" }}>
            <AIInsights />
            <CompareContent />
          </div>

          <div className="creator-dashboard-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginTop: "1.5rem" }}>
            <TrendingContent />
            <TopContentTable />
          </div>
        </main>
      </div>
    </div>
  );
}
