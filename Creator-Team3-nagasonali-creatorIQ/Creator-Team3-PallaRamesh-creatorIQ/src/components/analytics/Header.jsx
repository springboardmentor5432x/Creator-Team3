import React from "react";

export default function Header({
    title,
    subtitle,
    notifications,
    showNotifPanel,
    setShowNotifPanel,
    onLogout,
    activeTab,
    setActiveTab,
    userRole
}) {

    return (
        <header className="dashboard-header">

            <div className="dashboard-title-group">
                <h1 className="dashboard-title">{title}</h1>
                <p className="dashboard-subtitle">{subtitle}</p>
            </div>

            <div className="header-actions">

                <div className="nav-tabs">

                    <button
                        className={`nav-tab-btn ${activeTab === "dashboard" ? "active" : ""}`}
                        onClick={() => setActiveTab("dashboard")}
                    >
                        Dashboard
                    </button>

                    <button
                        className={`nav-tab-btn ${activeTab === "settings" ? "active" : ""}`}
                        onClick={() => setActiveTab("settings")}
                    >
                        Settings
                    </button>

                    {userRole === "Admin" && (
                        <button
                            className={`nav-tab-btn ${activeTab === "admin" ? "active" : ""}`}
                            onClick={() => setActiveTab("admin")}
                        >
                            Admin Panel
                        </button>
                    )}

                </div>

                <button
                    className="notif-bell-btn"
                    onClick={() => setShowNotifPanel(!showNotifPanel)}
                >
                    🔔

                    {notifications.filter(n => !n.read).length > 0 && (

                        <span className="bell-badge">
                            {notifications.filter(n => !n.read).length}
                        </span>

                    )}

                </button>

                <button
                    className="logout-btn"
                    onClick={onLogout}
                >
                    Logout
                </button>

            </div>

        </header>
    );
}