import { useEffect, useState } from "react";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

import KPICards from "../components/analytics/KPICards";
import FollowersChart from "../components/analytics/FollowersChart";
import ViewsChart from "../components/analytics/ViewsChart";
import EngagementBarChart from "../components/analytics/EngagementBarChart";
import AudiencePieChart from "../components/analytics/AudiencePieChart";

const demoAnalytics = {
  platformPerformance: [
    {
      platform: "YouTube",
      followers: 12000,
      views: 500000,
      likes: 45000,
      comments: 5000,
      shares: 2000,
      engagementRate: 10.4,
    },
    {
      platform: "Instagram",
      followers: 18000,
      views: 700000,
      likes: 60000,
      comments: 7000,
      shares: 3000,
      engagementRate: 10,
    },
    {
      platform: "LinkedIn",
      followers: 8500,
      views: 150000,
      likes: 12000,
      comments: 1500,
      shares: 800,
      engagementRate: 9.5,
    },
    {
      platform: "Twitch",
      followers: 6000,
      views: 200000,
      likes: 18000,
      comments: 2500,
      shares: 1000,
      engagementRate: 10.75,
    },
  ],

  monthlyFollowers: {
    YouTube: [
      { month: "Jan", followers: 8000 },
      { month: "Feb", followers: 9000 },
      { month: "Mar", followers: 10000 },
      { month: "Apr", followers: 11000 },
      { month: "May", followers: 12000 },
    ],

    Instagram: [
      { month: "Jan", followers: 12000 },
      { month: "Feb", followers: 13500 },
      { month: "Mar", followers: 15000 },
      { month: "Apr", followers: 16500 },
      { month: "May", followers: 18000 },
    ],

    LinkedIn: [
      { month: "Jan", followers: 5000 },
      { month: "Feb", followers: 6000 },
      { month: "Mar", followers: 6800 },
      { month: "Apr", followers: 7600 },
      { month: "May", followers: 8500 },
    ],

    Twitch: [
      { month: "Jan", followers: 3000 },
      { month: "Feb", followers: 3800 },
      { month: "Mar", followers: 4500 },
      { month: "Apr", followers: 5200 },
      { month: "May", followers: 6000 },
    ],
  },

  monthlyViews: {
    YouTube: [
      { month: "Jan", views: 300000 },
      { month: "Feb", views: 350000 },
      { month: "Mar", views: 400000 },
      { month: "Apr", views: 450000 },
      { month: "May", views: 500000 },
    ],

    Instagram: [
      { month: "Jan", views: 400000 },
      { month: "Feb", views: 470000 },
      { month: "Mar", views: 550000 },
      { month: "Apr", views: 620000 },
      { month: "May", views: 700000 },
    ],

    LinkedIn: [
      { month: "Jan", views: 80000 },
      { month: "Feb", views: 95000 },
      { month: "Mar", views: 110000 },
      { month: "Apr", views: 130000 },
      { month: "May", views: 150000 },
    ],

    Twitch: [
      { month: "Jan", views: 100000 },
      { month: "Feb", views: 125000 },
      { month: "Mar", views: 150000 },
      { month: "Apr", views: 175000 },
      { month: "May", views: 200000 },
    ],
  },

  audienceDemographics: {
    YouTube: [
      { name: "18-24", value: 35 },
      { name: "25-34", value: 40 },
      { name: "35-44", value: 25 },
    ],

    Instagram: [
      { name: "18-24", value: 45 },
      { name: "25-34", value: 35 },
      { name: "35-44", value: 20 },
    ],

    LinkedIn: [
      { name: "18-24", value: 20 },
      { name: "25-34", value: 50 },
      { name: "35-44", value: 30 },
    ],

    Twitch: [
      { name: "18-24", value: 55 },
      { name: "25-34", value: 30 },
      { name: "35-44", value: 15 },
    ],
  },
};

