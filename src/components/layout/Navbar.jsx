import React from "react";
import { FiSearch, FiBell, FiMoon } from "react-icons/fi";

export default function Navbar() {
  const email = localStorage.getItem("email") || "user@example.com";
  const role = localStorage.getItem("role") || "Creator";
  const isBrand = role.toLowerCase() === "brand" || role.toLowerCase() === "brand agency";

  return (
    <header className="top-navbar">
      {/* LOGO */}
      <div className="navbar-brand">
        <div className="navbar-logo">C</div>
        <div>
          <h2>CreatorIQ</h2>
          <span>{isBrand ? "Brand Dashboard" : "Creator Dashboard"}</span>
        </div>
      </div>

      {/* SEARCH */}
      <div className="navbar-search">
        <FiSearch className="search-icon" />
        <input
          type="text"
          placeholder={
            isBrand
              ? "Search campaigns, creators..."
              : "Search creators, campaigns..."
          }
        />
      </div>

      {/* RIGHT SIDE */}
      <div className="navbar-actions">
        {/* NOTIFICATION */}
        <button className="navbar-action" title="Notifications">
          <FiBell />
          <span className="notification-dot"></span>
        </button>

        {/* THEME */}
        <button className="navbar-action" title="Theme">
          <FiMoon />
        </button>

        {/* USER */}
        <div className="navbar-user">
          <div className="navbar-avatar">
            {email.substring(0, 2).toUpperCase()}
          </div>
          <div className="navbar-user-info">
            <strong>{email}</strong>
            <span>{role}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
