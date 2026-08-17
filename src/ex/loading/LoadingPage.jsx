import React, { useState } from "react";
import "./LoadingPage.css";
import { loadingTypes, uxNotes, principles } from "./loadingData";

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

function LoadingOverlay({ show, title = "Đang xử lý...", desc = "Vui lòng chờ trong giây lát" }) {
  if (!show) return null;
  return (
    <div className="ak-processing-overlay" role="status" aria-live="polite">
      <div className="ak-processing-box">
        <div className="ak-processing-spinner" />
        <h3>{title}</h3>
        <p>{desc}</p>
      </div>
    </div>
  );
}

function LoginDemo({ processing = false, mobile = false }) {
  return (
    <section className={mobile ? "ak-phone-screen" : "ak-login-demo"}>
      {mobile && (
        <div className="ak-phone-status">
          <b>9:41</b>
          <span />
          <div>
            <i className="bi bi-reception-4" />
            <i className="bi bi-wifi" />
            <i className="bi bi-battery-full" />
          </div>
        </div>
      )}

      <div className="ak-login-left">
        <Logo />
        <div className="ak-welcome-text">
          <h1>Chào mừng bạn trở lại 👋</h1>
          <p>Đăng nhập để tiếp tục quản lý và đồng hành cùng trẻ mỗi ngày.</p>
        </div>

        {!mobile && (
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
        )}

        {!mobile && <div className="ak-quote">“Mỗi bước nhỏ hôm nay<br />là nền tảng cho tương lai tươi sáng của trẻ.” <span>♥</span></div>}
      </div>

      <form className="ak-login-card">
        {!mobile && <h2>Đăng nhập</h2>}
        {!mobile && <p>Vui lòng nhập thông tin tài khoản</p>}

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

      {!mobile && <div className="ak-copyright">© 2024 An Khang Education. All rights reserved.</div>}
      <LoadingOverlay show={processing} />
    </section>
  );
}

export default function LoadingPage() {
  const [processing, setProcessing] = useState(true);

  return (
    <div className="ak-loading-page">
      <div className="ak-bg-stars"><span /><span /><span /><span /></div>

      <main className="ak-loading-preview-grid">
        <div className="ak-desktop-frame">
          <LoginDemo processing={processing} />
        </div>

        <div className="ak-phone-frame">
          <LoginDemo mobile processing={false} />
        </div>

        <div className="ak-phone-frame">
          <LoginDemo mobile processing={processing} />
        </div>
      </main>

      <section className="ak-loading-info-grid">
        <div className="ak-panel ak-states-panel">
          <h3>Các trạng thái Loading</h3>
          <div className="ak-state-grid">
            {loadingTypes.map((item) => (
              <article className="ak-state-card" key={item.title}>
                <span className={`ak-state-icon ${item.color}`}><i className={`bi ${item.icon}`} /></span>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
                <small>{item.note}</small>
              </article>
            ))}
          </div>
        </div>

        <div className="ak-panel">
          <h3>Ghi chú UX</h3>
          {uxNotes.map((item) => <p className="ak-check-row" key={item}><i className="bi bi-check-circle-fill" />{item}</p>)}
        </div>

        <div className="ak-panel">
          <h3>Nguyên tắc áp dụng</h3>
          {principles.map((item) => <p className="ak-principle-row" key={item.title}><span><i className={`bi ${item.icon}`} /></span>{item.title}</p>)}
        </div>
      </section>

      <button className="ak-toggle-loading" onClick={() => setProcessing((v) => !v)}>
        {processing ? "Ẩn loading" : "Hiện loading"}
      </button>
    </div>
  );
}
