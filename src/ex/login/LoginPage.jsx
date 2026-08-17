import { useState } from 'react';
import './LoginPage.css';

const Logo = () => (
  <div className="ak-login-logo">
    <div className="ak-login-logo-mark">
      <span className="ak-logo-star s1">★</span>
      <span className="ak-logo-star s2">★</span>
      <span className="ak-logo-child">✦</span>
    </div>
    <div className="ak-login-logo-text">AN KHANG</div>
    <div className="ak-login-logo-sub">EDUCATION</div>
  </div>
);

const Illustration = ({ compact = false }) => (
  <div className={compact ? 'ak-illus ak-illus-mobile' : 'ak-illus'}>
    <div className="ak-floating-icon book"><i className="bi bi-book"></i></div>
    <div className="ak-floating-icon chart"><i className="bi bi-bar-chart-fill"></i></div>
    <div className="ak-floating-icon star">★</div>
    <div className="ak-floating-icon heart">♥</div>
    <div className="ak-kids">
      <div className="ak-kid boy"><div className="head"><span></span></div><div className="body"></div></div>
      <div className="ak-book-center"></div>
      <div className="ak-kid girl"><div className="head"><span></span></div><div className="body"></div></div>
    </div>
  </div>
);

const LoginForm = ({ loading, onSubmit }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form className="ak-login-card" onSubmit={onSubmit}>
      <h2>Đăng nhập</h2>
      <p>Vui lòng nhập thông tin tài khoản</p>

      <label>Email hoặc số điện thoại</label>
      <div className="ak-input-wrap">
        <i className="bi bi-person"></i>
        <input type="text" placeholder="Nhập email hoặc số điện thoại" />
      </div>

      <label>Mật khẩu</label>
      <div className="ak-input-wrap">
        <i className="bi bi-lock"></i>
        <input type={showPassword ? 'text' : 'password'} placeholder="Nhập mật khẩu" />
        <button type="button" className="ak-eye" onClick={() => setShowPassword(!showPassword)}>
          <i className={showPassword ? 'bi bi-eye' : 'bi bi-eye-slash'}></i>
        </button>
      </div>

      <div className="ak-login-row">
        <label className="ak-remember"><input type="checkbox" defaultChecked /> <span>Ghi nhớ đăng nhập</span></label>
        <button type="button" className="ak-link-btn">Quên mật khẩu?</button>
      </div>

      <button className="ak-primary-btn" type="submit" disabled={loading}>
        {loading ? 'Đang xử lý...' : 'Đăng nhập'}
      </button>

      <div className="ak-divider"><span></span><em>hoặc đăng nhập với</em><span></span></div>

      <button className="ak-google-btn" type="button">
        <span className="ak-google-g">G</span>
        Đăng nhập với Google
      </button>

      <div className="ak-register-text">Chưa có tài khoản? <button type="button">Đăng ký ngay</button></div>
    </form>
  );
};

const LoadingOverlay = ({ show }) => {
  if (!show) return null;
  return (
    <div className="ak-login-overlay">
      <div className="ak-loading-box">
        <div className="ak-spinner"></div>
        <strong>Đang xử lý...</strong>
        <span>Vui lòng chờ trong giây lát</span>
      </div>
    </div>
  );
};

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 2200);
  };

  return (
    <div className="ak-login-page">
      <div className="ak-bg-star st1">★</div>
      <div className="ak-bg-star st2">★</div>
      <div className="ak-bg-star st3">✦</div>
      <div className="ak-login-shell">
        <section className="ak-login-left">
          <Logo />
          <div className="ak-mobile-top-illus"><Illustration compact /></div>
          <div className="ak-welcome">
            <h1>Chào mừng<br />bạn trở lại 👋</h1>
            <p>Đăng nhập để tiếp tục quản lý và đồng hành cùng trẻ mỗi ngày.</p>
          </div>
          <div className="ak-desktop-illus"><Illustration /></div>
        </section>

        <section className="ak-login-right">
          <LoginForm loading={loading} onSubmit={handleSubmit} />
        </section>

        <div className="ak-login-footer">© 2024 An Khang Education. All rights reserved.</div>
        <div className="ak-wave blue"></div>
        <div className="ak-wave yellow"></div>
      </div>
      <LoadingOverlay show={loading} />
    </div>
  );
}
