import React, { useState } from "react";
import UserStatCard from "./UserStatCard";
import {
  interventionAreas,
  overviewCards,
  recentDocuments,
  userProfile,
  weeklySchedule,
} from "./userDetailData";
import "./UserDetailPage.css";

const menus = [
  { icon: "bi-house-door", label: "Tổng quan" },
  { icon: "bi-person-badge", label: "Thông tin trẻ", active: true },
  { icon: "bi-bullseye", label: "Ngân hàng mục tiêu" },
  { icon: "bi-calendar2-check", label: "Kế hoạch can thiệp" },
  { icon: "bi-clipboard2-data", label: "Báo cáo can thiệp" },
  { icon: "bi-clock", label: "Chờ duyệt" },
  { icon: "bi-cart3", label: "Giỏ mục tiêu" },
];

export default function UserDetailPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
              <h1>Thông tin trẻ</h1>
              <p>Quản lý hồ sơ, lịch học và tiến độ can thiệp của trẻ</p>
            </div>
          </div>

          <div className="user-detail-userbox">
            <button className="user-detail-bell">
              <i className="bi bi-bell" />
              <span>3</span>
            </button>
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face" alt="Cô An" />
            <div>
              <strong>Cô An</strong>
              <small>Giáo viên</small>
            </div>
            <i className="bi bi-chevron-down" />
          </div>
        </header>

        <section className="user-detail-content">
          <div className="user-detail-bg-star one">★</div>
          <div className="user-detail-bg-star two">★</div>
          <div className="user-detail-bg-star three">★</div>

          <section className="user-hero-card">
            <div className="user-avatar-wrap">
              <img src={userProfile.avatar} alt={userProfile.name} />
              <span>{userProfile.status}</span>
            </div>

            <div className="user-hero-info">
              <div className="user-name-row">
                <div>
                  <small>Mã hồ sơ: {userProfile.code}</small>
                  <h2>{userProfile.name}</h2>
                </div>
                <button className="edit-user-btn">
                  <i className="bi bi-pencil-square" />
                  Chỉnh sửa
                </button>
              </div>

              <p className="user-main-need">{userProfile.mainNeed}</p>

              <div className="user-info-grid">
                <div><span>Giới tính</span><strong>{userProfile.gender}</strong></div>
                <div><span>Ngày sinh</span><strong>{userProfile.birthday}</strong></div>
                <div><span>Độ tuổi</span><strong>{userProfile.age}</strong></div>
                <div><span>Giáo viên phụ trách</span><strong>{userProfile.teacher}</strong></div>
                <div><span>Phụ huynh</span><strong>{userProfile.parent}</strong></div>
                <div><span>Số điện thoại</span><strong>{userProfile.phone}</strong></div>
                <div><span>Ngày vào học</span><strong>{userProfile.joinDate}</strong></div>
                <div><span>Khu vực</span><strong>{userProfile.address}</strong></div>
              </div>
            </div>
          </section>

          <section className="user-stat-grid">
            {overviewCards.map((item) => (
              <UserStatCard key={item.id} item={item} />
            ))}
          </section>

          <section className="user-detail-two-column">
            <article className="user-panel progress-panel">
              <div className="panel-title-row">
                <div>
                  <h3>Tiến độ theo lĩnh vực</h3>
                  <p>Theo kế hoạch can thiệp tháng 07/2026</p>
                </div>
                <i className="bi bi-graph-up" />
              </div>

              <div className="area-list">
                {interventionAreas.map((area) => (
                  <div className="area-item" key={area.id}>
                    <div className="area-top">
                      <strong>{area.name}</strong>
                      <span>{area.progress}%</span>
                    </div>
                    <div className="progress-track">
                      <div className={`progress-fill ${area.tone}`} style={{ width: `${area.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="user-panel schedule-panel">
              <div className="panel-title-row">
                <div>
                  <h3>Lịch học trong tuần</h3>
                  <p>Các ca đang được sắp xếp cho trẻ</p>
                </div>
                <i className="bi bi-calendar-heart" />
              </div>

              <div className="schedule-list">
                {weeklySchedule.map((item) => (
                  <div className="schedule-item" key={item.id}>
                    <div className="schedule-day">{item.day}</div>
                    <div>
                      <strong>{item.title}</strong>
                      <span>{item.time} · {item.teacher}</span>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="user-panel document-panel">
            <div className="panel-title-row">
              <div>
                <h3>Hồ sơ gần đây</h3>
                <p>Kế hoạch, báo cáo và phiếu đánh giá đã cập nhật</p>
              </div>
              <button className="view-all-btn">Xem tất cả</button>
            </div>

            <div className="document-list">
              {recentDocuments.map((doc) => (
                <button className="document-item" key={doc.id}>
                  <span className="document-icon"><i className={`bi ${doc.icon}`} /></span>
                  <div>
                    <strong>{doc.title}</strong>
                    <small>{doc.date}</small>
                  </div>
                  <em>{doc.status}</em>
                  <i className="bi bi-chevron-right" />
                </button>
              ))}
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}
