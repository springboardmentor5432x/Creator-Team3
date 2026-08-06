import React from 'react';

export default function NotificationsPanel({ 
  notifications = [], 
  onMarkAsRead, 
  onMarkAllAsRead, 
  onClearAll, 
  onClose 
}) {
  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type) => {
    switch (type) {
      case 'alert':
        return (
          <svg className="notif-type-icon alert" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        );
      case 'milestone':
        return (
          <svg className="notif-type-icon milestone" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        );
      case 'system':
      default:
        return (
          <svg className="notif-type-icon system" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        );
    }
  };

  return (
    <div className="notif-panel-overlay" onClick={onClose}>
      <div className="notif-panel-card" onClick={(e) => e.stopPropagation()}>
        <style>{`
          .notif-panel-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 999;
          }

          .notif-panel-card {
            position: absolute;
            top: 70px;
            right: 20px;
            width: 360px;
            max-height: 480px;
            background: var(--bg-secondary);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid var(--border-color);
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            animation: slideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1);
            font-family: 'Inter', sans-serif;
            color: var(--text-primary);
          }

          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .notif-header {
            padding: 1.25rem;
            border-bottom: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .notif-header-title {
            font-size: 1rem;
            font-weight: 700;
            margin: 0;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .notif-badge {
            background: var(--accent-secondary);
            color: #ffffff;
            font-size: 0.75rem;
            font-weight: 700;
            padding: 2px 8px;
            border-radius: 9999px;
          }

          .notif-mark-read-btn {
            background: transparent;
            border: none;
            color: var(--accent-primary);
            font-size: 0.8125rem;
            font-weight: 600;
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 6px;
            transition: all 0.2s ease;
          }

          .notif-mark-read-btn:hover {
            background: var(--accent-glow);
          }

          .notif-list {
            overflow-y: auto;
            flex: 1;
            max-height: 340px;
          }

          /* Scrollbar styling */
          .notif-list::-webkit-scrollbar {
            width: 6px;
          }
          .notif-list::-webkit-scrollbar-track {
            background: transparent;
          }
          .notif-list::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 999px;
          }
          .notif-list::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.2);
          }

          .notif-item {
            padding: 1rem 1.25rem;
            border-bottom: 1px solid var(--border-color);
            display: flex;
            gap: 12px;
            cursor: pointer;
            transition: all 0.2s ease;
            position: relative;
          }

          .notif-item:hover {
            background: rgba(255, 255, 255, 0.02);
          }

          .notif-item.unread {
            background: var(--accent-glow);
          }

          .notif-item.unread::after {
            content: '';
            position: absolute;
            top: 1.25rem;
            right: 1.25rem;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--accent-secondary);
          }

          .notif-icon-container {
            width: 36px;
            height: 36px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            background: var(--input-bg);
            border: 1px solid var(--border-color);
          }

          .notif-type-icon {
            width: 18px;
            height: 18px;
          }

          .notif-type-icon.alert {
            color: #ef4444;
          }

          .notif-type-icon.milestone {
            color: #8b5cf6;
          }

          .notif-type-icon.system {
            color: #3b82f6;
          }

          .notif-body {
            display: flex;
            flex-direction: column;
            gap: 4px;
            padding-right: 12px;
          }

          .notif-title {
            font-size: 0.875rem;
            font-weight: 600;
            margin: 0;
            color: var(--text-primary);
          }

          .notif-msg {
            font-size: 0.8125rem;
            margin: 0;
            color: var(--text-secondary);
            line-height: 1.4;
          }

          .notif-empty {
            padding: 3rem 1.5rem;
            text-align: center;
            color: var(--text-secondary);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
          }

          .notif-empty-icon {
            width: 48px;
            height: 48px;
            opacity: 0.4;
            color: var(--text-secondary);
          }

          .notif-footer {
            padding: 0.75rem 1.25rem;
            border-top: 1px solid var(--border-color);
            display: flex;
            justify-content: center;
          }

          .notif-clear-btn {
            background: transparent;
            border: none;
            color: var(--text-secondary);
            font-size: 0.8125rem;
            font-weight: 600;
            cursor: pointer;
            padding: 6px 12px;
            border-radius: 6px;
            transition: all 0.2s ease;
            width: 100%;
          }

          .notif-clear-btn:hover {
            background: rgba(255, 255, 255, 0.03);
            color: var(--text-primary);
          }
        `}</style>

        <div className="notif-header">
          <h3 className="notif-header-title">
            Notifications
            {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
          </h3>
          {unreadCount > 0 && (
            <button className="notif-mark-read-btn" onClick={onMarkAllAsRead}>
              Mark all as read
            </button>
          )}
        </div>

        <div className="notif-list">
          {notifications.length === 0 ? (
            <div className="notif-empty">
              <svg className="notif-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span>All caught up! 🎉</span>
            </div>
          ) : (
            notifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`notif-item ${!notif.read ? 'unread' : ''}`}
                onClick={() => !notif.read && onMarkAsRead(notif.id)}
              >
                <div className="notif-icon-container">
                  {getIcon(notif.type)}
                </div>
                <div className="notif-body">
                  <h4 className="notif-title">{notif.title}</h4>
                  <p className="notif-msg">{notif.message}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {notifications.length > 0 && (
          <div className="notif-footer">
            <button className="notif-clear-btn" onClick={onClearAll}>
              Clear all notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
