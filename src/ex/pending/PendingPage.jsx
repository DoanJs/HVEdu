import React, { useState } from 'react';
import './PendingPage.css';
import PendingCard from './PendingCard';
import { menuItems, pendingItems } from './pendingData';

export default function PendingPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="ak-pending-page">
      <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
        <i className="bi bi-list" />
      </button>

      {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}

      <aside className={`ak-sidebar ${sidebarOpen ? 'show' : ''}`}>
        <div className="logo-box">
          <div className="logo-circle">
            <i className="bi bi-stars" />
          </div>
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
          <span className="star s1">★</span>
          <span className="star s2">★</span>
          <span className="star s3">★</span>
          <div className="kids-circle">
            <span>👦</span>
            <span>👧</span>
          </div>
          <div className="wave yellow-wave" />
          <div className="wave blue-wave" />
        </div>
      </aside>

      <main className="ak-main">
        <header className="top-header">
          <div className="title-area">
            <button className="back-btn"><i className="bi bi-chevron-left" /></button>
            <div>
              <h1>Chờ duyệt</h1>
              <p>Các kế hoạch và báo cáo đang chờ Ban chuyên môn duyệt.</p>
            </div>
          </div>

          <div className="user-area">
            <button className="bell-btn">
              <i className="bi bi-bell" />
              <span>3</span>
            </button>
            <img src="https://i.pravatar.cc/80?img=47" alt="avatar" />
            <div>
              <strong>Cô An</strong>
              <p>Giáo viên</p>
            </div>
            <i className="bi bi-chevron-down" />
          </div>
        </header>

        <section className="pending-grid">
          {pendingItems.map((item) => (
            <PendingCard key={item.id} item={item} />
          ))}
        </section>

        <div className="pending-note">
          <span><i className="bi bi-info-lg" /></span>
          <p>Sau khi được duyệt, kế hoạch và báo cáo sẽ được lưu trữ và hiển thị trong danh sách chính thức.</p>
          <strong>⭐</strong>
        </div>
      </main>
    </div>
  );
}
