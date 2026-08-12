import { useEffect, useState } from "react";

import Navbar from "../components/layout/Navbar";
import BrandSidebar from "../components/layout/BrandSidebar";

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
          method: "GET",
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
    <div className="brand-dashboard">

      {/* NAVBAR */}
      <Navbar />

      <div className="brand-dashboard-body">

        {/* SIDEBAR */}
        <BrandSidebar />

        {/* MAIN CONTENT */}
        <main className="brand-main-content">

          {/* PAGE HEADER */}
          <section className="brand-welcome">

            <div>
              <h1>
                Brand Profile
              </h1>

              <p>
                Manage your brand account information
              </p>
            </div>

          </section>


          {/* PROFILE CARD */}
          <section className="brand-profile-card">

            {/* AVATAR */}
            <div className="brand-profile-avatar">

              {user?.Username
                ? user.Username
                    .substring(0, 2)
                    .toUpperCase()
                : "BA"}

            </div>


            <h2>
              {user?.Username ||
                "Brand Agency"}
            </h2>


            <p className="brand-profile-role">
              {user?.role ||
                "Brand"}
            </p>


            {/* DETAILS */}
            <div className="brand-profile-details">

              <div className="brand-profile-detail">

                <span>
                  Username
                </span>

                <strong>
                  {user?.Username ||
                    "Not available"}
                </strong>

              </div>


              <div className="brand-profile-detail">

                <span>
                  Email
                </span>

                <strong>
                  {user?.Email ||
                    "Not available"}
                </strong>

              </div>


              <div className="brand-profile-detail">

                <span>
                  Phone
                </span>

                <strong>
                  {user?.phone ||
                    "Not available"}
                </strong>

              </div>


              <div className="brand-profile-detail">

                <span>
                  Role
                </span>

                <strong>
                  {user?.role ||
                    "Brand"}
                </strong>

              </div>

            </div>

          </section>

        </main>

      </div>


      {/* PAGE STYLES */}
      <style>{`

        .brand-profile-card {
          max-width: 800px;
          margin: 20px auto;
          padding: 40px;
          background: rgba(17, 25, 40, 0.75);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          color: white;
        }

        .brand-profile-avatar {
          width: 90px;
          height: 90px;
          margin: 0 auto 20px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background: linear-gradient(
            135deg,
            #8b5cf6,
            #ec4899
          );

          font-size: 32px;
          font-weight: 700;
        }

        .brand-profile-card h2 {
          text-align: center;
          margin-bottom: 8px;
        }

        .brand-profile-role {
          text-align: center;
          color: #94a3b8;
          margin-bottom: 30px;
        }

        .brand-profile-details {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .brand-profile-detail {
          display: flex;
          justify-content: space-between;
          align-items: center;

          padding: 16px 20px;

          background: rgba(15, 23, 42, 0.7);

          border: 1px solid
            rgba(255,255,255,0.06);

          border-radius: 10px;
        }

        .brand-profile-detail span {
          color: #94a3b8;
        }

        .brand-profile-detail strong {
          color: #f8fafc;
        }

        @media (max-width: 640px) {

          .brand-profile-card {
            margin: 15px;
            padding: 25px;
          }

          .brand-profile-detail {
            flex-direction: column;
            align-items: flex-start;
            gap: 6px;
          }

        }

      `}</style>

    </div>
  );
}