import { useEffect, useState } from "react";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

import KPICards from "../components/analytics/KPICards";
import FollowersChart from "../components/analytics/FollowersChart";
import ViewsChart from "../components/analytics/ViewsChart";
import EngagementBarChart from "../components/analytics/EngagementBarChart";
import AudiencePieChart from "../components/analytics/AudiencePieChart";

export default function CreatorDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login again.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        "http://localhost:8000/api/analytics",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch analytics data");
      }

      const data = await response.json();

      console.log("Analytics Data:", data);

      setAnalytics(data);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-message">
        Loading analytics...
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-message error">
        {error}
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="dashboard-message">
        No analytics data found.
      </div>
    );
  }

  return (
    <div className="creator-dashboard">

      {/* TOP NAVBAR */}
      <Navbar />

      {/* SIDEBAR + CONTENT */}
      <div className="creator-layout">

        {/* SIDEBAR */}
        <Sidebar />

        {/* MAIN CONTENT */}
        <main className="creator-main">

          {/* WELCOME */}
          <section className="welcome-section">

            <div>
              <h1>Welcome Back 👋</h1>

              <p>
                Here's what's happening with your content today.
              </p>
            </div>

            <button className="analytics-button">
              Creator Analytics
            </button>

          </section>

          {/* KPI CARDS */}
          <KPICards
            data={analytics.kpiData}
          />

          {/* CONTENT ANALYTICS */}
          <section className="content-analytics">

            <div className="section-heading">

              <h2>
                Content Analytics
              </h2>

              <p>
                Track your content performance over time
              </p>

            </div>

            <div className="analytics-grid">

              {/* FOLLOWERS */}
              <div className="analytics-card">

                <h3>
                  Followers Growth
                </h3>

                <p>
                  Cumulative monthly growth trajectory
                </p>

                <FollowersChart
                  data={
                    analytics.monthlyFollowers?.All || []
                  }
                />

              </div>

              {/* VIEWS */}
              <div className="analytics-card">

                <h3>
                  Views Trend
                </h3>

                <p>
                  Monthly views and viewer reactions
                </p>

                <ViewsChart
                  data={
                    analytics.monthlyViews?.All || []
                  }
                />

              </div>

              {/* ENGAGEMENT */}
              <div className="analytics-card">

                <h3>
                  Engagement Overview
                </h3>

                <p>
                  Likes, comments and shares
                </p>

                <EngagementBarChart
                  data={
                    analytics.platformPerformance || []
                  }
                />

              </div>

              {/* AUDIENCE */}
              <div className="analytics-card">

                <h3>
                  Audience Demographics
                </h3>

                <p>
                  Understand your audience
                </p>

                <AudiencePieChart
                  data={
                    analytics.audienceDemographics?.All || []
                  }
                />

              </div>

            </div>

          </section>

        </main>

      </div>

    </div>
  );
}