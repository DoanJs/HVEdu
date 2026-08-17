import { useEffect, useMemo, useRef } from 'react';
import './NotificationDropdown.css';
type NotificationItem = {
  id: number;
  type: "report" | "plan" | "comment" | "calendar" | "upload";
  title: string;
  description: string;
  time: string;
  unread: boolean;
};

type NotificationDropdownProps = {
  show?: boolean;
  onClose?: () => void;
  notifications?: NotificationItem[];
  onReadAll?: () => void;
  onItemClick?: (item: NotificationItem) => void;
};

const typeMap = {
  report: {
    icon: 'bi-calendar2-check',
    className: 'ak-noti-blue',
  },
  plan: {
    icon: 'bi-check2-circle',
    className: 'ak-noti-green',
  },
  comment: {
    icon: 'bi-chat-left-text-fill',
    className: 'ak-noti-yellow',
  },
  calendar: {
    icon: 'bi-calendar-event',
    className: 'ak-noti-purple',
  },
  upload: {
    icon: 'bi-cloud-arrow-up',
    className: 'ak-noti-sky',
  },
};

export default function NotificationDropdown({
  show = false,
  onClose = () => {},
  notifications = [],
  onReadAll = () => {},
  onItemClick = () => {},
}: NotificationDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const unreadCount = useMemo(
    () => notifications.filter((item) => item.unread).length,
    [notifications]
  );

  useEffect(() => {
     if (!show) return;

    const handleClickOutside = (event: any) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEsc = (event: any) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleEsc);
    };
  }, [show, onClose]);



  if (!show) return null;

  return (
    <div className="ak-notification-layer">
      <section
        ref={dropdownRef}
        className="ak-notification-dropdown"
        role="dialog"
        aria-label="Thông báo"
      >
        <header className="ak-notification-header">
          <div>
            <h3>Thông báo</h3>
            {unreadCount > 0 && <span>{unreadCount} thông báo mới</span>}
          </div>

          <button type="button" onClick={onReadAll}>
            Đánh dấu tất cả đã đọc
          </button>
        </header>

        <div className="ak-notification-list">
          {notifications.length === 0 ? (
            <div className="ak-notification-empty">
              <i className="bi bi-bell" />
              <p>Chưa có thông báo mới</p>
              <span>Các thông báo quan trọng sẽ hiển thị tại đây.</span>
            </div>
          ) : (
            notifications.map((item) => {
              const type = typeMap[item.type] || typeMap.report;

              return (
                <button
                  key={item.id}
                  type="button"
                  className={`ak-notification-item ${item.unread ? 'is-unread' : ''}`}
                  onClick={() => onItemClick(item)}
                >
                  <span className={`ak-notification-icon ${type.className}`}>
                    <i className={`bi ${type.icon}`} />
                  </span>

                  <span className="ak-notification-content">
                    <strong>{item.title}</strong>
                    <em>{item.description}</em>
                    <small>{item.time}</small>
                  </span>

                  {item.unread && <span className="ak-notification-dot" />}
                </button>
              );
            })
          )}
        </div>

        <footer className="ak-notification-footer">
          {/* <button type="button" onClick={onViewAll}> */}
          <button type="button">
            <span>Xem tất cả thông báo</span>
            <i className="bi bi-chevron-right" />
          </button>
        </footer>
      </section>
    </div>
  );
}
