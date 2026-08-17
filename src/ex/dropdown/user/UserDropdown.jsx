import { useEffect, useRef } from "react";
import "./UserDropdown.css";

const roleMap = {
  admin: "Quản trị viên",
  director: "Giám đốc",
  manager: "Quản lý chuyên môn",
  teacher: "Giáo viên",
  parent: "Phụ huynh",
};

export default function UserDropdown({
  show = false,
  onClose = () => {},
  user = {},
  onProfile = () => {},
  onChangePassword = () => {},
  onSetting = () => {},
  onLogout = () => {},
   onHelp = () => {},
}) {
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!show) return;

    const handleClickOutside = (event) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(event.target)) onClose();
    };

    const handleEsc = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEsc);
    };
  }, [show, onClose]);

  if (!show) return null;

  const displayName = user.fullName || user.name || "Cô My Ny";
  const role = roleMap[user.role] || user.position || "Giáo viên";
  const email = user.email || "ankhang.edu@gmail.com";
  const avatar = user.avatar || "https://i.pravatar.cc/150?img=47";

  return (
    <div className="ak-user-layer">
      <section
        ref={dropdownRef}
        className="ak-user-dropdown"
        role="dialog"
        aria-label="Tài khoản người dùng"
      >
        <div className="ak-user-card-bg">
          <span className="ak-user-star ak-user-star-1">✦</span>
          <span className="ak-user-star ak-user-star-2">✧</span>
          <span className="ak-user-star ak-user-star-3">✦</span>
        </div>

        <button className="ak-user-close" type="button" onClick={onClose} aria-label="Đóng">
          <i className="bi bi-x-lg" />
        </button>

        <header className="ak-user-header">
          <div className="ak-user-avatar-wrap">
            <img src={avatar} alt={displayName} className="ak-user-avatar" />
            <span className="ak-user-online" />
          </div>

          <div className="ak-user-info">
            <h3>{displayName}</h3>
            <p>{role}</p>
            <span>{email}</span>
          </div>
        </header>

        <div className="ak-user-stat-grid">
          <div>
            <strong>{user.planCount ?? 12}</strong>
            <span>Kế hoạch</span>
          </div>
          <div>
            <strong>{user.reportCount ?? 28}</strong>
            <span>Báo cáo</span>
          </div>
          <div>
            <strong>{user.childCount ?? 8}</strong>
            <span>Trẻ phụ trách</span>
          </div>
        </div>

        <nav className="ak-user-menu">
          <button type="button" onClick={onProfile}>
            <span className="ak-user-menu-icon ak-user-blue"><i className="bi bi-person-badge" /></span>
            <span>
              <strong>Thông tin cá nhân</strong>
              <em>Xem và chỉnh sửa hồ sơ</em>
            </span>
            <i className="bi bi-chevron-right ak-user-arrow" />
          </button>

          <button type="button" onClick={onChangePassword}>
            <span className="ak-user-menu-icon ak-user-green"><i className="bi bi-shield-lock" /></span>
            <span>
              <strong>Đổi mật khẩu</strong>
              <em>Bảo mật tài khoản đăng nhập</em>
            </span>
            <i className="bi bi-chevron-right ak-user-arrow" />
          </button>

          <button type="button" onClick={onSetting}>
            <span className="ak-user-menu-icon ak-user-purple"><i className="bi bi-gear" /></span>
            <span>
              <strong>Cài đặt</strong>
              <em>Tùy chỉnh giao diện hệ thống</em>
            </span>
            <i className="bi bi-chevron-right ak-user-arrow" />
          </button>
        </nav>

        <footer className="ak-user-footer">
          <button type="button" className="ak-user-logout" onClick={onLogout}>
            <i className="bi bi-box-arrow-right" />
            Đăng xuất
          </button>
        </footer>
      </section>
    </div>
  );
}
