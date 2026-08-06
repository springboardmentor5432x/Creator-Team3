import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function BrandSidebar() {
  const navigate = useNavigate();

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <aside className="brand-sidebar">

      {/* PROFILE */}
      <div className="brand-profile">
        <div className="brand-avatar">
          BA
        </div>

        <h3>Brand Agency</h3>

        <p>Brand Manager</p>
      </div>


      {/* MENU */}
      <nav className="brand-menu">

        <NavLink
          to="/brand"
          end
          className={({ isActive }) =>
            isActive
              ? "brand-menu-item active"
              : "brand-menu-item"
          }
        >
          <span>📊</span>
          <span>Dashboard</span>
        </NavLink>


        <NavLink
          to="/brand/campaigns"
          className={({ isActive }) =>
            isActive
              ? "brand-menu-item active"
              : "brand-menu-item"
          }
        >
          <span>📢</span>
          <span>Campaigns</span>
        </NavLink>


        <NavLink
          to="/brand/creators"
          className={({ isActive }) =>
            isActive
              ? "brand-menu-item active"
              : "brand-menu-item"
          }
        >
          <span>👥</span>
          <span>Creators</span>
        </NavLink>


        <NavLink
          to="/brand/analytics"
          className={({ isActive }) =>
            isActive
              ? "brand-menu-item active"
              : "brand-menu-item"
          }
        >
          <span>📈</span>
          <span>Analytics</span>
        </NavLink>


        <NavLink
          to="/brand/settings"
          className={({ isActive }) =>
            isActive
              ? "brand-menu-item active"
              : "brand-menu-item"
          }
        >
          <span>⚙️</span>
          <span>Settings</span>
        </NavLink>

      </nav>


      {/* LOGOUT BUTTON */}
      <button
        type="button"
        className="brand-logout"
        onClick={handleLogout}
      >
        <span>🚪</span>
        <span>Logout</span>
      </button>

    </aside>
  );
}