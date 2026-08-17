import React from "react";
import LoadingOverlay from "./LoadingOverlay";

function Logo() {
  return (
    <div className="ak-loading-logo">
      <div className="ak-loading-logo-mark">
        <i className="bi bi-star-fill ak-logo-star ak-star-1" />
        <i className="bi bi-globe-asia-australia ak-logo-globe" />
        <i className="bi bi-person-arms-up ak-logo-person" />
        <i className="bi bi-star-fill ak-logo-star ak-star-2" />
      </div>
      <div className="ak-loading-logo-name">AN KHANG</div>
      <div className="ak-loading-logo-sub">EDUCATION</div>
    </div>
  );
}

export default function LoadingDesktop({ processing }) {
  return (
    <section className="ak-loading-desktop">
      <div className="ak-login-left">
        <Logo />

        <div className="ak-welcome-text">
          <h1>Chào mừng bạn trở lại 👋</h1>
          <p>Đăng nhập để tiếp tục quản lý và đồng hành cùng trẻ mỗi ngày.</p>
        </div>

        <div className="ak-kids-area" aria-hidden="true">
          <span className="ak-float-icon ak-book"><i className="bi bi-book" /></span>
          <span className="ak-float-icon ak-chart"><i className="bi bi-bar-chart-fill" /></span>
          <span className="ak-yellow-star">★</span>
          <div className="ak-kids-illus">
            <div className="ak-kid ak-boy" />
            <div className="ak-blue-book" />
            <div className="ak-kid ak-girl" />
          </div>
        </div>

        <div className="ak-quote">
          “Mỗi bước nhỏ hôm nay<br />là nền tảng cho tương lai tươi sáng của trẻ.” <span>♥</span>
        </div>
      </div>

      <form className="ak-login-card">
        <h2>Đăng nhập</h2>
        <p>Vui lòng nhập thông tin tài khoản</p>

        <label>Email hoặc số điện thoại</label>
        <div className="ak-input-box">
          <i className="bi bi-person" />
          <input placeholder="Nhập email hoặc số điện thoại" />
        </div>

        <label>Mật khẩu</label>
        <div className="ak-input-box">
          <i className="bi bi-lock" />
          <input type="password" placeholder="Nhập mật khẩu" />
          <i className="bi bi-eye" />
        </div>

        <div className="ak-form-tools">
          <span><input type="checkbox" defaultChecked /> Ghi nhớ đăng nhập</span>
          <a href="#">Quên mật khẩu?</a>
        </div>

        <button type="button" className="ak-login-btn">Đăng nhập</button>
        <div className="ak-divider"><span>hoặc đăng nhập với</span></div>
        <button type="button" className="ak-google-btn"><b>G</b> Đăng nhập với Google</button>
        <div className="ak-signup">Chưa có tài khoản? <a href="#">Đăng ký ngay</a></div>
      </form>

      <div className="ak-copyright">© 2024 An Khang Education. All rights reserved.</div>
      <LoadingOverlay show={processing} />
    </section>
  );
}
