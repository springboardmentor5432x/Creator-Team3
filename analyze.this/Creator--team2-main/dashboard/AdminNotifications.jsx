import React, { useMemo, useState } from "react";

import {
  Bell,
  Check,
  CheckCheck,
  Eye,
  Trash2,
  Search,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  Clock,
  AlertTriangle,
  ShieldCheck,
  Server,
  FileText,
  Megaphone,
  Sparkles,
  Briefcase,
  UserPlus,
  CheckCircle2,
} from "lucide-react";

/* =========================================================
   ROLE BASED NOTIFICATION DATA
========================================================= */

const roleNotificationConfig = {
  Creator: {
    tag: "Creator Dashboard",

    title: "Notification Center",

    subtitle:
      "Stay updated with your content, audience, revenue, growth and opportunities.",

    filters: [
      "All",
      "Content",
      "Audience",
      "Revenue",
      "Growth",
      "System",
      "Opportunity",
    ],

    notifications: [
      {
        id: 1,
        type: "Content",
        title: "Your latest video is performing well",
        message:
          "Your content received 24% more views than your previous video.",
        time: "10 min ago",
        unread: true,
        icon: TrendingUp,
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
      },

      {
        id: 2,
        type: "Audience",
        title: "New follower milestone",
        message:
          "You reached 125K followers. Keep growing your audience!",
        time: "1 hour ago",
        unread: true,
        icon: Users,
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
      },

      {
        id: 3,
        type: "Revenue",
        title: "Revenue updated",
        message:
          "Your estimated monthly revenue has increased by 15.7%.",
        time: "2 hours ago",
        unread: false,
        icon: DollarSign,
        iconBg: "bg-amber-100",
        iconColor: "text-amber-600",
      },

      {
        id: 4,
        type: "Growth",
        title: "Engagement is improving",
        message:
          "Your engagement rate increased compared with the previous period.",
        time: "Yesterday",
        unread: false,
        icon: Activity,
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
      },

      {
        id: 5,
        type: "System",
        title: "Best time to post today",
        message:
          "Your audience is most active between 8 PM and 10 PM today.",
        time: "Yesterday",
        unread: false,
        icon: Clock,
        iconBg: "bg-indigo-100",
        iconColor: "text-indigo-600",
      },

      {
        id: 6,
        type: "Opportunity",
        title: "New sponsorship opportunity",
        message:
          "A brand collaboration opportunity is available for your profile.",
        time: "2 days ago",
        unread: true,
        icon: Briefcase,
        iconBg: "bg-pink-100",
        iconColor: "text-pink-600",
      },
    ],
  },

  /* ===================================================== */

  Agency: {
    tag: "Agency Workspace",

    title: "Agency Notifications",

    subtitle:
      "Monitor creators, campaigns, deadlines, revenue and business performance.",

    filters: [
      "All",
      "Creators",
      "Campaigns",
      "Revenue",
      "Performance",
      "Deadlines",
    ],

    notifications: [
      {
        id: 1,
        type: "Creators",
        title: "Creator performance updated",
        message:
          "3 creators recorded significant audience growth this week.",
        time: "15 min ago",
        unread: true,
        icon: Users,
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
      },

      {
        id: 2,
        type: "Campaigns",
        title: "Campaign performance improved",
        message:
          "Summer Campaign engagement increased by 21% this week.",
        time: "45 min ago",
        unread: true,
        icon: Megaphone,
        iconBg: "bg-indigo-100",
        iconColor: "text-indigo-600",
      },

      {
        id: 3,
        type: "Deadlines",
        title: "Campaign deadline approaching",
        message:
          "The ABC Brand campaign requires approval before tomorrow.",
        time: "1 hour ago",
        unread: true,
        icon: Clock,
        iconBg: "bg-orange-100",
        iconColor: "text-orange-600",
      },

      {
        id: 4,
        type: "Performance",
        title: "Creator engagement increased",
        message:
          "Emma's engagement rate increased by 18.4% compared with last week.",
        time: "3 hours ago",
        unread: false,
        icon: TrendingUp,
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
      },

      {
        id: 5,
        type: "Revenue",
        title: "Commission revenue updated",
        message:
          "Your agency commission has been updated for this month.",
        time: "Yesterday",
        unread: false,
        icon: DollarSign,
        iconBg: "bg-amber-100",
        iconColor: "text-amber-600",
      },
    ],
  },

  /* ===================================================== */

  "Marketing Team": {
    tag: "Marketing Hub",

    title: "Marketing Notifications",

    subtitle:
      "Track campaigns, audience insights, ROI, performance and budget updates.",

    filters: [
      "All",
      "Campaigns",
      "Audience",
      "Performance",
      "Budget",
    ],

    notifications: [
      {
        id: 1,
        type: "Campaigns",
        title: "Campaign performance alert",
        message:
          "Your latest campaign exceeded its engagement target by 21%.",
        time: "20 min ago",
        unread: true,
        icon: Megaphone,
        iconBg: "bg-indigo-100",
        iconColor: "text-indigo-600",
      },

      {
        id: 2,
        type: "Audience",
        title: "Audience growth detected",
        message:
          "Target audience growth increased by 12.8% this week.",
        time: "1 hour ago",
        unread: true,
        icon: Users,
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
      },

      {
        id: 3,
        type: "Performance",
        title: "Marketing ROI improved",
        message:
          "Campaign ROI improved compared with the previous period.",
        time: "3 hours ago",
        unread: false,
        icon: TrendingUp,
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
      },

      {
        id: 4,
        type: "Budget",
        title: "Campaign budget alert",
        message:
          "One campaign is approaching its allocated budget limit.",
        time: "Yesterday",
        unread: true,
        icon: AlertTriangle,
        iconBg: "bg-red-100",
        iconColor: "text-red-600",
      },

      {
        id: 5,
        type: "Campaigns",
        title: "Campaign approval required",
        message:
          "A new campaign is waiting for marketing team approval.",
        time: "Yesterday",
        unread: false,
        icon: CheckCircle2,
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
      },
    ],
  },

  /* ===================================================== */

  Administrator: {
    tag: "Platform Administration",

    title: "Admin Notifications",

    subtitle:
      "Monitor security alerts, users, system health, reports and platform activity.",

    filters: [
      "All",
      "Security",
      "Users",
      "System",
      "Reports",
      "Activity",
    ],

    notifications: [
      {
        id: 1,
        type: "Security",
        title: "Suspicious login detected",
        message:
          "A login attempt was detected from an unfamiliar device.",
        time: "5 min ago",
        unread: true,
        icon: ShieldCheck,
        iconBg: "bg-red-100",
        iconColor: "text-red-600",
      },

      {
        id: 2,
        type: "Users",
        title: "New creator registered",
        message:
          "A new creator account is waiting for verification.",
        time: "20 min ago",
        unread: true,
        icon: UserPlus,
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
      },

      {
        id: 3,
        type: "System",
        title: "System backup completed",
        message:
          "Scheduled database backup completed successfully.",
        time: "1 hour ago",
        unread: false,
        icon: Server,
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
      },

      {
        id: 4,
        type: "Activity",
        title: "High platform activity",
        message:
          "Platform traffic increased by 28% compared with yesterday.",
        time: "2 hours ago",
        unread: true,
        icon: Activity,
        iconBg: "bg-orange-100",
        iconColor: "text-orange-600",
      },

      {
        id: 5,
        type: "Security",
        title: "Security scan completed",
        message:
          "No critical vulnerabilities were found in the latest scan.",
        time: "4 hours ago",
        unread: false,
        icon: ShieldCheck,
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
      },

      {
        id: 6,
        type: "Reports",
        title: "Monthly platform report ready",
        message:
          "The latest platform performance report is now available.",
        time: "Yesterday",
        unread: false,
        icon: FileText,
        iconBg: "bg-indigo-100",
        iconColor: "text-indigo-600",
      },
    ],
  },
};

