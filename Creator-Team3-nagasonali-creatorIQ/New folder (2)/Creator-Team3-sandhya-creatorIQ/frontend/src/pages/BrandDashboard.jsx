import { useEffect, useState } from "react";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

import PlatformSelector from "../components/analytics/PlatformSelector";
import KPICards from "../components/analytics/KPICards";
import FollowersChart from "../components/analytics/FollowersChart";
import ViewsChart from "../components/analytics/ViewsChart";
import EngagementBarChart from "../components/analytics/EngagementBarChart";
import AudiencePieChart from "../components/analytics/AudiencePieChart";

export default function CreatorDashboard() {
  const [analytics, setAnalytics] = useState(null);

  const [selectedPlatform, setSelectedPlatform] =
    useState("All");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Please login again."
        );
      }

      const response = await fetch(
        "http://localhost:8000/api/analytics",
        {
          method: "GET",

          headers: {
            Authorization:
              `Bearer ${token}`,

            "Content-Type":
              "application/json",
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
          "Failed to fetch analytics"
        );
      }

      console.log(
        "LIVE ANALYTICS:",
        data
      );

      setAnalytics(data);

    } catch (err) {
      console.error(
        "ANALYTICS ERROR:",
        err
      );

      setError(
        err.message ||
        "Unable to load analytics"
      );

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
        <h2>
          Unable to load dashboard
        </h2>

        <p>
          {error}
        </p>
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

  /*
  ============================================================
  SELECTED PLATFORM DATA
  ============================================================
  */

  const selectedPlatformData =
    selectedPlatform === "All"
      ? null
      : analytics.platformPerformance?.find(
          (item) =>
            item.platform ===
            selectedPlatform
        );


  /*
  ============================================================
  KPI DATA
  ============================================================
  */

  const selectedKPIData =
    selectedPlatform === "All"
      ? analytics.kpiData || {}
      : {
          followers: {
            value:
              selectedPlatformData?.followers ||
              0,

            change: 12.4,

            status: "positive",
          },

          views: {
            value:
              selectedPlatformData?.views ||
              0,

            change: 8.2,

            status: "positive",
          },

          likes: {
            value:
              selectedPlatformData?.likes ||
              0,

            change: 5.1,

            status: "positive",
          },

          comments: {
            value:
              selectedPlatformData?.comments ||
              0,

            change: 3.2,

            status: "positive",
          },

          engagementRate: {
            value:
              selectedPlatformData?.engagementRate ||
              0,

            change: 0.6,

            status: "positive",
          },
        };


  /*
  ============================================================
  FOLLOWERS DATA
  ============================================================
  */

  const selectedFollowersData =
    analytics.monthlyFollowers?.[
      selectedPlatform
    ] || [];


  /*
  ============================================================
  VIEWS DATA
  ============================================================
  */

  const selectedViewsData =
    analytics.monthlyViews?.[
      selectedPlatform
    ] || [];


  /*
  ============================================================
  ENGAGEMENT DATA
  ============================================================
  */

  const selectedEngagementData =
    selectedPlatform === "All"
      ? analytics.platformPerformance || []
      : analytics.platformPerformance?.filter(
          (item) =>
            item.platform ===
            selectedPlatform
        ) || [];


  /*
  ============================================================
  AUDIENCE DATA
  ============================================================
  */

  const selectedAudienceData =
    analytics.audienceDemographics?.[
      selectedPlatform
    ] ||

    analytics.audienceDemographics?.All ||

    [];


  return (
    <div className="creator-dashboard">

      <Navbar />

      <div className="creator-layout">

        <Sidebar />

        <main className="creator-main">

          {/* ============================
              WELCOME SECTION
          ============================ */}

          <section className="welcome-section">

            <div className="welcome-content">

              <h1>
                Welcome Back 👋
              </h1>

              <p>
                Here's what's happening with
                your content today.
              </p>

            </div>


            {/* PLATFORM BUTTONS */}

            <PlatformSelector

              selectedPlatform={
                selectedPlatform
              }

              onPlatformChange={
                setSelectedPlatform
              }

            />

          </section>


          {/* ============================
              SELECTED PLATFORM TITLE
          ============================ */}

          <section className="selected-platform-heading">

            <h2>

              {selectedPlatform === "All"
                ? "All Platform Analytics"
                : `${selectedPlatform} Analytics`
              }

            </h2>

            <p>

              {selectedPlatform === "All"

                ? "Combined performance across all your social media platforms."

                : `Detailed analytics for ${selectedPlatform}.`

              }

            </p>

          </section>


          {/* ============================
              KPI CARDS
          ============================ */}

          <KPICards
            data={
              selectedKPIData
            }
          />


          {/* ============================
              CONTENT ANALYTICS
          ============================ */}

          <section className="content-analytics">

            <div className="section-heading">

              <h2>
                Content Analytics
              </h2>

              <p>
                Track your content performance
                over time
              </p>

            </div>


            <div className="analytics-grid">


              {/* FOLLOWERS */}

              <div className="analytics-card">

                <h3>
                  Followers Growth
                </h3>

                <p>
                  Monthly follower growth
                </p>

                <FollowersChart
                  data={
                    selectedFollowersData
                  }
                />

              </div>


              {/* VIEWS */}

              <div className="analytics-card">

                <h3>
                  Views Trend
                </h3>

                <p>
                  Monthly views and reactions
                </p>

                <ViewsChart
                  data={
                    selectedViewsData
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
                    selectedEngagementData
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
                    selectedAudienceData
                  }
                />

              </div>


            </div>

          </section>

        </main>

      </div>


      {/* ============================
          EXTRA STYLES
      ============================ */}

      <style>{`

        .welcome-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 25px;
        }

        .welcome-content h1 {
          margin-bottom: 8px;
        }

        .welcome-content p {
          color: #94a3b8;
        }

        .selected-platform-heading {
          margin-bottom: 20px;
        }

        .selected-platform-heading h2 {
          margin-bottom: 6px;
        }

        .selected-platform-heading p {
          color: #94a3b8;
        }

        @media (max-width: 900px) {
          .welcome-section {
            align-items: flex-start;
            flex-direction: column;
          }
        }

      `}</style>

    </div>
  );
}