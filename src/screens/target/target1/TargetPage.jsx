import React, { useMemo, useState } from 'react';
import TargetCard from './TargetCard';
import { filterChips, targetRows } from './targetData';
import './TargetPage.css';

const menus = [
  { icon: 'bi-house-door', label: 'Tổng quan' },
  { icon: 'bi-person-badge', label: 'Thông tin trẻ' },
  { icon: 'bi-bullseye', label: 'Ngân hàng mục tiêu', active: true },
  { icon: 'bi-calendar2-check', label: 'Kế hoạch can thiệp' },
  { icon: 'bi-clipboard2-data', label: 'Báo cáo can thiệp' },
  { icon: 'bi-clock', label: 'Chờ duyệt' },
  { icon: 'bi-cart3', label: 'Giỏ mục tiêu' },
];

export default function TargetPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [activeChip, setActiveChip] = useState('Tất cả');

  const targets = useMemo(() => {
    const text = keyword.trim().toLowerCase();
    return targetRows.filter((item) => {
      const matchChip = activeChip === 'Tất cả' || item.level === activeChip;
      const matchText = !text || `${item.title} ${item.strategy} ${item.support} ${item.code}`.toLowerCase().includes(text);
      return matchChip && matchText;
    });
  }, [activeChip, keyword]);

  return (
    <div className="target-shell">
      {sidebarOpen && <button className="target-overlay" onClick={() => setSidebarOpen(false)} />}

      <aside className={`target-sidebar ${sidebarOpen ? 'show' : ''}`}>
        <div className="target-logo">
          <div className="target-logo-mark">
            <span className="star s1">★</span><span className="star s2">★</span><span className="star s3">★</span>
            <i className="bi bi-person-arms-up" />
          </div>
          <strong>AN KHANG</strong>
          <small>EDUCATION</small>
        </div>

        <nav className="target-menu">
          {menus.map((menu) => (
            <button key={menu.label} className={`target-menu-item ${menu.active ? 'active' : ''}`}>
              <i className={`bi ${menu.icon}`} />
              <span>{menu.label}</span>
            </button>
          ))}
        </nav>

        <div className="target-sidebar-art">
          <span className="art-star a1">★</span><span className="art-star a2">★</span><span className="art-star a3">★</span><span className="art-star a4">★</span>
          <div className="children-art"><span>👦</span><span className="hand">🙌</span><span>👧</span></div>
        </div>
      </aside>

      <main className="target-main">
        <header className="target-topbar">
          <button className="target-mobile-menu" onClick={() => setSidebarOpen(true)}><i className="bi bi-list" /></button>
          <div className="target-page-title">
            <button className="target-back-btn"><i className="bi bi-chevron-left" /></button>
            <div>
              <h1>Ngôn ngữ hiểu</h1>
              <p>Danh sách mục tiêu can thiệp theo lĩnh vực đã chọn</p>
            </div>
          </div>
          <div className="target-userbox">
            <button className="target-bell"><i className="bi bi-bell" /><span>3</span></button>
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face" alt="Cô An" />
            <div><strong>Cô An</strong><small>Giáo viên</small></div>
            <i className="bi bi-chevron-down" />
          </div>
        </header>

        <section className="target-content">
          <div className="target-bg-star one">★</div><div className="target-bg-star two">★</div><div className="target-bg-star three">★</div>

          <div className="target-hero">
            <div className="target-hero-text">
              <span className="target-eyebrow"><i className="bi bi-stars" /> Ngân hàng mục tiêu</span>
              <h2>Chọn mục tiêu phù hợp cho kế hoạch của trẻ</h2>
              <p>Mỗi mục tiêu có chiến lược và mức độ hỗ trợ rõ ràng để giáo viên dễ thêm vào giỏ mục tiêu.</p>
              <div className="target-stats">
                <div><b>{targetRows.length}</b><span>Mục tiêu</span></div>
                <div><b>3</b><span>Mức độ</span></div>
                <div><b>1</b><span>Lĩnh vực</span></div>
              </div>
            </div>
            <div className="target-hero-art">
              <div className="target-circle" />
              <div className="target-kid">👧💡</div>
            </div>
          </div>

          <div className="target-toolbar">
            <div className="target-search">
              <i className="bi bi-search" />
              <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Tìm kiếm mục tiêu..." />
            </div>
            <div className="target-chips">
              {filterChips.map((chip) => (
                <button key={chip} onClick={() => setActiveChip(chip)} className={activeChip === chip ? 'active' : ''}>{chip}</button>
              ))}
            </div>
          </div>

          <div className="target-table-card">
            <div className="target-table-head">
              <span>STT</span><span>Mục tiêu</span><span>Thao tác</span>
            </div>
            <div className="target-list">
              {targets.map((item, index) => <TargetCard key={item.id} item={item} index={index} />)}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
