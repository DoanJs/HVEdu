import React, { useMemo, useRef, useState } from "react";
import "./UserDetailPage.css";

const menus = [
  { icon: "bi-house-door", label: "Tổng quan" },
  { icon: "bi-person-badge", label: "Thông tin trẻ" },
  { icon: "bi-bullseye", label: "Ngân hàng mục tiêu" },
  { icon: "bi-calendar2-check", label: "Kế hoạch can thiệp" },
  { icon: "bi-clipboard2-data", label: "Báo cáo can thiệp" },
  { icon: "bi-clock", label: "Chờ duyệt" },
  { icon: "bi-cart3", label: "Giỏ mục tiêu" },
  { icon: "bi-person-gear", label: "Thông tin cá nhân", active: true },
];

const defaultUser = {
  fullName: "Nguyễn Thị An",
  position: "Giáo viên can thiệp",
  email: "coan@ankhang.edu.vn",
  phone: "0901 234 567",
  birthday: "1998-05-12",
  gender: "Nữ",
  address: "Liên Chiểu, Đà Nẵng",
  department: "Can thiệp cá nhân 1:1",
  qualification: "Cử nhân Tâm lý - Giáo dục",
  startDate: "2025-08-15",
  bio: "Phụ trách xây dựng kế hoạch can thiệp cá nhân, báo cáo tiến trình và phối hợp cùng phụ huynh trong quá trình đồng hành với trẻ.",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&h=240&fit=crop&crop=face",
};

const stats = [
  { label: "Trẻ phụ trách", value: "08", icon: "bi-people" },
  { label: "Kế hoạch đã tạo", value: "24", icon: "bi-calendar2-check" },
  { label: "Báo cáo tháng", value: "18", icon: "bi-clipboard2-data" },
];

