import { useEffect, useState } from "react";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNotifications();

    // Refresh notifications every 30 seconds
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login again.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        "http://localhost:8000/api/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to load notifications"
        );
      }

      setNotifications(data.notifications || []);
    } catch (err) {
      console.error("NOTIFICATION ERROR:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  if (loading) {
    return (
      <div className="notifications-page">
        <h1>Notifications</h1>
        <p>Loading notifications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notifications-page">
        <h1>Notifications</h1>
        <p className="notification-error">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="notifications-page">

      <div className="notifications-header">

        <div>
          <h1>Notifications</h1>

          <p>
            Stay updated with your latest activity
          </p>
        </div>

        <div className="notification-count">
          {unreadCount} Unread
        </div>

      </div>


      <div className="notifications-list">

        {notifications.length === 0 ? (

          <div className="empty-notifications">
            No notifications available.
          </div>

        ) : (

          notifications.map((notification) => (

            <div
              key={notification.id}
              className={
                notification.read
                  ? "notification-card read"
                  : "notification-card unread"
              }
            >

              <div className="notification-icon">

                {notification.type === "analytics" && "📊"}

                {notification.type === "growth" && "📈"}

                {notification.type === "campaign" && "📢"}

                {notification.type === "creator" && "👥"}

              </div>


              <div className="notification-content">

                <h3>
                  {notification.title}
                </h3>

                <p>
                  {notification.message}
                </p>

                <span>
                  {notification.time}
                </span>

              </div>

            </div>

          ))

        )}

      </div>


      <style>{`

        .notifications-page {
          min-height: 100vh;
          padding: 40px;
          color: white;
        }

        .notifications-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .notifications-header h1 {
          margin-bottom: 8px;
        }

        .notifications-header p {
          color: #94a3b8;
        }

        .notification-count {
          padding: 10px 16px;
          border-radius: 10px;
          background: #1e293b;
          color: #60a5fa;
          font-weight: 600;
        }

        .notifications-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-width: 800px;
        }

        .notification-card {
          display: flex;
          gap: 18px;
          padding: 20px;
          border-radius: 16px;
          border: 1px solid
            rgba(255, 255, 255, 0.08);
          background: rgba(17, 25, 40, 0.75);
        }

        .notification-card.unread {
          border-left: 4px solid #3b82f6;
        }

        .notification-card.read {
          opacity: 0.7;
        }

        .notification-icon {
          width: 45px;
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: #1e293b;
          font-size: 22px;
        }

        .notification-content {
          flex: 1;
        }

        .notification-content h3 {
          margin-bottom: 6px;
        }

        .notification-content p {
          color: #cbd5e1;
          margin-bottom: 8px;
        }

        .notification-content span {
          color: #64748b;
          font-size: 13px;
        }

        .notification-error {
          color: #f87171;
        }

        .empty-notifications {
          padding: 40px;
          text-align: center;
          color: #94a3b8;
        }

        @media (max-width: 600px) {

          .notifications-page {
            padding: 20px;
          }

          .notifications-header {
            align-items: flex-start;
            gap: 15px;
            flex-direction: column;
          }

        }

      `}</style>

    </div>
  );
}