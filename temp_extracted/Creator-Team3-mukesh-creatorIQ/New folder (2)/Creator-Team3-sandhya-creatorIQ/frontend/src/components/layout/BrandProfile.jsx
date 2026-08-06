import { useEffect, useState } from "react";

export default function BrandProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login again.");
      }

      const response = await fetch(
        "http://localhost:8000/user",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
          "Failed to load brand profile"
        );
      }

      setUser(data.user);
    } catch (err) {
      console.error(
        "BRAND PROFILE ERROR:",
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
        Loading brand profile...
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
    <div className="brand-profile-page">

      <div className="brand-profile-card">

        <div className="brand-profile-avatar">
          {user?.Email
            ?.charAt(0)
            ?.toUpperCase() || "B"}
        </div>

        <h1>
          Brand Profile
        </h1>

        <p className="brand-profile-subtitle">
          Manage your brand account information
        </p>

        <div className="brand-profile-details">

          <div className="brand-profile-detail">
            <span>Email</span>

            <strong>
              {user?.Email ||
                "Not available"}
            </strong>
          </div>

          <div className="brand-profile-detail">
            <span>Role</span>

            <strong>
              {user?.role ||
                "Brand"}
            </strong>
          </div>

        </div>

      </div>

      <style>{`

        .brand-profile-page {
          min-height: 100vh;
          padding: 40px;
          color: white;
        }

        .brand-profile-card {
          max-width: 650px;
          margin: 0 auto;
          padding: 40px;
          background:
            rgba(17, 25, 40, 0.75);
          border:
            1px solid
            rgba(255,255,255,0.08);
          border-radius: 20px;
          text-align: center;
        }

        .brand-profile-avatar {
          width: 90px;
          height: 90px;
          margin: 0 auto 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background:
            linear-gradient(
              135deg,
              #8b5cf6,
              #ec4899
            );
          font-size: 36px;
          font-weight: bold;
        }

        .brand-profile-card h1 {
          margin-bottom: 8px;
        }

        .brand-profile-subtitle {
          color: #94a3b8;
          margin-bottom: 30px;
        }

        .brand-profile-details {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .brand-profile-detail {
          display: flex;
          justify-content: space-between;
          padding: 16px;
          background:
            rgba(15, 23, 42, 0.7);
          border-radius: 10px;
        }

        .brand-profile-detail span {
          color: #94a3b8;
        }

        .brand-profile-detail strong {
          color: #f8fafc;
        }

      `}</style>

    </div>
  );
}