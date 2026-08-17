import React, { useMemo, useState } from "react";
import "./ChangePasswordPage.css";

const menus = [
  { icon: "bi-house-door", label: "Tổng quan" },
  { icon: "bi-person-badge", label: "Thông tin trẻ" },
  { icon: "bi-bullseye", label: "Ngân hàng mục tiêu" },
  { icon: "bi-calendar2-check", label: "Kế hoạch can thiệp" },
  { icon: "bi-clipboard2-data", label: "Báo cáo can thiệp" },
  { icon: "bi-clock", label: "Chờ duyệt" },
  { icon: "bi-cart3", label: "Giỏ mục tiêu" },
  { icon: "bi-person-gear", label: "Thông tin cá nhân" },
  { icon: "bi-shield-lock", label: "Đổi mật khẩu", active: true },
];

const teacher = {
  fullName: "Nguyễn Thị An",
  position: "Giáo viên can thiệp",
  email: "coan@ankhang.edu.vn",
  avatar:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&h=240&fit=crop&crop=face",
};

const securityNotes = [
  {
    icon: "bi-key",
    title: "Không dùng lại mật khẩu cũ",
    desc: "Nên tạo mật khẩu riêng cho tài khoản trung tâm để bảo vệ dữ liệu trẻ.",
  },
  {
    icon: "bi-shield-check",
    title: "Ưu tiên mật khẩu mạnh",
    desc: "Kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt để tăng độ an toàn.",
  },
  {
    icon: "bi-eye-slash",
    title: "Không chia sẻ tài khoản",
    desc: "Mỗi cô giáo nên dùng tài khoản cá nhân để hệ thống ghi nhận đúng lịch sử hoạt động.",
  },
];