/* =========================================================
   COMPONENT
========================================================= */

function AdminNotifications() {
  const userRole =
    localStorage.getItem("userRole") || "Creator";

  const currentConfig =
    roleNotificationConfig[userRole] ||
    roleNotificationConfig.Creator;

  const [notifications, setNotifications] = useState(
    currentConfig.notifications
  );

  const [selectedFilter, setSelectedFilter] =
    useState("All");

  const [searchText, setSearchText] =
    useState("");

  /* =======================================================
     FILTER + SEARCH
  ======================================================= */

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      const matchesFilter =
        selectedFilter === "All" ||
        notification.type === selectedFilter;

      const search =
        searchText.trim().toLowerCase();

      const matchesSearch =
        !search ||
        notification.title
          .toLowerCase()
          .includes(search) ||
        notification.message
          .toLowerCase()
          .includes(search) ||
        notification.type
          .toLowerCase()
          .includes(search);

      return matchesFilter && matchesSearch;
    });
  }, [
    notifications,
    selectedFilter,
    searchText,
  ]);

  /* =======================================================
     COUNTS
  ======================================================= */

  const unreadCount = notifications.filter(
    (notification) => notification.unread
  ).length;

  const readCount =
    notifications.length - unreadCount;

  /* =======================================================
     MARK SINGLE AS READ
  ======================================================= */

  const markAsRead = (id) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              unread: false,
            }
          : notification
      )
    );
  };

  /* =======================================================
     MARK ALL AS READ
  ======================================================= */

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        unread: false,
      }))
    );
  };

  /* =======================================================
     DELETE
  ======================================================= */

  const deleteNotification = (id) => {
    setNotifications((current) =>
      current.filter(
        (notification) =>
          notification.id !== id
      )
    );
  };

  /* =======================================================
     ICON
  ======================================================= */

  const renderNotificationIcon = (
    notification
  ) => {
    const Icon =
      notification.icon || Bell;

    return (
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
          notification.iconBg ||
          "bg-gray-100"
        } ${
          notification.iconColor ||
          "text-gray-600"
        }`}
      >
        <Icon size={22} strokeWidth={2} />
      </div>
    );
  };

  /* =======================================================
     JSX
  ======================================================= */

  return (
    <div className="notification-page">
      <style>{`

        /* ============================================
           MAIN PAGE
        ============================================ */

        .notification-page {
          width: 100%;
          color: #f8fafc;
        }

        .notification-page * {
          box-sizing: border-box;
        }

        /* ============================================
           HEADER
        ============================================ */

        .notification-header-tag {
          color: #172033 !important;
          background: #dbeafe !important;
          font-weight: 700 !important;
        }

        .notification-unread-badge {
          color: #ffffff !important;
          background: #fca5a5 !important;
          font-weight: 700 !important;
        }

        .notification-page h1,
        .notification-page h2,
        .notification-page h3 {
          color: #f8fafc !important;
        }

        .notification-page .notification-title {
          color: #ffffff !important;
          font-weight: 800 !important;
        }

        .notification-subtitle {
          color: #b9c9e8 !important;
        }

        /* ============================================
           STAT CARDS
        ============================================ */

        .notification-stat-card {
          border-radius: 16px;
          min-height: 105px;
        }

        .notification-stat-title {
          color: #172033 !important;
          font-weight: 700 !important;
        }

        .notification-stat-number {
          color: #172033 !important;
          font-size: 28px;
          font-weight: 800 !important;
        }

        /* ============================================
           SEARCH
        ============================================ */

        .notification-search-input {
          width: 100%;
          color: #f8fafc !important;
          background: #1e2b40 !important;
          border: 1px solid #34445e !important;
          outline: none !important;
        }

        .notification-search-input:focus {
          border-color: #60a5fa !important;
          box-shadow:
            0 0 0 2px
            rgba(96,165,250,0.15) !important;
        }

        .notification-search-input::placeholder {
          color: #9fb0cc !important;
          opacity: 1 !important;
        }

        /* ============================================
           FILTERS
        ============================================ */

        .notification-filter {
          color: #c7d5ed !important;
          background: #1e2b40 !important;
          border: 1px solid transparent !important;
          font-weight: 700 !important;
        }

        .notification-filter:hover {
          color: #ffffff !important;
          background: #2b3b55 !important;
        }

        .notification-filter.active {
          color: #ffffff !important;
          background: #2563eb !important;
          border-color: #3b82f6 !important;
        }

        /* ============================================
           NOTIFICATION CARD
        ============================================ */

        .notification-card {
          background: #17243a !important;
          border: 1px solid #34445e !important;
        }

        .notification-card:hover {
          border-color: #4a5d7c !important;
          background: #1a2941 !important;
        }

        .notification-card-title {
          color: #ffffff !important;
          font-weight: 800 !important;
        }

        .notification-card-message {
          color: #bfd0ed !important;
        }

        .notification-card-time {
          color: #b7c8e5 !important;
        }

        .notification-category {
          color: #bcd0f2 !important;
          background: #24344e !important;
          font-weight: 700 !important;
        }

        /* ============================================
           UNREAD DOT
        ============================================ */

        .notification-unread-dot {
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: #3b82f6 !important;
          display: inline-block;
        }

        /* ============================================
           MARK READ
        ============================================ */

        .notification-mark-read {
          color: #172033 !important;
          background: #eff6ff !important;
          font-weight: 700 !important;
          border: none !important;
        }

        .notification-mark-read:hover {
          color: #ffffff !important;
          background: #2563eb !important;
        }

        .notification-read-text {
          color: #b7c8e5 !important;
          font-weight: 600 !important;
        }

        /* ============================================
           DELETE
        ============================================ */

        .notification-delete {
          color: #9fb0ca !important;
          background: transparent !important;
        }

        .notification-delete:hover {
          color: #f87171 !important;
          background: rgba(248,113,113,0.10) !important;
        }

        /* ============================================
           MARK ALL
        ============================================ */

        .notification-mark-all {
          color: #ffffff !important;
          background: #2563eb !important;
          font-weight: 700 !important;
          border: none !important;
        }

        .notification-mark-all:hover {
          color: #ffffff !important;
          background: #1d4ed8 !important;
        }

        /* ============================================
           EMPTY STATE
        ============================================ */

        .notification-empty {
          color: #c4d2e8 !important;
        }

        .notification-empty-title {
          color: #ffffff !important;
          font-weight: 700 !important;
        }

        /* ============================================
           MOBILE
        ============================================ */

        @media (max-width: 768px) {
          .notification-stat-number {
            font-size: 24px;
          }

          .notification-card {
            padding: 16px !important;
          }
        }

      `}</style>

      {/* =================================================
          MAIN CONTAINER
      ================================================= */}

      <div className="space-y-7">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

          <div>

            <div className="flex items-center gap-2 mb-3">

              <span
                className="notification-header-tag px-3 py-1 rounded-full text-xs"
              >
                {currentConfig.tag}
              </span>

              {unreadCount > 0 && (
                <span
                  className="notification-unread-badge px-3 py-1 rounded-full text-xs"
                >
                  {unreadCount} unread
                </span>
              )}

            </div>

            <h1
              className="notification-title text-3xl font-bold"
            >
              {currentConfig.title}
            </h1>

            <p
              className="notification-subtitle mt-2 text-sm md:text-base"
            >
              {currentConfig.subtitle}
            </p>

          </div>

          {/* MARK ALL */}

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="notification-mark-all flex items-center justify-center gap-2 px-5 py-3 rounded-xl"
            >
              <CheckCheck size={19} />
              Mark all as read
            </button>
          )}

        </div>

        {/* =================================================
            STAT CARDS
        ================================================= */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* TOTAL */}

          <div
            className="notification-stat-card bg-blue-50 p-5 border border-blue-100 flex items-center justify-between"
          >

            <div>

              <p className="notification-stat-title text-sm">
                Total Notifications
              </p>

              <p className="notification-stat-number mt-2">
                {notifications.length}
              </p>

            </div>

            <Bell
              size={27}
              className="text-blue-700"
            />

          </div>

          {/* UNREAD */}

          <div
            className="notification-stat-card bg-red-50 p-5 border border-red-100 flex items-center justify-between"
          >

            <div>

              <p className="notification-stat-title text-sm">
                Unread
              </p>

              <p className="notification-stat-number mt-2">
                {unreadCount}
              </p>

            </div>

            <Eye
              size={27}
              className="text-red-600"
            />

          </div>

          {/* READ */}

          <div
            className="notification-stat-card bg-green-50 p-5 border border-green-100 flex items-center justify-between"
          >

            <div>

              <p className="notification-stat-title text-sm">
                Read
              </p>

              <p className="notification-stat-number mt-2">
                {readCount}
              </p>

            </div>

            <CheckCircle2
              size={27}
              className="text-green-700"
            />

          </div>

        </div>

        {/* =================================================
            SEARCH + FILTERS
        ================================================= */}

        <div
          className="rounded-2xl border border-[#34445e] bg-[#17243a] p-3 md:p-4"
        >

          <div className="flex flex-col xl:flex-row gap-3">

            {/* SEARCH */}

            <div className="relative flex-1">

              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={searchText}
                onChange={(e) =>
                  setSearchText(e.target.value)
                }
                placeholder="Search notifications..."
                className="notification-search-input rounded-xl pl-11 pr-4 py-3 text-sm"
              />

            </div>

            {/* FILTERS */}

            <div className="flex gap-2 overflow-x-auto pb-1">

              {currentConfig.filters.map(
                (filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() =>
                      setSelectedFilter(filter)
                    }
                    className={`notification-filter shrink-0 px-4 py-3 rounded-xl text-sm ${
                      selectedFilter === filter
                        ? "active"
                        : ""
                    }`}
                  >
                    {filter}
                  </button>
                )
              )}

            </div>

          </div>

        </div>

        {/* =================================================
            NOTIFICATION LIST
        ================================================= */}

        <div className="space-y-3">

          {filteredNotifications.length === 0 ? (

            <div
              className="notification-empty text-center py-16 border border-[#34445e] rounded-2xl bg-[#17243a]"
            >

              <Bell
                size={42}
                className="mx-auto mb-4 opacity-60"
              />

              <h3
                className="notification-empty-title text-lg"
              >
                No notifications found
              </h3>

              <p className="mt-2 text-sm">
                Try another search or filter.
              </p>

            </div>

          ) : (

            filteredNotifications.map(
              (notification) => (

                <div
                  key={notification.id}
                  className={`notification-card rounded-2xl p-5 md:p-6 transition-all ${
                    notification.unread
                      ? "border-l-4 border-l-blue-500"
                      : ""
                  }`}
                >

                  <div className="flex gap-4">

                    {/* ICON */}

                    {renderNotificationIcon(
                      notification
                    )}

                    {/* CONTENT */}

                    <div className="flex-1 min-w-0">

                      {/* TITLE + TIME */}

                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">

                        <div className="flex items-center gap-2">

                          <h3
                            className="notification-card-title text-base md:text-lg"
                          >
                            {notification.title}
                          </h3>

                          {notification.unread && (
                            <span
                              className="notification-unread-dot"
                              title="Unread"
                            />
                          )}

                        </div>

                        <span
                          className="notification-card-time text-xs md:text-sm shrink-0"
                        >
                          {notification.time}
                        </span>

                      </div>

                      {/* MESSAGE */}

                      <p
                        className="notification-card-message mt-2 text-sm md:text-base"
                      >
                        {notification.message}
                      </p>

                      {/* BOTTOM */}

                      <div className="flex flex-wrap items-center justify-between gap-3 mt-5">

                        <span
                          className="notification-category px-3 py-1 rounded-full text-xs"
                        >
                          {notification.type}
                        </span>

                        <div className="flex items-center gap-2">

                          {/* READ BUTTON */}

                          {notification.unread ? (
                            <button
                              type="button"
                              onClick={() =>
                                markAsRead(
                                  notification.id
                                )
                              }
                              className="notification-mark-read flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
                            >
                              <Eye size={16} />
                              Mark read
                            </button>
                          ) : (
                            <span
                              className="notification-read-text flex items-center gap-1 text-sm px-3 py-2"
                            >
                              <Check size={16} />
                              Read
                            </span>
                          )}

                          {/* DELETE */}

                          <button
                            type="button"
                            onClick={() =>
                              deleteNotification(
                                notification.id
                              )
                            }
                            className="notification-delete p-2 rounded-lg transition"
                            title="Delete notification"
                          >
                            <Trash2 size={18} />
                          </button>

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              )
            )

          )}

        </div>

      </div>

    </div>
  );
}

export default AdminNotifications;