export default function CreatorDashboard() {
  const [selectedPlatform, setSelectedPlatform] =
    useState("All");

  const [analytics, setAnalytics] =
    useState(demoAnalytics);

  // API loads in background.
  // Dashboard is displayed immediately.
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token =
          localStorage.getItem("token");

        if (!token) {
          console.log(
            "No token found. Showing demo analytics."
          );
          return;
        }

        const response = await fetch(
          "http://localhost:8000/api/analytics",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type":
                "application/json",
            },
          }
        );

        if (!response.ok) {
          console.log(
            "Backend analytics unavailable. Showing demo data."
          );
          return;
        }

        const data =
          await response.json();

        if (data) {
          setAnalytics(data);
        }
      } catch (error) {
        console.log(
          "Analytics API error. Showing demo data.",
          error
        );
      }
    };

    fetchAnalytics();
  }, []);

  const platforms = [
    {
      name: "All",
      icon: "🌐",
    },
    {
      name: "YouTube",
      icon: "▶️",
    },
    {
      name: "Instagram",
      icon: "📸",
    },
    {
      name: "LinkedIn",
      icon: "💼",
    },
    {
      name: "Twitch",
      icon: "🎮",
    },
  ];

  const platformPerformance =
    analytics.platformPerformance || [];

  const selectedPlatformData =
    platformPerformance.find(
      (item) =>
        item.platform === selectedPlatform
    );

  // =====================================================
  // ALL PLATFORM TOTALS
  // =====================================================

  const allData =
    platformPerformance.reduce(
      (total, platform) => {
        total.followers +=
          Number(platform.followers) || 0;

        total.views +=
          Number(platform.views) || 0;

        total.likes +=
          Number(platform.likes) || 0;

        total.comments +=
          Number(platform.comments) || 0;

        total.shares +=
          Number(platform.shares) || 0;

        return total;
      },
      {
        followers: 0,
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
      }
    );

  const totalEngagement =
    allData.likes +
    allData.comments +
    allData.shares;

  const allEngagementRate =
    allData.views > 0
      ? (
          (totalEngagement /
            allData.views) *
          100
        ).toFixed(2)
      : 0;

  // =====================================================
  // KPI DATA
  // =====================================================

  let kpiData = {};

  if (selectedPlatform === "All") {
    kpiData = {
      followers: {
        label: "Total Followers",
        value: allData.followers,
        change: 0,
        status: "positive",
      },

      views: {
        label: "Total Views",
        value: allData.views,
        change: 0,
        status: "positive",
      },

      likes: {
        label: "Total Likes",
        value: allData.likes,
        change: 0,
        status: "positive",
      },

      comments: {
        label: "Total Comments",
        value: allData.comments,
        change: 0,
        status: "positive",
      },

      shares: {
        label: "Total Shares",
        value: allData.shares,
        change: 0,
        status: "positive",
      },

      engagementRate: {
        label: "Engagement Rate",
        value: allEngagementRate,
        change: 0,
        status: "positive",
      },
    };
  } else if (selectedPlatformData) {
    kpiData = {
      followers: {
        label: "Total Followers",
        value:
          selectedPlatformData.followers || 0,
        change: 0,
        status: "positive",
      },

      views: {
        label: "Total Views",
        value:
          selectedPlatformData.views || 0,
        change: 0,
        status: "positive",
      },

      likes: {
        label: "Total Likes",
        value:
          selectedPlatformData.likes || 0,
        change: 0,
        status: "positive",
      },

      comments: {
        label: "Total Comments",
        value:
          selectedPlatformData.comments || 0,
        change: 0,
        status: "positive",
      },

      shares: {
        label: "Total Shares",
        value:
          selectedPlatformData.shares || 0,
        change: 0,
        status: "positive",
      },

      engagementRate: {
        label: "Engagement Rate",
        value:
          selectedPlatformData.engagementRate ||
          0,
        change: 0,
        status: "positive",
      },
    };
  }

  // =====================================================
  // FOLLOWERS DATA
  // =====================================================

  let followersData = [];

  if (selectedPlatform === "All") {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
    ];

    followersData = months.map(
      (month, index) => {
        let total = 0;

        Object.values(
          analytics.monthlyFollowers
        ).forEach((platform) => {
          total +=
            Number(
              platform[index]?.followers
            ) || 0;
        });

        return {
          month,
          followers: total,
        };
      }
    );
  } else {
    followersData =
      analytics.monthlyFollowers[
        selectedPlatform
      ] || [];
  }

  // =====================================================
  // VIEWS DATA
  // =====================================================

  let viewsData = [];

  if (selectedPlatform === "All") {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
    ];

    viewsData = months.map(
      (month, index) => {
        let total = 0;

        Object.values(
          analytics.monthlyViews
        ).forEach((platform) => {
          total +=
            Number(
              platform[index]?.views
            ) || 0;
        });

        return {
          month,
          views: total,
        };
      }
    );
  } else {
    viewsData =
      analytics.monthlyViews[
        selectedPlatform
      ] || [];
  }

  // =====================================================
  // ENGAGEMENT DATA
  // =====================================================

  const engagementData =
    selectedPlatform === "All"
      ? platformPerformance
      : selectedPlatformData
      ? [selectedPlatformData]
      : [];

  // =====================================================
  // AUDIENCE DATA
  // =====================================================

  let audienceData = [];

  if (selectedPlatform === "All") {
    const audience = {};

    Object.values(
      analytics.audienceDemographics
    ).forEach((platform) => {
      platform.forEach((item) => {
        audience[item.name] =
          (audience[item.name] || 0) +
          item.value;
      });
    });

    audienceData = Object.entries(
      audience
    ).map(([name, value]) => ({
      name,
      value,
    }));
  } else {
    audienceData =
      analytics.audienceDemographics[
        selectedPlatform
      ] || [];
  }

  return (
    <div className="creator-dashboard">

      <Navbar />

      <div className="creator-layout">

        <Sidebar />

        <main className="creator-main">

          <section className="welcome-section">

            <div>
              <h1>
                Welcome Back 👋
              </h1>

              <p>
                Here's what's happening with
                your content today.
              </p>
            </div>

            <div className="platform-switcher">

              {platforms.map((platform) => (
                <button
                  key={platform.name}
                  className={
                    selectedPlatform ===
                    platform.name
                      ? "platform-button active"
                      : "platform-button"
                  }
                  onClick={() =>
                    setSelectedPlatform(
                      platform.name
                    )
                  }
                >
                  <span>
                    {platform.icon}
                  </span>

                  {platform.name}
                </button>
              ))}

            </div>

          </section>

          <section className="selected-platform-heading">

            <h2>
              {selectedPlatform === "All"
                ? "All Platforms Analytics"
                : `${selectedPlatform} Analytics`}
            </h2>

            <p>
              {selectedPlatform === "All"
                ? "Combined performance from all your social media platforms."
                : `Detailed performance analytics for ${selectedPlatform}.`}
            </p>

          </section>

          <KPICards data={kpiData} />

          <section className="content-analytics">

            <div className="section-heading">

              <h2>
                Content Analytics
              </h2>

              <p>
                Track your content performance
                across platforms.
              </p>

            </div>

            <div className="analytics-grid">

              <div className="analytics-card">

                <h3>
                  Followers Growth
                </h3>

                <FollowersChart
                  data={followersData}
                />

              </div>

              <div className="analytics-card">

                <h3>
                  Views Trend
                </h3>

                <ViewsChart
                  data={viewsData}
                />

              </div>

              <div className="analytics-card">

                <h3>
                  Engagement Overview
                </h3>

                <EngagementBarChart
                  data={engagementData}
                />

              </div>

              <div className="analytics-card">

                <h3>
                  Audience Demographics
                </h3>

                <AudiencePieChart
                  data={audienceData}
                />

              </div>

            </div>

          </section>

          <section className="platform-performance">

            <div className="section-heading">

              <h2>
                {selectedPlatform === "All"
                  ? "Platform Performance"
                  : `${selectedPlatform} Performance`}
              </h2>

              <p>
                Compare your social media
                performance.
              </p>

            </div>

            <div className="platform-performance-grid">

              {engagementData.map(
                (platform) => (

                  <div
                    className="platform-performance-card"
                    key={platform.platform}
                  >

                    <h3>
                      {platform.platform}
                    </h3>

                    <div className="platform-stat">
                      <span>
                        Followers
                      </span>

                      <strong>
                        {Number(
                          platform.followers ||
                            0
                        ).toLocaleString()}
                      </strong>
                    </div>

                    <div className="platform-stat">
                      <span>
                        Views
                      </span>

                      <strong>
                        {Number(
                          platform.views ||
                            0
                        ).toLocaleString()}
                      </strong>
                    </div>

                    <div className="platform-stat">
                      <span>
                        Likes
                      </span>

                      <strong>
                        {Number(
                          platform.likes ||
                            0
                        ).toLocaleString()}
                      </strong>
                    </div>

                    <div className="platform-stat">
                      <span>
                        Comments
                      </span>

                      <strong>
                        {Number(
                          platform.comments ||
                            0
                        ).toLocaleString()}
                      </strong>
                    </div>

                    <div className="platform-stat">
                      <span>
                        Shares
                      </span>

                      <strong>
                        {Number(
                          platform.shares ||
                            0
                        ).toLocaleString()}
                      </strong>
                    </div>

                    <div className="platform-stat">
                      <span>
                        Engagement Rate
                      </span>

                      <strong>
                        {platform.engagementRate ||
                          0}
                        %
                      </strong>
                    </div>

                  </div>

                )
              )}

            </div>

          </section>

        </main>

      </div>

      <style>{`

        .creator-dashboard {
          min-height: 100vh;
          background: #020617;
          color: white;
        }

        .creator-layout {
          display: flex;
          min-height: calc(100vh - 70px);
        }

        .creator-main {
          flex: 1;
          min-width: 0;
          padding: 30px;
        }

        .welcome-section {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 30px;
        }

        .welcome-section h1 {
          margin: 0 0 8px;
          font-size: 30px;
        }

        .welcome-section p,
        .selected-platform-heading p,
        .section-heading p {
          color: #94a3b8;
        }

        .platform-switcher {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .platform-button {
          padding: 10px 14px;
          border: 1px solid #334155;
          border-radius: 10px;
          background: #0f172a;
          color: #cbd5e1;
          cursor: pointer;
          font-weight: 600;
        }

        .platform-button.active {
          background: #2563eb;
          color: white;
        }

        .selected-platform-heading {
          margin-bottom: 25px;
        }

        .analytics-grid {
          display: grid;
          grid-template-columns: repeat(
            2,
            minmax(0, 1fr)
          );
          gap: 20px;
        }

        .analytics-card,
        .platform-performance-card {
          padding: 22px;
          border-radius: 16px;
          background: #0f172a;
          border: 1px solid #1e293b;
        }

        .analytics-card {
          min-height: 350px;
        }

        .platform-performance {
          margin-top: 40px;
        }

        .platform-performance-grid {
          display: grid;
          grid-template-columns: repeat(
            auto-fit,
            minmax(220px, 1fr)
          );
          gap: 18px;
        }

        .platform-stat {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #1e293b;
        }

        .platform-stat span {
          color: #94a3b8;
        }

        @media (max-width: 900px) {
          .welcome-section {
            flex-direction: column;
          }

          .analytics-grid {
            grid-template-columns: 1fr;
          }
        }

      `}</style>

    </div>
  );
}