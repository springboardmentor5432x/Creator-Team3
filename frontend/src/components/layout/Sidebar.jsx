import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();

    navigate("/login", {
      replace: true,
    });
  };

  const getLinkClass = ({ isActive }) =>
    isActive
      ? "sidebar-link active"
      : "sidebar-link";

  return (
    <aside className="creator-sidebar">

      {/* PROFILE */}

      <div className="sidebar-profile">

        <div className="creator-avatar">
          CR
        </div>

        <h3>Creator</h3>

        <p>
          Verified Creator
        </p>

      </div>


      {/* MENU */}

      <nav className="sidebar-menu">

        {/* DASHBOARD */}

        <NavLink
          to="/creator"
          end
          className={getLinkClass}
        >
          <span>🏠</span>
          <span>Dashboard</span>
        </NavLink>


        {/* ANALYTICS */}

        <NavLink
          to="/creator/analytics"
          className={getLinkClass}
        >
          <span>📊</span>
          <span>Analytics</span>
        </NavLink>


        {/* CONTENT */}

        <NavLink
          to="/creator/content"
          className={getLinkClass}
        >
          <span>🎥</span>
          <span>My Content</span>
        </NavLink>


        {/* AUDIENCE */}

        <NavLink
          to="/creator/audience"
          className={getLinkClass}
        >
          <span>👥</span>
          <span>Audience</span>
        </NavLink>


        {/* EARNINGS */}

        <NavLink
          to="/creator/earnings"
          className={getLinkClass}
        >
          <span>💰</span>
          <span>Earnings</span>
        </NavLink>


        {/* CAMPAIGNS */}

        <NavLink
          to="/creator/campaigns"
          className={getLinkClass}
        >
          <span>📅</span>
          <span>Campaigns</span>
        </NavLink>


        {/* NOTIFICATIONS */}

        <NavLink
          to="/creator/notifications"
          className={getLinkClass}
        >
          <span>🔔</span>
          <span>Notifications</span>
        </NavLink>


        {/* PROFILE */}

        <NavLink
          to="/creator/profile"
          className={getLinkClass}
        >
          <span>👤</span>
          <span>Profile</span>
        </NavLink>


        {/* SETTINGS */}

        <NavLink
          to="/creator/settings"
          className={getLinkClass}
        >
          <span>⚙️</span>
          <span>Settings</span>
        </NavLink>

      </nav>


      {/* LOGOUT */}

      <button
        type="button"
        className="sidebar-logout"
        onClick={handleLogout}
      >
        <span>🚪</span>
        <span>Logout</span>
      </button>

    </aside>
  );
}