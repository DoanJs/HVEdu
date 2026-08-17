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

export default function LoadingMobile({ processing }) {
  return (
    <section className="ak-loading-mobile">
      <div className="ak-phone-status">
        <b>9:41</b>
        <span />
        <div>
          <i className="bi bi-reception-4" />
          <i className="bi bi-wifi" />
          <i className="bi bi-battery-full" />
        </div>
      </div>

      <Logo />

      <div className="ak-welcome-text">
        <h1>Chào mừng bạn trở lại 👋</h1>
        <p>Đăng nhập để tiếp tục quản lý và đồng hành cùng trẻ mỗi ngày.</p>
      </div>

      <form className="ak-login-card">
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
          <a href="#">Quên mật khẩu?</a>
        </div>

        <button type="button" className="ak-login-btn">Đăng nhập</button>
        <div className="ak-divider"><span>hoặc đăng nhập với</span></div>
        <button type="button" className="ak-google-btn"><b>G</b> Đăng nhập với Google</button>
        <div className="ak-signup">Chưa có tài khoản? <a href="#">Đăng ký ngay</a></div>
      </form>

      <LoadingOverlay show={processing} />
    </section>
  );
}