export default function ChangePasswordPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    next: false,
    confirm: false,
  });
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [saved, setSaved] = useState(false);

  const passwordRules = useMemo(() => {
    const value = form.newPassword;
    return [
      { label: "Tối thiểu 8 ký tự", valid: value.length >= 8 },
      { label: "Có chữ hoa và chữ thường", valid: /[A-Z]/.test(value) && /[a-z]/.test(value) },
      { label: "Có ít nhất 1 số", valid: /\d/.test(value) },
      { label: "Có ký tự đặc biệt", valid: /[^A-Za-z0-9]/.test(value) },
    ];
  }, [form.newPassword]);

  const strength = useMemo(() => {
    const passed = passwordRules.filter((rule) => rule.valid).length;
    if (!form.newPassword) return { label: "Chưa nhập mật khẩu mới", className: "empty", percent: 0 };
    if (passed <= 1) return { label: "Mật khẩu yếu", className: "weak", percent: 28 };
    if (passed <= 3) return { label: "Mật khẩu khá", className: "medium", percent: 68 };
    return { label: "Mật khẩu mạnh", className: "strong", percent: 100 };
  }, [form.newPassword, passwordRules]);

  const passwordsMatch = form.confirmPassword && form.newPassword === form.confirmPassword;
  const canSubmit =
    form.currentPassword &&
    form.newPassword &&
    form.confirmPassword &&
    passwordsMatch &&
    passwordRules.every((rule) => rule.valid);

  const handleChange = (field, value) => {
    setSaved(false);
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const togglePassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canSubmit) return;
    setSaved(true);
    setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <div className="change-password-shell">
      {sidebarOpen && <button className="change-password-overlay" onClick={() => setSidebarOpen(false)} />}

      <aside className={`change-password-sidebar ${sidebarOpen ? "show" : ""}`}>
        <div className="change-password-logo">
          <div className="change-password-logo-mark">
            <span className="star s1">★</span>
            <span className="star s2">★</span>
            <span className="star s3">★</span>
            <i className="bi bi-shield-lock" />
          </div>
          <strong>AN KHANG</strong>
          <small>EDUCATION</small>
        </div>

        <nav className="change-password-menu">
          {menus.map((menu) => (
            <button key={menu.label} className={`change-password-menu-item ${menu.active ? "active" : ""}`}>
              <i className={`bi ${menu.icon}`} />
              <span>{menu.label}</span>
            </button>
          ))}
        </nav>

        <div className="change-password-sidebar-art">
          <span className="art-star a1">★</span>
          <span className="art-star a2">★</span>
          <span className="art-star a3">★</span>
          <span className="art-star a4">★</span>
          <div className="lock-art">
            <i className="bi bi-lock-fill" />
          </div>
        </div>
      </aside>

      <main className="change-password-main">
        <header className="change-password-topbar">
          <button className="change-password-mobile-menu" onClick={() => setSidebarOpen(true)}>
            <i className="bi bi-list" />
          </button>

          <div className="change-password-page-title">
            <button className="change-password-back-btn">
              <i className="bi bi-chevron-left" />
            </button>
            <div>
              <h1>Đổi mật khẩu</h1>
              <p>Cập nhật mật khẩu đăng nhập để bảo vệ dữ liệu và hồ sơ can thiệp</p>
            </div>
          </div>

          <div className="change-password-userbox">
            <button className="change-password-bell">
              <i className="bi bi-bell" />
              <span>3</span>
            </button>
            <img src={teacher.avatar} alt={teacher.fullName} />
            <div>
              <strong>{teacher.fullName}</strong>
              <small>{teacher.position}</small>
            </div>
            <i className="bi bi-chevron-down" />
          </div>
        </header>

        <section className="change-password-content">
          <div className="change-password-bg-star one">★</div>
          <div className="change-password-bg-star two">★</div>
          <div className="change-password-bg-star three">★</div>

          <section className="password-hero-card">
            <div className="password-hero-icon">
              <i className="bi bi-shield-lock-fill" />
            </div>
            <div>
              <span>Bảo mật tài khoản</span>
              <h2>Thay đổi mật khẩu đăng nhập</h2>
              <p>
                Mật khẩu mới nên dễ nhớ với cô giáo nhưng khó đoán với người khác. Sau khi đổi mật khẩu,
                hãy đăng nhập lại trên các thiết bị cần sử dụng.
              </p>
            </div>
          </section>

          <section className="change-password-grid">
            <form className="change-password-card" onSubmit={handleSubmit}>
              <div className="card-title-row">
                <div>
                  <span>Cập nhật bảo mật</span>
                  <h3>Thông tin mật khẩu</h3>
                </div>
                <span className={`password-status ${strength.className}`}>{strength.label}</span>
              </div>

              {saved && (
                <div className="success-alert">
                  <i className="bi bi-check-circle-fill" />
                  Mật khẩu đã được cập nhật thành công.
                </div>
              )}

              <label className="password-form-group">
                <span>Mật khẩu hiện tại</span>
                <div className="password-input-wrap">
                  <input
                    type={showPassword.current ? "text" : "password"}
                    value={form.currentPassword}
                    onChange={(e) => handleChange("currentPassword", e.target.value)}
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                  <button type="button" onClick={() => togglePassword("current")}>
                    <i className={`bi ${showPassword.current ? "bi-eye-slash" : "bi-eye"}`} />
                  </button>
                </div>
              </label>

              <label className="password-form-group">
                <span>Mật khẩu mới</span>
                <div className="password-input-wrap">
                  <input
                    type={showPassword.next ? "text" : "password"}
                    value={form.newPassword}
                    onChange={(e) => handleChange("newPassword", e.target.value)}
                    placeholder="Nhập mật khẩu mới"
                  />
                  <button type="button" onClick={() => togglePassword("next")}>
                    <i className={`bi ${showPassword.next ? "bi-eye-slash" : "bi-eye"}`} />
                  </button>
                </div>
              </label>

              <div className="password-strength-box">
                <div className="strength-head">
                  <span>Độ mạnh mật khẩu</span>
                  <strong>{strength.label}</strong>
                </div>
                <div className="strength-track">
                  <div className={`strength-fill ${strength.className}`} style={{ width: `${strength.percent}%` }} />
                </div>
                <div className="password-rule-list">
                  {passwordRules.map((rule) => (
                    <div className={rule.valid ? "valid" : ""} key={rule.label}>
                      <i className={`bi ${rule.valid ? "bi-check-circle-fill" : "bi-circle"}`} />
                      <span>{rule.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <label className="password-form-group">
                <span>Xác nhận mật khẩu mới</span>
                <div className="password-input-wrap">
                  <input
                    type={showPassword.confirm ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    placeholder="Nhập lại mật khẩu mới"
                  />
                  <button type="button" onClick={() => togglePassword("confirm")}>
                    <i className={`bi ${showPassword.confirm ? "bi-eye-slash" : "bi-eye"}`} />
                  </button>
                </div>
                {form.confirmPassword && !passwordsMatch && (
                  <small className="error-text">Mật khẩu xác nhận chưa trùng khớp.</small>
                )}
                {passwordsMatch && <small className="match-text">Mật khẩu xác nhận đã trùng khớp.</small>}
              </label>

              <div className="password-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                    setSaved(false);
                  }}
                >
                  Hủy
                </button>
                <button type="submit" className="save-btn" disabled={!canSubmit}>
                  <i className="bi bi-check2-circle" />
                  Lưu mật khẩu mới
                </button>
              </div>
            </form>

            <aside className="security-panel">
              <div className="security-profile-card">
                <img src={teacher.avatar} alt={teacher.fullName} />
                <div>
                  <span>Tài khoản đang đổi mật khẩu</span>
                  <h3>{teacher.fullName}</h3>
                  <p>{teacher.email}</p>
                </div>
              </div>

              <div className="security-note-list">
                {securityNotes.map((item) => (
                  <article className="security-note-card" key={item.title}>
                    <i className={`bi ${item.icon}`} />
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.desc}</p>
                    </div>
                  </article>
                ))}
              </div>
            </aside>
          </section>
        </section>
      </main>
    </div>
  );
}
