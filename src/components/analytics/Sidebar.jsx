import React from "react";

export default function Sidebar({
  activeTab,
  setActiveTab,
  onLogout
}) {

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "analytics", label: "Analytics", icon: "📈" },
    { id: "campaigns", label: "Campaigns", icon: "📢" },
    { id: "reports", label: "Reports", icon: "📄" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "settings", label: "Settings", icon: "⚙️" }
  ];

  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        CreatorIQ
      </div>

      <nav className="sidebar-menu">

        {menuItems.map(item => (
          <button
            key={item.id}
            className={`sidebar-item ${
              activeTab === item.id ? "active" : ""
            }`}
            onClick={() => setActiveTab(item.id)}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}

      </nav>

      <button
        className="logout-sidebar"
        onClick={onLogout}
      >
        🚪 Logout
      </button>

    </aside>
  );
}