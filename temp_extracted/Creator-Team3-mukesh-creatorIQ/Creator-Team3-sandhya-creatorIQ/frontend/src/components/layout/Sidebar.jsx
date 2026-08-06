import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside className="creator-sidebar">

      {/* PROFILE */}
      <div className="sidebar-profile">

        <div className="creator-avatar">
          CR
        </div>

        <h3>Creator</h3>

        <p>Verified Creator</p>

      </div>

      {/* MENU */}
      <nav className="sidebar-menu">

        <NavLink
          to="/creator"
          className="sidebar-link"
        >
          🏠
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/analytics"
          className="sidebar-link"
        >
          📊
          <span>Analytics</span>
        </NavLink>

        <NavLink
          to="/content"
          className="sidebar-link"
        >
          🎥
          <span>My Content</span>
        </NavLink>

        <NavLink
          to="/audience"
          className="sidebar-link"
        >
          👥
          <span>Audience</span>
        </NavLink>

        <NavLink
          to="/earnings"
          className="sidebar-link"
        >
          💰
          <span>Earnings</span>
        </NavLink>

        <NavLink
          to="/campaigns"
          className="sidebar-link"
        >
          📅
          <span>Campaigns</span>
        </NavLink>

        <NavLink
          to="/profile"
          className="sidebar-link"
        >
          👤
          <span>Profile</span>
        </NavLink>

        <NavLink
          to="/settings"
          className="sidebar-link"
        >
          ⚙️
          <span>Settings</span>
        </NavLink>

      </nav>

      {/* LOGOUT */}
      <button
        className="sidebar-logout"
        onClick={handleLogout}
      >
        🚪 Logout
      </button>

    </aside>
  );
}