import { useEffect, useState } from "react";

export default function Profile() {
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
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to load profile"
        );
      }

      setUser(data.user);
    } catch (err) {
      console.error("PROFILE ERROR:", err);
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
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-avatar">
          {user?.Username?.charAt(0)?.toUpperCase() || "U"}
        </div>

        <h1>
          {user?.Username || "User"}
        </h1>

        <p>
          {user?.Email || "No email available"}
        </p>

        <div className="profile-details">
          <div className="profile-detail">
            <span>Username</span>
            <strong>
              {user?.Username || "Not available"}
            </strong>
          </div>

          <div className="profile-detail">
            <span>Email</span>
            <strong>
              {user?.Email || "Not available"}
            </strong>
          </div>

          <div className="profile-detail">
            <span>Role</span>
            <strong>
              {user?.role || "Not available"}
            </strong>
          </div>
        </div>
      </div>

      <style>{`
        .profile-page {
          min-height: 100vh;
          padding: 40px;
          color: white;
        }

        .profile-card {
          max-width: 600px;
          margin: 0 auto;
          padding: 40px;
          background: rgba(17, 25, 40, 0.75);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          text-align: center;
        }

        .profile-avatar {
          width: 90px;
          height: 90px;
          margin: 0 auto 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: linear-gradient(
            135deg,
            #2563eb,
            #8b5cf6
          );
          font-size: 36px;
          font-weight: bold;
        }

        .profile-card h1 {
          margin-bottom: 8px;
        }

        .profile-card > p {
          color: #94a3b8;
          margin-bottom: 30px;
        }

        .profile-details {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .profile-detail {
          display: flex;
          justify-content: space-between;
          padding: 16px;
          background: rgba(15, 23, 42, 0.7);
          border-radius: 10px;
        }

        .profile-detail span {
          color: #94a3b8;
        }

        .profile-detail strong {
          color: #f8fafc;
        }
      `}</style>
    </div>
  );
}