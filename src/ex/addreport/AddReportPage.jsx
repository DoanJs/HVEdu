import React, { useState } from 'react';
import './AddReportPage.css';
import AddReportRow from './AddReportRow';
import MobileReportCard from './MobileReportCard';
import { menuItems, reportGoals } from './addReportData';

export default function AddReportPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="ak-add-report-page">
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
        <header className="top-header">
          <div className="title-area with-back">
            <button className="back-btn"><i className="bi bi-chevron-left" /></button>
            <div>
              <h1>Tạo báo cáo can thiệp</h1>
              <p>Báo cáo dựa trên kế hoạch can thiệp đã được duyệt</p>
            </div>
          </div>

          <div className="user-area">
            <button className="bell-btn"><i className="bi bi-bell" /><span>3</span></button>
            <img src="https://i.pravatar.cc/80?img=47" alt="avatar" />
            <div><strong>Cô An</strong><p>Giáo viên</p></div>
            <i className="bi bi-chevron-down" />
          </div>
        </header>

        <section className="add-report-layout">
          <div className="form-column">
            <div className="top-form-grid">
              <label className="form-group child-select">
                <span>Chọn trẻ</span>
                <button className="select-box">
                  <img src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=120&q=80" alt="child" />
                  <b>Nguyễn Minh Khang</b>
                  <i className="bi bi-chevron-down" />
                </button>
              </label>

              <label className="form-group plan-select">
                <span>Chọn kế hoạch can thiệp</span>
                <button className="select-box">
                  <b>Kế hoạch can thiệp cá nhân - 01/05/2024</b>
                  <em>Đã duyệt</em>
                  <i className="bi bi-chevron-down" />
                </button>
              </label>

              <label className="form-group date-select">
                <span>Ngày báo cáo</span>
                <button className="select-box">
                  <b>24/05/2024</b>
                  <i className="bi bi-calendar2-week" />
                </button>
              </label>
            </div>

            <section className="report-table-card">
              <div className="report-table-head">
                <span>Lĩnh vực</span>
                <span>Mục tiêu</span>
                <span>Mức độ hỗ trợ</span>
                <span>Tổng kết</span>
              </div>
              <div className="report-table-body">
                {reportGoals.map((item) => <AddReportRow key={item.id} item={item} />)}
              </div>
            </section>

            <section className="mobile-form-list">
              {reportGoals.map((item) => <MobileReportCard key={item.id} item={item} />)}
            </section>

            <label className="general-note">
              <span>Nhận xét chung</span>
              <textarea defaultValue="Trẻ có tiến bộ ở nhóm kỹ năng giao tiếp và vận động tinh. Cần tăng cường hỗ trợ ở kỹ năng xã hội. Tiếp tục duy trì các mục tiêu hiện tại và theo dõi sát sao." />
            </label>

            <div className="form-actions">
              <button className="cancel-btn">Hủy</button>
              <button className="draft-btn">Lưu nháp</button>
              <button className="submit-btn">Gửi báo cáo</button>
            </div>
          </div>

          {/* <aside className="phone-preview" aria-label="Mobile preview">
            <div className="phone-frame">
              <div className="phone-bar"><span>9:41</span><i className="bi bi-reception-4" /></div>
              <div className="phone-content">
                <div className="phone-title"><i className="bi bi-chevron-left" /><b>Tạo báo cáo can thiệp</b></div>
                <div className="phone-form">
                  <small>Chọn trẻ</small>
                  <div className="phone-select"><img src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=80&q=80" alt="child" />Nguyễn Minh Khang<i className="bi bi-chevron-down" /></div>
                  <small>Kế hoạch can thiệp</small>
                  <div className="phone-select">Kế hoạch cá nhân - 01/05/2024 <em>Đã duyệt</em></div>
                  <small>Ngày báo cáo</small>
                  <div className="phone-select">24/05/2024<i className="bi bi-calendar2-week" /></div>
                </div>
                {reportGoals.slice(0, 2).map((item) => <MobileReportCard key={item.id} item={item} />)}
                <div className="phone-bottom"><button>Lưu nháp</button><button>Gửi báo cáo</button></div>
              </div>
            </div>
          </aside> */}
        </section>
      </main>
    </div>
  );
}
