import React, { useMemo, useState } from 'react';
import './CartPage.css';
import CartRow from './CartRow';
import { cartTargets, menuItems } from './cartData';

export default function CartPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [keyword, setKeyword] = useState('');

  const filteredTargets = useMemo(() => {
    const text = keyword.trim().toLowerCase();
    if (!text) return cartTargets;
    return cartTargets.filter((item) => `${item.field} ${item.target} ${item.strategy}`.toLowerCase().includes(text));
  }, [keyword]);

  return (
    <div className="ak-cart-page">
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
          <div className="title-area">
            <div>
              <h1>Giỏ mục tiêu</h1>
              <p>Danh sách mục tiêu đã chọn, Bạn có thể tạo kế hoạch hoặc báo cáo từ giỏ mục tiêu.</p>
            </div>
          </div>

          <div className="user-area">
            <button className="bell-btn"><i className="bi bi-bell" /><span>3</span></button>
            <img src="https://i.pravatar.cc/80?img=47" alt="avatar" />
            <div><strong>Cô An</strong><p>Giáo viên</p></div>
            <i className="bi bi-chevron-down" />
          </div>
        </header>

        <section className="cart-toolbar">
          <div className="search-box">
            <i className="bi bi-search" />
            <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Tìm kiếm mục tiêu trong giỏ..." />
          </div>
          <div className="toolbar-actions">
            <button className="clear-btn"><i className="bi bi-trash3" /> Xóa tất cả</button>
            <button className="primary-btn"><i className="bi bi-file-earmark-plus" /> Tạo kế hoạch / báo cáo</button>
          </div>
        </section>

        <section className="cart-table-card">
          <div className="cart-head">
            <span>LĨNH VỰC</span>
            <span>MỤC TIÊU</span>
            <span>CHIẾN LƯỢC</span>
            <span>MỨC ĐỘ HỖ TRỢ</span>
            <span>THAO TÁC</span>
          </div>

          <div className="cart-list">
            {filteredTargets.map((item) => <CartRow key={item.id} item={item} />)}
          </div>
        </section>

        <footer className="cart-footer">
          <div className="total-card">
            <i className="bi bi-bullseye" />
            <div><span>Tổng số mục tiêu</span><strong>{String(filteredTargets.length).padStart(2, '0')}</strong></div>
          </div>
          <div className="info-card"><i className="bi bi-info-circle" /> Bạn có thể tạo kế hoạch can thiệp hoặc báo cáo can thiệp từ các mục tiêu trong giỏ.</div>
          <button className="continue-btn"><i className="bi bi-cart-plus" /> Tiếp tục chọn mục tiêu</button>
          <button className="primary-btn bottom"><i className="bi bi-file-earmark-plus" /> Tạo kế hoạch / báo cáo</button>
        </footer>
      </main>
    </div>
  );
}
