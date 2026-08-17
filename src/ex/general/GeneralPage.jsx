import React, { useState } from 'react';
import './GeneralPage.css';
import GeneralCard from './GeneralCard';
import { dashboardCards, menuItems } from './generalData';

export default function GeneralPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="ak-general-page">
      <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
        <i className="bi bi-list" />
      </button>

      {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}

      <aside className={`ak-sidebar ${sidebarOpen ? 'show' : ''}`}>
        <div className="logo-box">
          <div className="logo-circle"><i className="bi bi-stars" /></div>
          <h2>AN KHANG</h2>
          <span>EDUCATION</span>
        </div>

        <nav className="ak-menu">
          {menuItems.map((item) => (
            <button key={item.label} className={`menu-item ${item.active ? 'active' : ''}`}>
              <i className={`bi ${item.icon}`} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-kids">
          <span className="star s1">★</span><span className="star s2">★</span><span className="star s3">★</span>
          <div className="kids-circle"><span>👦</span><span>👧</span></div>
          <div className="wave yellow-wave" /><div className="wave blue-wave" />
        </div>
      </aside>

      <main className="ak-main">
        <header className="top-header sticky-user-header">
          <div className="title-area">
            <h1>Xin chào, Giáo viên An Khang!</h1>
            <p>Chào mừng bạn trở lại hệ thống quản lý can thiệp.</p>
          </div>

          <div className="user-area">
            <button className="bell-btn"><i className="bi bi-bell" /><span>3</span></button>
            <img src="https://i.pravatar.cc/80?img=47" alt="avatar" />
            <div><strong>Cô An</strong><p>Giáo viên</p></div>
            <i className="bi bi-chevron-down" />
          </div>
        </header>

        <section className="child-info-card">
          <div className="child-title-row">
            <span className="child-title-icon"><i className="bi bi-person-bounding-box" /></span>
            <h2>Thông tin trẻ</h2>
          </div>

          <div className="child-content">
            <img className="child-avatar" src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=240&q=80" alt="Nguyễn Minh Khang" />
            <div className="child-detail">
              <div className="child-name-line">
                <h3>Nguyễn Minh Khang</h3>
                <span>Nam</span>
              </div>
              <p><i className="bi bi-calendar2-week" /> Ngày sinh: 12/05/2020</p>
              <p><i className="bi bi-cake2" /> 4 tuổi 1 tháng</p>
            </div>

            <div className="child-art">
              <i className="bi bi-puzzle-fill puzzle p1" />
              <i className="bi bi-person-arms-up figure" />
              <i className="bi bi-puzzle-fill puzzle p2" />
            </div>

            <button className="detail-btn">Xem chi tiết <i className="bi bi-chevron-right" /></button>
          </div>
        </section>

        <section className="general-grid">
          {dashboardCards.map((item) => <GeneralCard key={item.id} item={item} />)}
        </section>

        <div className="general-slogan"><span>★</span> “Tận tâm – Chuyên nghiệp – Đồng hành – Phát triển”</div>
      </main>
    </div>
  );
}
