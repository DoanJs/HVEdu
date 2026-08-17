import { useMemo, useState } from 'react';
import './CartDemoPage.css';
import CartDemoCard from './CartDemoCard';
import { cartDemoItems } from './cartDemoData';

const menuItems = [
  ['bi-house-door', 'Tổng quan'],
  ['bi-person-bounding-box', 'Thông tin trẻ'],
  ['bi-bullseye', 'Ngân hàng mục tiêu'],
  ['bi-calendar2-check', 'Kế hoạch can thiệp'],
  ['bi-clipboard2-data', 'Báo cáo can thiệp'],
  ['bi-clock', 'Chờ duyệt'],
  ['bi-cart3', 'Giỏ mục tiêu'],
];

export default function CartDemoPage() {
  const [keyword, setKeyword] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredItems = useMemo(() => {
    const key = keyword.trim().toLowerCase();
    if (!key) return cartDemoItems;
    return cartDemoItems.filter(
      (item) =>
        item.field.toLowerCase().includes(key) ||
        item.target.toLowerCase().includes(key) ||
        item.strategy.toLowerCase().includes(key)
    );
  }, [keyword]);

  return (
    <div className="cart-demo-shell">
      <aside className={`cart-demo-sidebar ${sidebarOpen ? 'show' : ''}`}>
        <div className="cart-demo-logo">
          <div className="logo-circle">
            <span className="logo-star one">★</span>
            <span className="logo-star two">★</span>
            <span className="logo-person">♜</span>
          </div>
          <strong>AN KHANG</strong>
          <small>EDUCATION</small>
        </div>

        <nav className="cart-demo-menu">
          {menuItems.map(([icon, label]) => (
            <button key={label} className={`cart-demo-menu-item ${label === 'Giỏ mục tiêu' ? 'active' : ''}`}>
              <i className={`bi ${icon}`}></i>
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="cart-demo-kids">
          <div className="star s1">★</div>
          <div className="star s2">★</div>
          <div className="star s3">★</div>
          <div className="kids-emoji">🧒🏻🙌👧🏻</div>
          <div className="wave blue"></div>
          <div className="wave yellow"></div>
        </div>
      </aside>

      {sidebarOpen && <button className="cart-demo-overlay" onClick={() => setSidebarOpen(false)} />}

      <main className="cart-demo-main">
        <div className="cart-demo-stars-bg">
          <span>★</span><span>★</span><span>★</span>
        </div>

        <header className="cart-demo-topbar">
          <button className="cart-demo-mobile-menu" onClick={() => setSidebarOpen(true)}>
            <i className="bi bi-list"></i>
          </button>

          <div className="cart-demo-title-wrap">
            <h1><i className="bi bi-cart3"></i> Giỏ mục tiêu</h1>
            <p>Danh sách mục tiêu đã chọn. Bạn có thể tạo kế hoạch hoặc báo cáo từ giỏ mục tiêu.</p>
          </div>

          <div className="cart-demo-user">
            <button className="bell">
              <i className="bi bi-bell"></i>
              <span>3</span>
            </button>
            <div className="teacher-avatar">👩🏻</div>
            <div className="teacher-info">
              <strong>Cô An</strong>
              <small>Giáo viên</small>
            </div>
            <i className="bi bi-chevron-down"></i>
          </div>
        </header>

        <section className="cart-demo-actions">
          <div className="cart-demo-search">
            <i className="bi bi-search"></i>
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm kiếm mục tiêu trong giỏ..."
            />
          </div>

          <div className="cart-demo-action-buttons">
            <button className="btn-outline-danger-soft">
              <i className="bi bi-trash3"></i>
              Xóa tất cả
            </button>
            <button className="btn-primary-blue">
              <i className="bi bi-file-earmark-text"></i>
              Tạo kế hoạch / báo cáo
            </button>
          </div>
        </section>

        <section className="cart-demo-grid">
          {filteredItems.map((item) => (
            <CartDemoCard key={item.id} item={item} />
          ))}
        </section>

        <footer className="cart-demo-footerbar">
          <div className="cart-demo-total">
            <i className="bi bi-bullseye"></i>
            <div>
              <span>Tổng số mục tiêu</span>
              <strong>{String(filteredItems.length).padStart(2, '0')}</strong>
            </div>
          </div>

          <div className="cart-demo-note">
            <i className="bi bi-info-circle"></i>
            <span>Bạn có thể tạo kế hoạch can thiệp hoặc báo cáo can thiệp từ các mục tiêu trong giỏ.</span>
          </div>

          <button className="cart-demo-continue">
            <i className="bi bi-cart3"></i>
            Tiếp tục chọn mục tiêu
          </button>

          <button className="btn-primary-blue footer-create">
            <i className="bi bi-file-earmark-text"></i>
            Tạo kế hoạch / báo cáo
          </button>
        </footer>
      </main>
    </div>
  );
}
