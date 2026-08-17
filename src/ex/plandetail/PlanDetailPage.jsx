import React, { useState } from 'react';
import './PlanDetailPage.css';
import PlanTaskRow from './PlanTaskRow';
import { menuItems, planTasks } from './planDetailData';

export default function PlanDetailPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="ak-plan-detail-page">
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
              <h1>Chi tiết kế hoạch can thiệp</h1>
              <p>Kế hoạch can thiệp <i className="bi bi-chevron-right" /> Chi tiết kế hoạch</p>
            </div>
          </div>

          <div className="user-area">
            <button className="bell-btn"><i className="bi bi-bell" /><span>3</span></button>
            <img src="https://i.pravatar.cc/80?img=47" alt="avatar" />
            <div><strong>Cô An</strong><p>Giáo viên</p></div>
            <i className="bi bi-chevron-down" />
          </div>
        </header>

        <section className="detail-card student-card">
          <div className="student-left">
            <img className="child-avatar" src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=220&q=80" alt="child" />
            <div>
              <div className="student-name-row">
                <h2>Nguyễn Minh Khang</h2>
                <span className="status-badge approved">Đã duyệt</span>
              </div>
              <div className="child-meta">
                <span><i className="bi bi-calendar2-week" /> 28/05/2019</span>
                <span><i className="bi bi-gender-male" /> Nam</span>
                <span><i className="bi bi-people" /> Nhóm 1</span>
              </div>
            </div>
          </div>

          <div className="detail-actions">
            <button className="outline-btn blue"><i className="bi bi-chat-square-text" /> Góp ý</button>
            <button className="outline-btn yellow"><i className="bi bi-pencil" /> Chỉnh sửa</button>
            <button className="outline-btn blue"><i className="bi bi-send-check" /> Gửi chờ duyệt</button>
            <button className="export-btn"><i className="bi bi-download" /> Xuất file</button>
          </div>

          <div className="plan-info-grid">
            <div><b>Kế hoạch</b><span>Kế hoạch can thiệp cá nhân</span></div>
            <div><b>Thời gian áp dụng</b><span>01/05/2024 - 01/11/2024</span></div>
            <div><b>Tần suất</b><span>3 buổi/tuần</span></div>
            <div><b>Giáo viên phụ trách</b><span><img src="https://i.pravatar.cc/40?img=47" alt="teacher" /> Cô Nguyễn Thị An</span></div>
          </div>
        </section>

        <section className="detail-card task-card">
          <h3 className="section-title">Danh sách mục tiêu</h3>
          <div className="plan-table">
            <div className="plan-table-head">
              <span>#</span><span>Mục tiêu</span><span>Lĩnh vực</span><span>Mức độ hỗ trợ</span><span>Nội dung can thiệp</span>
            </div>
            <div className="plan-table-body">
              {planTasks.map((item) => <PlanTaskRow key={item.id} item={item} />)}
            </div>
          </div>
        </section>

        <section className="review-grid">
          <div className="detail-card review-card">
            <div className="review-head"><h3>Góp ý gần nhất</h3><span className="status-badge approved">Đã duyệt</span></div>
            <div className="review-person">
              <img src="https://i.pravatar.cc/60?img=32" alt="reviewer" />
              <div><strong>Cô Lê Thị Minh</strong><span>Trưởng chuyên môn</span></div>
              <time>15/04/2024 - 10:30</time>
            </div>
            <p>Kế hoạch phù hợp với nhu cầu hiện tại của trẻ. Nội dung mục tiêu rõ ràng, khả thi. Giáo viên triển khai theo đúng tần suất đã đề ra.</p>
          </div>

          <div className="detail-card history-card">
            <div className="review-head"><h3>Lịch sử góp ý</h3><button>Danh sách góp ý</button></div>
            <ul>
              <li><i className="bi bi-chat-square-text blue-text" /> Tất cả góp ý <b>3</b></li>
              <li><i className="bi bi-check2-circle green-text" /> Đã duyệt <b>1</b></li>
              <li><i className="bi bi-pencil-square yellow-text" /> Yêu cầu chỉnh sửa <b>2</b></li>
              <li><i className="bi bi-chat-left-dots orange-text" /> Đang chờ phản hồi <b>0</b></li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
