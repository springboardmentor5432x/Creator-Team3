import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

export default function AudienceAnalytics() {
  const location = useLocation();

  const [selectedPlatform, setSelectedPlatform] =
    useState(
      localStorage.getItem("selectedPlatform") || "All"
    );

  const [audienceData, setAudienceData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /*
  =====================================================
  FETCH AUDIENCE ANALYTICS
  =====================================================
  */

  useEffect(() => {
    fetchAudienceAnalytics();
  }, [location.pathname, selectedPlatform]);

  const fetchAudienceAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Authentication token not found"
        );
      }

      const platform =
        localStorage.getItem(
          "selectedPlatform"
        ) || "All";

      const response = await fetch(
        `http://localhost:8000/api/audience-analytics?platform=${encodeURIComponent(
          platform
        )}`,
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
            "Failed to load audience analytics"
        );
      }

      /*
      Backend response:

      {
        all: {...},
        platforms: {
          YouTube: {...},
          Instagram: {...}
        }
      }

      */

      let selectedData;

      if (platform === "All") {
        selectedData = data.all;
      } else {
        selectedData =
          data.platforms?.[platform];
      }

      if (!selectedData) {
        throw new Error(
          "No audience data available for this platform"
        );
      }

      /*
      Convert backend structure
      to frontend structure
      */

      const formattedData = {

        overview: {

          reach:
            selectedData.engagement?.reach ||
            0,

          impressions:
            selectedData.engagement?.impressions ||
            0,

          activeUsers:
            selectedData.activity?.reduce(
              (total, item) =>
                total +
                item.activeUsers,
              0
            ) || 0,

          engagementRate:
            selectedData.engagement?.views
              ? (
                  (
                    (
                      selectedData.engagement
                        .likes +
                      selectedData.engagement
                        .comments
                    ) /
                    selectedData.engagement
                      .views
                  ) *
                  100
                ).toFixed(1)
              : 0,
        },

        gender:
          selectedData.gender || [],

        ageGroups:
          selectedData.ageGroups?.map(
            (item) => ({
              name: item.age,
              value: item.value,
            })
          ) || [],

        locations:
          selectedData.locations || [],

        activeTimes:
          selectedData.activity || [],

        bestTime:
          selectedData.activity?.length
            ? selectedData.activity.reduce(
                (max, item) =>
                  item.activeUsers >
                  max.activeUsers
                    ? item
                    : max
              ).time
            : "Not available",

        engagement: {
          views:
            selectedData.engagement?.views ||
            0,

          likes:
            selectedData.engagement?.likes ||
            0,

          comments:
            selectedData.engagement?.comments ||
            0,

          shares:
            selectedData.engagement?.shares ||
            0,
        },

      };

      setAudienceData(
        formattedData
      );

    } catch (err) {

      console.error(
        "AUDIENCE ANALYTICS ERROR:",
        err
      );

      setError(
        err.message ||
          "Unable to load audience analytics"
      );

    } finally {

      setLoading(false);

    }
  };

  /*
  =====================================================
  CHANGE PLATFORM
  =====================================================
  */

  const handlePlatformChange = (
    platform
  ) => {

    localStorage.setItem(
      "selectedPlatform",
      platform
    );

    setSelectedPlatform(
      platform
    );

  };

  /*
  =====================================================
  LOADING
  =====================================================
  */

  if (loading) {

    return (

      <div className="dashboard-message">

        Loading audience analytics...

      </div>

    );

  }

  /*
  =====================================================
  ERROR
  =====================================================
  */

  if (error) {

    return (

      <div className="dashboard-message error-message">

        <h2>
          Unable to load audience analytics
        </h2>

        <p>
          {error}
        </p>

        <button
          onClick={
            fetchAudienceAnalytics
          }
        >

          Retry

        </button>

      </div>

    );

  }

  if (!audienceData) {

    return (

      <div className="dashboard-message">

        No audience data available.

      </div>

    );

  }

  const overview =
    audienceData.overview;

  return (

    <div className="audience-dashboard">

      {/* =================================================
          NAVBAR
      ================================================= */}

      <Navbar />

      <div className="audience-layout">

        {/* =================================================
            SIDEBAR
        ================================================= */}

        <Sidebar />

        <main className="audience-main">

          {/* =================================================
              HEADER
          ================================================= */}

          <section className="audience-header">

            <div>

              <h1>
                Audience Analytics
              </h1>

              <p>
                Understand who views,
                likes, comments and engages
                with your content.
              </p>

            </div>

            <div className="platform-badge">

              {selectedPlatform === "All"
                ? "🌐 All Platforms"
                : `📊 ${selectedPlatform}`}

            </div>

          </section>

          {/* =================================================
              PLATFORM SELECTOR
          ================================================= */}

          <div className="platform-switcher">

            {[
              "All",
              "YouTube",
              "Instagram",
              "LinkedIn",
              "Twitch",
            ].map(

              (platform) => (

                <button
                  key={platform}
                  className={
                    selectedPlatform ===
                    platform
                      ? "platform-button active"
                      : "platform-button"
                  }
                  onClick={() =>
                    handlePlatformChange(
                      platform
                    )
                  }
                >

                  {platform ===
                    "All" && "🌐"}

                  {platform ===
                    "YouTube" && "▶️"}

                  {platform ===
                    "Instagram" && "📸"}

                  {platform ===
                    "LinkedIn" && "💼"}

                  {platform ===
                    "Twitch" && "🎮"}

                  <span>
                    {platform}
                  </span>

                </button>

              )

            )}

          </div>

          {/* =================================================
              OVERVIEW
          ================================================= */}

          <section>

            <h2>
              Audience Overview
            </h2>

            <div className="audience-kpi-grid">

              <div className="audience-card">

                <span>
                  📢 Reach
                </span>

                <h2>
                  {overview.reach.toLocaleString()}
                </h2>

              </div>

              <div className="audience-card">

                <span>
                  📊 Impressions
                </span>

                <h2>
                  {overview.impressions.toLocaleString()}
                </h2>

              </div>

              <div className="audience-card">

                <span>
                  👥 Active Users
                </span>

                <h2>
                  {overview.activeUsers.toLocaleString()}
                </h2>

              </div>

              <div className="audience-card">

                <span>
                  💬 Engagement Rate
                </span>

                <h2>
                  {overview.engagementRate}%
                </h2>

              </div>

            </div>

          </section>

          {/* =================================================
              DEMOGRAPHICS
          ================================================= */}

          <section>

            <h2>
              Audience Demographics
            </h2>

            <div className="demographics-grid">

              {/* GENDER */}

              <div className="analytics-box">

                <h3>
                  Gender Distribution
                </h3>

                {audienceData.gender.map(

                  (item) => (

                    <div
                      key={item.name}
                      className="progress-row"
                    >

                      <div className="progress-label">

                        <span>
                          {item.name}
                        </span>

                        <strong>
                          {item.value}%
                        </strong>

                      </div>

                      <div className="progress-bar">

                        <div
                          className={
                            `progress-fill ${item.name.toLowerCase()}`
                          }
                          style={{
                            width:
                              `${item.value}%`,
                          }}
                        />

                      </div>

                    </div>

                  )

                )}

              </div>

              {/* AGE */}

              <div className="analytics-box">

                <h3>
                  Age Groups
                </h3>

                {audienceData.ageGroups.map(

                  (item) => (

                    <div
                      key={item.name}
                      className="progress-row"
                    >

                      <div className="progress-label">

                        <span>
                          {item.name}
                        </span>

                        <strong>
                          {item.value}%
                        </strong>

                      </div>

                      <div className="progress-bar">

                        <div
                          className="progress-fill age-fill"
                          style={{
                            width:
                              `${item.value}%`,
                          }}
                        />

                      </div>

                    </div>

                  )

                )}

              </div>

            </div>

          </section>

          {/* =================================================
              GEOGRAPHY
          ================================================= */}

          <section>

            <h2>
              Geographic Audience
            </h2>

            <div className="location-grid">

              {audienceData.locations.map(

                (item) => (

                  <div
                    key={item.name}
                    className="location-card"
                  >

                    <span>
                      🌍
                    </span>

                    <div>

                      <h3>
                        {item.name}
                      </h3>

                      <p>
                        {item.value}%
                        of audience
                      </p>

                    </div>

                  </div>

                )

              )}

            </div>

          </section>

          {/* =================================================
              ACTIVITY
          ================================================= */}

          <section>

            <h2>
              Audience Activity
            </h2>

            <div className="activity-grid">

              <div className="analytics-box">

                <h3>
                  Active Users by Time
                </h3>

                {audienceData.activeTimes.map(

                  (item) => (

                    <div
                      key={item.time}
                      className="activity-row"
                    >

                      <span>
                        {item.time}
                      </span>

                      <div className="activity-bar">

                        <div
                          style={{
                            width:
                              `${Math.min(
                                (
                                  item.activeUsers /
                                  Math.max(
                                    ...audienceData
                                      .activeTimes
                                      .map(
                                        (
                                          x
                                        ) =>
                                          x.activeUsers
                                      )
                                  )
                                ) *
                                100,
                                100
                              )}%`,
                          }}
                        />

                      </div>

                      <strong>
                        {item.activeUsers.toLocaleString()}
                      </strong>

                    </div>

                  )

                )}

              </div>

              <div className="best-time-card">

                <span>
                  ⏰
                </span>

                <h3>
                  Best Time to Post
                </h3>

                <strong>
                  {audienceData.bestTime}
                </strong>

                <p>
                  Your audience is most
                  active during this time.
                </p>

              </div>

            </div>

          </section>

          {/* =================================================
              ENGAGEMENT SUMMARY
          ================================================= */}

          <section>

            <h2>
              Engagement Summary
            </h2>

            <div className="engagement-summary">

              <div>

                <span>
                  👁 Views
                </span>

                <strong>
                  {audienceData.engagement.views.toLocaleString()}
                </strong>

              </div>

              <div>

                <span>
                  ❤️ Likes
                </span>

                <strong>
                  {audienceData.engagement.likes.toLocaleString()}
                </strong>

              </div>

              <div>

                <span>
                  💬 Comments
                </span>

                <strong>
                  {audienceData.engagement.comments.toLocaleString()}
                </strong>

              </div>

              <div>

                <span>
                  🔁 Shares
                </span>

                <strong>
                  {audienceData.engagement.shares.toLocaleString()}
                </strong>

              </div>

            </div>

          </section>

        </main>

      </div>

      {/* =================================================
          CSS
      ================================================= */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        .audience-dashboard {
          min-height: 100vh;
          background: #020617;
          color: #e2e8f0;
        }

        .audience-layout {
          display: flex;
          min-height: calc(100vh - 70px);
        }

        .audience-main {
          flex: 1;
          min-width: 0;
          padding: 32px;
        }

        .audience-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 25px;
        }

        .audience-header h1 {
          margin: 0 0 8px;
          color: #f1f5f9;
          font-size: 32px;
        }

        .audience-header p {
          margin: 0;
          color: #64748b;
        }

        .platform-badge {
          padding: 10px 15px;
          border-radius: 10px;
          background: #0b1220;
          border: 1px solid #1e293b;
          color: #94a3b8;
          font-weight: 600;
        }

        .platform-switcher {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 35px;
        }

        .platform-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 15px;
          border-radius: 9px;
          border: 1px solid #1e293b;
          background: #0b1220;
          color: #64748b;
          cursor: pointer;
          font-weight: 600;
          transition: 0.2s ease;
        }

        .platform-button:hover {
          background: #111827;
          color: #cbd5e1;
        }

        .platform-button.active {
          background: #172033;
          border-color: #475569;
          color: #e2e8f0;
        }

        section {
          margin-bottom: 40px;
        }

        section > h2 {
          margin-bottom: 20px;
          color: #cbd5e1;
          font-size: 21px;
        }

        .audience-kpi-grid {
          display: grid;
          grid-template-columns:
            repeat(
              auto-fit,
              minmax(210px, 1fr)
            );
          gap: 18px;
        }

        .audience-card {
          padding: 22px;
          border-radius: 15px;
          background: #0b1220;
          border: 1px solid #1e293b;
          transition: 0.2s ease;
        }

        .audience-card:hover {
          transform: translateY(-2px);
          border-color: #334155;
        }

        .audience-card span {
          color: #64748b;
        }

        .audience-card h2 {
          margin-top: 14px;
          color: #e2e8f0;
          font-size: 27px;
        }

        .demographics-grid,
        .activity-grid {
          display: grid;
          grid-template-columns:
            repeat(
              2,
              minmax(0, 1fr)
            );
          gap: 20px;
        }

        .analytics-box,
        .best-time-card {
          padding: 24px;
          border-radius: 15px;
          background: #0b1220;
          border: 1px solid #1e293b;
        }

        .analytics-box h3,
        .best-time-card h3 {
          color: #cbd5e1;
        }

        .progress-row {
          margin: 22px 0;
        }

        .progress-label {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .progress-label span {
          color: #94a3b8;
        }

        .progress-label strong {
          color: #cbd5e1;
        }

        .progress-bar {
          height: 8px;
          background: #1e293b;
          border-radius: 20px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          border-radius: 20px;
        }

        .female {
          background: #9f5274;
        }

        .male {
          background: #5279a8;
        }

        .other {
          background: #76609a;
        }

        .age-fill {
          background: #477f89;
        }

        .location-grid {
          display: grid;
          grid-template-columns:
            repeat(
              auto-fit,
              minmax(200px, 1fr)
            );
          gap: 18px;
        }

        .location-card {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 20px;
          border-radius: 15px;
          background: #0b1220;
          border: 1px solid #1e293b;
        }

        .location-card span {
          font-size: 27px;
        }

        .location-card h3 {
          margin: 0 0 6px;
          color: #cbd5e1;
        }

        .location-card p {
          margin: 0;
          color: #64748b;
        }

        .activity-row {
          display: grid;
          grid-template-columns:
            100px
            1fr
            75px;
          gap: 12px;
          align-items: center;
          margin: 18px 0;
        }

        .activity-row span {
          color: #94a3b8;
        }

        .activity-bar {
          height: 8px;
          background: #1e293b;
          border-radius: 20px;
          overflow: hidden;
        }

        .activity-bar div {
          height: 100%;
          background: #527f75;
        }

        .activity-row strong {
          color: #94a3b8;
          font-size: 13px;
          text-align: right;
        }

        .best-time-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .best-time-card > span {
          font-size: 36px;
        }

        .best-time-card strong {
          margin: 12px 0;
          color: #b59a5c;
          font-size: 24px;
        }

        .best-time-card p {
          color: #64748b;
        }

        .engagement-summary {
          display: grid;
          grid-template-columns:
            repeat(
              auto-fit,
              minmax(180px, 1fr)
            );
          gap: 16px;
        }

        .engagement-summary > div {
          padding: 20px;
          border-radius: 15px;
          background: #0b1220;
          border: 1px solid #1e293b;
        }

        .engagement-summary span {
          display: block;
          margin-bottom: 10px;
          color: #64748b;
        }

        .engagement-summary strong {
          color: #cbd5e1;
          font-size: 23px;
        }

        .dashboard-message {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 12px;
          background: #020617;
          color: #cbd5e1;
        }

        .error-message {
          color: #cbd5e1;
        }

        .error-message p {
          color: #f87171;
        }

        .error-message button {
          padding: 9px 18px;
          border: 1px solid #334155;
          border-radius: 8px;
          background: #0f172a;
          color: #cbd5e1;
          cursor: pointer;
        }

        @media (max-width: 800px) {

          .audience-main {
            padding: 20px;
          }

          .audience-header {
            flex-direction: column;
            gap: 18px;
          }

          .demographics-grid,
          .activity-grid {
            grid-template-columns: 1fr;
          }

        }

      `}</style>

    </div>

  );

}