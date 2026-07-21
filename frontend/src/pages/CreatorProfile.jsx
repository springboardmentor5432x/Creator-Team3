import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

function formatNumber(value) {
  if (value === null || value === undefined) {
    return "0";
  }

  const number = Number(value);

  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(2)}M`;
  }

  if (number >= 1000) {
    return `${(number / 1000).toFixed(1)}K`;
  }

  return number.toLocaleString();
}

function formatPercentage(value) {
  if (value === null || value === undefined) {
    return "0%";
  }

  return `${Number(value).toFixed(2)}%`;
}

export default function CreatorProfile() {
  const [user, setUser] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login again.");
      }

      // =========================
      // GET USER PROFILE
      // =========================
      const userResponse = await fetch(
        "http://localhost:8000/user",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userData = await userResponse.json();

      if (!userResponse.ok) {
        throw new Error(
          userData.detail || "Failed to load profile"
        );
      }

      setUser(userData.user);

      // =========================
      // GET CREATOR ANALYTICS
      // =========================
      const analyticsResponse = await fetch(
        "http://localhost:8000/api/analytics",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const analyticsData =
        await analyticsResponse.json();

      if (!analyticsResponse.ok) {
        throw new Error(
          analyticsData.detail ||
            "Failed to load analytics"
        );
      }

      setAnalytics(analyticsData);

    } catch (err) {
      console.error(
        "PROFILE ERROR:",
        err
      );

      setError(err.message);

    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-message">
        Loading profile...
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

  return (
    <div className="creator-dashboard">

      <Navbar />

      <div className="creator-layout">

        <Sidebar />

        <main className="creator-main">

          {/* =========================
              PROFILE HEADER
          ========================== */}
          <section className="profile-header glass-card">

            <div className="profile-avatar">
              {user?.Username
                ? user.Username
                    .substring(0, 2)
                    .toUpperCase()
                : "CR"}
            </div>

            <div className="profile-header-info">

              <h1>
                {user?.Username || "Creator"}
              </h1>

              <p>
                {user?.role || "Creator"}
              </p>

              <span className="profile-status">
                ✓ Active Creator
              </span>

            </div>

          </section>


          {/* =========================
              PERSONAL INFORMATION
          ========================== */}
          <section className="profile-section glass-card">

            <h2>
              Personal Information
            </h2>

            <div className="profile-grid">

              <div className="profile-field">
                <label>
                  Username
                </label>

                <p>
                  {user?.Username || "Not available"}
                </p>
              </div>


              <div className="profile-field">
                <label>
                  Email
                </label>

                <p>
                  {user?.Email || "Not available"}
                </p>
              </div>


              <div className="profile-field">
                <label>
                  Phone
                </label>

                <p>
                  {user?.phone || "Not available"}
                </p>
              </div>


              <div className="profile-field">
                <label>
                  Role
                </label>

                <p>
                  {user?.role || "Creator"}
                </p>
              </div>

            </div>

          </section>


          {/* =========================
              CREATOR PERFORMANCE
          ========================== */}
          <section className="profile-section glass-card">

            <h2>
              Creator Performance
            </h2>

            <div className="profile-stats">

              <div className="profile-stat-card">

                <span>
                  👥
                </span>

                <h3>
                  {formatNumber(
                    analytics?.kpiData
                      ?.followers
                      ?.value
                  )}
                </h3>

                <p>
                  Total Followers
                </p>

              </div>


              <div className="profile-stat-card">

                <span>
                  👁️
                </span>

                <h3>
                  {formatNumber(
                    analytics?.kpiData
                      ?.views
                      ?.value
                  )}
                </h3>

                <p>
                  Total Views
                </p>

              </div>


              <div className="profile-stat-card">

                <span>
                  ❤️
                </span>

                <h3>
                  {formatNumber(
                    analytics?.kpiData
                      ?.likes
                      ?.value
                  )}
                </h3>

                <p>
                  Total Likes
                </p>

              </div>


              <div className="profile-stat-card">

                <span>
                  📊
                </span>

                <h3>
                  {formatPercentage(
                    analytics?.kpiData
                      ?.engagementRate
                      ?.value
                  )}
                </h3>

                <p>
                  Engagement Rate
                </p>

              </div>

            </div>

          </section>


          {/* =========================
              CONNECTED PLATFORMS
          ========================== */}
          <section className="profile-section glass-card">

            <h2>
              Connected Platforms
            </h2>

            <div className="platform-list">

              {analytics
                ?.platformPerformance
                ?.map((platform) => (

                  <div
                    className="platform-item"
                    key={platform.platform}
                  >

                    <div>

                      <h3>
                        {platform.platform}
                      </h3>

                      <p>
                        {formatNumber(
                          platform.followers
                        )} followers
                      </p>

                    </div>

                    <span>
                      {formatPercentage(
                        platform.engagementRate
                      )}
                    </span>

                  </div>

                ))}

            </div>

          </section>

        </main>

      </div>

    </div>
  );
}