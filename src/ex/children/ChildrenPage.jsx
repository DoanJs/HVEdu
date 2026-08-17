import React, { useMemo, useState } from 'react';
import './ChildrenPage.css';
import ChildrenCard from './ChildrenCard';
import { children, menuItems } from './childrenData';

export default function ChildrenPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [group, setGroup] = useState('');
  const [teacher, setTeacher] = useState('');

  const filteredChildren = useMemo(() => {
    const text = keyword.trim().toLowerCase();
    return children.filter((item) => {
      const matchText = !text || `${item.name} ${item.teacher} ${item.group}`.toLowerCase().includes(text);
      const matchGroup = !group || item.group === group;
      const matchTeacher = !teacher || item.teacher === teacher;
      return matchText && matchGroup && matchTeacher;
    });
  }, [keyword, group, teacher]);

  return (
    <div className="ak-children-page">
      <button className="children-mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="Mở menu">
        <i className="bi bi-list" />
      </button>

      {sidebarOpen && <div className="children-sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}

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

      <main className="children-main">
        <header className="children-topbar">
          <div className="children-title-row">
            <button className="back-btn"><i className="bi bi-chevron-left" /></button>
            <div className="title-area">
              <h1>Danh sách trẻ</h1>
              <p>Quản lý thông tin và quá trình can thiệp của trẻ</p>
            </div>
          </div>

          <div className="user-area">
            <button className="bell-btn"><i className="bi bi-bell" /><span>3</span></button>
            <img src="https://i.pravatar.cc/80?img=47" alt="avatar" />
            <div><strong>Cô An</strong><p>Giáo viên</p></div>
            <i className="bi bi-chevron-down" />
          </div>
        </header>

        <section className="children-toolbar">
          <select value={group} onChange={(e) => setGroup(e.target.value)}>
            <option value="">Tất cả nhóm</option>
            <option>Nhóm 1</option>
            <option>Nhóm 2</option>
            <option>Nhóm 3</option>
          </select>

          <select value={teacher} onChange={(e) => setTeacher(e.target.value)}>
            <option value="">Tất cả giáo viên</option>
            <option>Cô Nguyễn Thị An</option>
            <option>Cô Lê Thị Minh</option>
            <option>Cô Phạm Thu Hà</option>
          </select>

          <div className="children-search">
            <i className="bi bi-search" />
            <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Tìm kiếm trẻ..." />
          </div>

          <button className="add-child-btn"><i className="bi bi-plus-lg" /> Thêm trẻ</button>
          <button className="filter-icon-btn"><i className="bi bi-sliders2" /></button>
        </section>

        <section className="children-grid">
          {filteredChildren.map((child) => <ChildrenCard child={child} key={child.id} />)}
        </section>

        <div className="children-bottom-space" />
      </main>

      {/* <nav className="mobile-bottom-nav">
        <button><i className="bi bi-house-door" /><span>Tổng quan</span></button>
        <button className="active"><i className="bi bi-person-bounding-box" /><span>Trẻ</span></button>
        <button><i className="bi bi-calendar2-check" /><span>Lịch</span></button>
        <button><i className="bi bi-envelope" /><span>Tin nhắn</span></button>
        <button><i className="bi bi-gear" /><span>Cài đặt</span></button>
      </nav> */}
    </div>
  );
}
