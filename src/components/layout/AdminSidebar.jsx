import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    navigate("/login", { replace: true });
  };

  return (
    <aside className="brand-sidebar">
      {/* PROFILE */}
      <div className="brand-profile">
        <div className="brand-avatar">AD</div>
        <h3>Platform Admin</h3>
        <p>Administrator</p>
      </div>

      {/* MENU */}
      <nav className="brand-menu">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            isActive ? "brand-menu-item active" : "brand-menu-item"
          }
        >
          <span>🏠</span> <span>System Panel</span>
        </NavLink>

        <NavLink
          to="/admin/settings"
          className={({ isActive }) =>
            isActive ? "brand-menu-item active" : "brand-menu-item"
          }
        >
          <span>⚙️</span> <span>Settings</span>
        </NavLink>
      </nav>

      {/* LOGOUT BUTTON */}
      <button type="button" className="brand-logout" onClick={handleLogout}>
        <span>🚪</span> <span>Logout</span>
      </button>
    </aside>
  );
}
