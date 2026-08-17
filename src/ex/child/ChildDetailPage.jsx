import React, { useState } from 'react';
import './ChildDetailPage.css';
import InfoTile from './InfoTile';
import ProgressItem from './ProgressItem';
import { childProfile, childNotes, developmentAreas, menuItems, quickStats, timeline } from './childDetailData';

export default function ChildDetailPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="ak-child-page">
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
            <button className="back-btn"><i className="bi bi-chevron-left" /></button>
            <div>
              <h1>Chi tiết thông tin trẻ</h1>
              <p>Thông tin hồ sơ, tiến trình và định hướng can thiệp của trẻ.</p>
            </div>
          </div>

          <div className="user-area">
            <button className="bell-btn"><i className="bi bi-bell" /><span>3</span></button>
            <img src="https://i.pravatar.cc/80?img=47" alt="avatar" />
            <div><strong>Cô An</strong><p>Giáo viên</p></div>
            <i className="bi bi-chevron-down" />
          </div>
        </header>

        <section className="profile-hero">
          <div className="profile-left">
            <div className="avatar-wrap">
              <img src={childProfile.avatar} alt={childProfile.fullName} />
              <span className="status-dot" />
            </div>
            <div className="profile-main-text">
              <div className="name-line">
                <h2>{childProfile.fullName}</h2>
                <span>{childProfile.gender}</span>
              </div>
              <p className="child-code"><i className="bi bi-upc-scan" /> Mã hồ sơ: {childProfile.code}</p>
              <p className="status-pill"><i className="bi bi-check2-circle" /> {childProfile.status}</p>
            </div>
          </div>

          <div className="hero-art">
            <i className="bi bi-puzzle-fill puzzle p1" />
            <i className="bi bi-person-arms-up figure" />
            <i className="bi bi-puzzle-fill puzzle p2" />
          </div>

          <button className="primary-btn"><i className="bi bi-pencil-square" /> Cập nhật hồ sơ</button>
        </section>

        <section className="info-grid">
          <InfoTile icon="bi-calendar2-week" label="Ngày sinh" value={childProfile.birthDate} />
          <InfoTile icon="bi-cake2" label="Độ tuổi" value={childProfile.age} />
          <InfoTile icon="bi-person-heart" label="Phụ huynh" value={childProfile.parent} />
          <InfoTile icon="bi-telephone" label="Liên hệ" value={childProfile.phone} />
          <InfoTile icon="bi-geo-alt" label="Khu vực" value={childProfile.address} />
          <InfoTile icon="bi-person-badge" label="Giáo viên phụ trách" value={childProfile.teacher} />
        </section>

        <section className="stat-grid">
          {quickStats.map((item) => (
            <div key={item.label} className={`stat-card ${item.tone}`}>
              <span><i className={`bi ${item.icon}`} /></span>
              <div><strong>{item.value}</strong><p>{item.label}</p></div>
            </div>
          ))}
        </section>

        <section className="detail-layout">
          <div className="left-column">
            <div className="panel-card">
              <div className="section-title"><i className="bi bi-clipboard2-heart" /><h3>Nhận định tổng quan</h3></div>
              <div className="note-list">
                {childNotes.map((note) => (
                  <article className="note-item" key={note.title}>
                    <span><i className={`bi ${note.icon}`} /></span>
                    <div><h4>{note.title}</h4><p>{note.content}</p></div>
                  </article>
                ))}
              </div>
            </div>

            <div className="panel-card timeline-card">
              <div className="section-title"><i className="bi bi-clock-history" /><h3>Lịch sử gần đây</h3></div>
              {timeline.map((item) => (
                <div className={`timeline-item ${item.type}`} key={item.time + item.title}>
                  <span className="timeline-dot" />
                  <div className="timeline-content">
                    <strong>{item.time}</strong>
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="right-column">
            <div className="panel-card progress-card">
              <div className="section-title"><i className="bi bi-bar-chart-line" /><h3>Tiến trình lĩnh vực</h3></div>
              {developmentAreas.map((item) => <ProgressItem key={item.field} item={item} />)}
            </div>

            <div className="cute-card">
              <div className="cute-illustration">👩‍🏫👦</div>
              <h3>Gợi ý hôm nay</h3>
              <p>Ưu tiên hoạt động chơi luân phiên 5–7 phút, kết hợp chờ lượt và yêu cầu con diễn đạt nhu cầu trước khi hỗ trợ.</p>
              <button>Thêm vào kế hoạch <i className="bi bi-chevron-right" /></button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
