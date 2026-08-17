import React, { useMemo, useState } from 'react';
import './ReportPage.css';
import ReportCard from './ReportCard';
import { menuItems, reports } from './reportData';

export default function ReportPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [teacher, setTeacher] = useState('all');

  const teachers = useMemo(() => ['all', ...new Set(reports.map((item) => item.teacher))], []);

  const filteredReports = useMemo(() => {
    return reports.filter((item) => {
      const matchKeyword = `${item.month} ${item.subTitle} ${item.teacher}`
        .toLowerCase()
        .includes(keyword.toLowerCase());
      const matchTeacher = teacher === 'all' || item.teacher === teacher;
      return matchKeyword && matchTeacher;
    });
  }, [keyword, teacher]);

  return (
    <div className="ak-report-page">
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
              <h1>Báo cáo can thiệp</h1>
              <p>Danh sách báo cáo can thiệp theo từng tháng.</p>
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

        <section className="toolbar">
          <div className="search-box">
            <i className="bi bi-search" />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm kiếm báo cáo..."
            />
          </div>

          <div className="filter-box">
            <i className="bi bi-funnel" />
            <select value={teacher} onChange={(e) => setTeacher(e.target.value)}>
              {teachers.map((name) => (
                <option key={name} value={name}>
                  {name === 'all' ? 'Lọc theo giáo viên' : name}
                </option>
              ))}
            </select>
          </div>

          <button className="create-btn">
            <i className="bi bi-plus-lg" />
            Tạo báo cáo mới
          </button>
        </section>

        <section className="report-grid">
          {filteredReports.slice(0, 8).map((item) => (
            <ReportCard key={item.id} item={item} />
          ))}
        </section>

        <footer className="page-footer">
          <p>Hiển thị 1 đến {Math.min(8, filteredReports.length)} của {filteredReports.length} báo cáo</p>
          <div className="pagination">
            <button><i className="bi bi-chevron-left" /></button>
            <button className="active">1</button>
            <button>2</button>
            <button><i className="bi bi-chevron-right" /></button>
            <select defaultValue="8">
              <option value="8">8 / trang</option>
              <option value="12">12 / trang</option>
              <option value="16">16 / trang</option>
            </select>
          </div>
        </footer>
      </main>
    </div>
  );
}
