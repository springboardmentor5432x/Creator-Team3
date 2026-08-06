import {
  NavLink,
  useNavigate,
} from "react-router-dom";

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

  const getLinkClass = ({
    isActive,
  }) =>
    isActive
      ? "brand-menu-item active"
      : "brand-menu-item";

  return (
    <aside className="brand-sidebar">

      {/* =========================
          PROFILE HEADER
      ========================== */}
      <div className="brand-profile">

        <div className="brand-avatar">
          BA
        </div>

        <h3>
          Brand Agency
        </h3>

        <p>
          Brand Manager
        </p>

      </div>


      {/* =========================
          NAVIGATION MENU
      ========================== */}
      <nav className="brand-menu">

        {/* DASHBOARD */}
        <NavLink
          to="/brand"
          end
          className={getLinkClass}
        >
          <span className="menu-icon">
            📊
          </span>

          <span>
            Dashboard
          </span>
        </NavLink>


        {/* CAMPAIGNS */}
        <NavLink
          to="/brand/campaigns"
          className={getLinkClass}
        >
          <span className="menu-icon">
            📢
          </span>

          <span>
            Campaigns
          </span>
        </NavLink>


        {/* CREATORS */}
        <NavLink
          to="/brand/creators"
          className={getLinkClass}
        >
          <span className="menu-icon">
            👥
          </span>

          <span>
            Creators
          </span>
        </NavLink>


        {/* ANALYTICS */}
        <NavLink
          to="/brand/analytics"
          className={getLinkClass}
        >
          <span className="menu-icon">
            📈
          </span>

          <span>
            Analytics
          </span>
        </NavLink>
        <NavLink
  to="/brand/notifications"
  className={({ isActive }) =>
    isActive
      ? "brand-menu-item active"
      : "brand-menu-item"
  }
>
  <span className="menu-icon">🔔</span>
  <span>Notifications</span>
</NavLink>


        {/* PROFILE */}
        <NavLink
          to="/brand/profile"
          className={getLinkClass}
        >
          <span className="menu-icon">
            👤
          </span>

          <span>
            Profile
          </span>
        </NavLink>


        {/* SETTINGS */}
        <NavLink
          to="/brand/settings"
          className={getLinkClass}
        >
          <span className="menu-icon">
            ⚙️
          </span>

          <span>
            Settings
          </span>
        </NavLink>

      </nav>


      {/* =========================
          LOGOUT
      ========================== */}
      <button
        type="button"
        className="brand-logout"
        onClick={handleLogout}
      >
        <span className="menu-icon">
          🚪
        </span>

        <span>
          Logout
        </span>
      </button>

    </aside>
  );
}