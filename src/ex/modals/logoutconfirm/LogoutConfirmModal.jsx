import "./LogoutConfirmModal.css";

export default function LogoutConfirmModal({
  open,
  userName = "Nguyễn Thị An",
  userRole = "Giáo viên can thiệp",
  avatar = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&h=240&fit=crop&crop=face",
  onCancel,
  onConfirm,
}) {
  if (!open) return null;

  return (
    <div className="logout-modal-overlay" role="presentation" onClick={onCancel}>
      <section
        className="logout-modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="logout-modal-close"
          aria-label="Đóng"
          onClick={onCancel}
        >
          <i className="bi bi-x-lg" />
        </button>

        <div className="logout-modal-icon">
          <i className="bi bi-box-arrow-right" />
        </div>

        <div className="logout-user-box">
          <img src={avatar} alt={userName} />
          <div>
            <span>Tài khoản hiện tại</span>
            <strong>{userName}</strong>
            <p>{userRole}</p>
          </div>
        </div>

        <div className="logout-modal-content">
          <span>Xác nhận đăng xuất</span>
          <h3 id="logout-modal-title">Bạn có chắc chắn muốn đăng xuất?</h3>
          <p>
            Sau khi đăng xuất, cô cần đăng nhập lại để tiếp tục xem hồ sơ trẻ,
            kế hoạch can thiệp và báo cáo tháng.
          </p>
        </div>

        <div className="logout-modal-actions">
          <button type="button" className="logout-cancel-btn" onClick={onCancel}>
            Hủy
          </button>
          <button type="button" className="logout-confirm-btn" onClick={onConfirm}>
            <i className="bi bi-check2-circle" />
            Xác nhận đăng xuất
          </button>
        </div>
      </section>
    </div>
  );
}