export default function UserDetailPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(defaultUser);
  const [avatarPreview, setAvatarPreview] = useState(defaultUser.avatar);
  const fileInputRef = useRef(null);

  const joinedText = useMemo(() => {
    if (!form.startDate) return "Chưa cập nhật";
    const [year, month, day] = form.startDate.split("-");
    return `${day}/${month}/${year}`;
  }, [form.startDate]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setAvatarPreview(imageUrl);
  };

  const handleCancel = () => {
    setForm(defaultUser);
    setAvatarPreview(defaultUser.avatar);
    setIsEditing(false);
  };

  const handleSave = (event) => {
    event.preventDefault();
    setIsEditing(false);
  };

  return (
    <div className="user-detail-shell">
      {sidebarOpen && <button className="user-detail-overlay" onClick={() => setSidebarOpen(false)} />}

      <aside className={`user-detail-sidebar ${sidebarOpen ? "show" : ""}`}>
        <div className="user-detail-logo">
          <div className="user-detail-logo-mark">
            <span className="star s1">★</span>
            <span className="star s2">★</span>
            <span className="star s3">★</span>
            <i className="bi bi-person-arms-up" />
          </div>
          <strong>AN KHANG</strong>
          <small>EDUCATION</small>
        </div>

        <nav className="user-detail-menu">
          {menus.map((menu) => (
            <button key={menu.label} className={`user-detail-menu-item ${menu.active ? "active" : ""}`}>
              <i className={`bi ${menu.icon}`} />
              <span>{menu.label}</span>
            </button>
          ))}
        </nav>

        <div className="user-detail-sidebar-art">
          <span className="art-star a1">★</span>
          <span className="art-star a2">★</span>
          <span className="art-star a3">★</span>
          <span className="art-star a4">★</span>
          <div className="children-art">
            <span>👦</span>
            <span className="hand">🙌</span>
            <span>👧</span>
          </div>
        </div>
      </aside>

      <main className="user-detail-main">
        <header className="user-detail-topbar">
          <button className="user-detail-mobile-menu" onClick={() => setSidebarOpen(true)}>
            <i className="bi bi-list" />
          </button>

          <div className="user-detail-page-title">
            <button className="user-detail-back-btn">
              <i className="bi bi-chevron-left" />
            </button>
            <div>
              <h1>Thông tin cá nhân</h1>
              <p>Cập nhật hồ sơ, ảnh đại diện và thông tin liên hệ của cô giáo</p>
            </div>
          </div>

          <div className="user-detail-userbox">
            <button className="user-detail-bell">
              <i className="bi bi-bell" />
              <span>3</span>
            </button>
            <img src={avatarPreview} alt={form.fullName} />
            <div>
              <strong>{form.fullName}</strong>
              <small>{form.position}</small>
            </div>
            <i className="bi bi-chevron-down" />
          </div>
        </header>

        <section className="user-detail-content">
          <div className="user-detail-bg-star one">★</div>
          <div className="user-detail-bg-star two">★</div>
          <div className="user-detail-bg-star three">★</div>

          <section className="user-profile-hero">
            <div className="user-avatar-card">
              <div className="avatar-frame">
                <img src={avatarPreview} alt={form.fullName} />
                <button type="button" className="avatar-change-btn" onClick={() => fileInputRef.current?.click()}>
                  <i className="bi bi-camera-fill" />
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="avatar-input"
                onChange={handleAvatarChange}
              />

              <h2>{form.fullName}</h2>
              <p>{form.position}</p>
              <span className="user-status-badge">
                <i className="bi bi-check-circle-fill" />
                Đang hoạt động
              </span>
            </div>

            <div className="user-summary-card">
              <div className="summary-head">
                <div>
                  <span>Hồ sơ giáo viên</span>
                  <h3>Thông tin tổng quan</h3>
                </div>
                <button type="button" className="edit-profile-btn" onClick={() => setIsEditing(true)}>
                  <i className="bi bi-pencil-square" />
                  Chỉnh sửa
                </button>
              </div>

              <div className="summary-grid">
                <div>
                  <small>Email</small>
                  <strong>{form.email}</strong>
                </div>
                <div>
                  <small>Số điện thoại</small>
                  <strong>{form.phone}</strong>
                </div>
                <div>
                  <small>Bộ phận</small>
                  <strong>{form.department}</strong>
                </div>
                <div>
                  <small>Ngày vào làm</small>
                  <strong>{joinedText}</strong>
                </div>
              </div>

              <div className="user-stats-row">
                {stats.map((item) => (
                  <div className="user-stat-card" key={item.label}>
                    <i className={`bi ${item.icon}`} />
                    <div>
                      <strong>{item.value}</strong>
                      <span>{item.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <form className="user-info-card" onSubmit={handleSave}>
            <div className="card-title-row">
              <div>
                <span>Cập nhật hồ sơ</span>
                <h3>Thông tin cá nhân</h3>
              </div>
              <span className={`edit-status ${isEditing ? "editing" : ""}`}>
                {isEditing ? "Đang chỉnh sửa" : "Chế độ xem"}
              </span>
            </div>

            <div className="user-form-grid">
              <label className="user-form-group">
                <span>Họ và tên</span>
                <input disabled={!isEditing} value={form.fullName} onChange={(e) => handleChange("fullName", e.target.value)} />
              </label>

              <label className="user-form-group">
                <span>Chức vụ</span>
                <input disabled={!isEditing} value={form.position} onChange={(e) => handleChange("position", e.target.value)} />
              </label>

              <label className="user-form-group">
                <span>Email</span>
                <input disabled={!isEditing} value={form.email} onChange={(e) => handleChange("email", e.target.value)} />
              </label>

              <label className="user-form-group">
                <span>Số điện thoại</span>
                <input disabled={!isEditing} value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} />
              </label>

              <label className="user-form-group">
                <span>Ngày sinh</span>
                <input disabled={!isEditing} type="date" value={form.birthday} onChange={(e) => handleChange("birthday", e.target.value)} />
              </label>

              <label className="user-form-group">
                <span>Giới tính</span>
                <select disabled={!isEditing} value={form.gender} onChange={(e) => handleChange("gender", e.target.value)}>
                  <option>Nữ</option>
                  <option>Nam</option>
                  <option>Khác</option>
                </select>
              </label>

              <label className="user-form-group">
                <span>Bộ phận phụ trách</span>
                <input disabled={!isEditing} value={form.department} onChange={(e) => handleChange("department", e.target.value)} />
              </label>

              <label className="user-form-group">
                <span>Trình độ chuyên môn</span>
                <input disabled={!isEditing} value={form.qualification} onChange={(e) => handleChange("qualification", e.target.value)} />
              </label>

              <label className="user-form-group full">
                <span>Địa chỉ</span>
                <input disabled={!isEditing} value={form.address} onChange={(e) => handleChange("address", e.target.value)} />
              </label>

              <label className="user-form-group full">
                <span>Giới thiệu ngắn</span>
                <textarea disabled={!isEditing} value={form.bio} onChange={(e) => handleChange("bio", e.target.value)} />
              </label>
            </div>

            <div className="user-form-actions">
              {isEditing ? (
                <>
                  <button type="button" className="cancel-btn" onClick={handleCancel}>Hủy</button>
                  <button type="submit" className="save-btn">
                    <i className="bi bi-check2-circle" />
                    Lưu cập nhật
                  </button>
                </>
              ) : (
                <button type="button" className="save-btn" onClick={() => setIsEditing(true)}>
                  <i className="bi bi-pencil-square" />
                  Cập nhật thông tin
                </button>
              )}
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
