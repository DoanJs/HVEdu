import React from 'react';
import './SplashPage.css';
import SplashStep from './SplashStep';
import { loadingSteps, notificationNotes, statusCards } from './splashData';

export default function SplashPage() {
  return (
    <main className="ak-splash-page">
      <section className="splash-hero">
        <div className="soft-star st-1">★</div>
        <div className="soft-star st-2">★</div>
        <div className="soft-star st-3">★</div>

        <div className="splash-logo">
          <div className="logo-circle"><i className="bi bi-stars" /></div>
          <h1>AN KHANG</h1>
          <span>EDUCATION</span>
        </div>

        <div className="loading-title">
          <h2>Đang tải dữ liệu...</h2>
          <p>Vui lòng chờ trong giây lát</p>
        </div>

        <div className="desktop-steps">
          {loadingSteps.map((step) => <SplashStep key={step.id} step={step} />)}
        </div>

        <div className="mobile-steps">
          {loadingSteps.map((step) => <SplashStep key={step.id} step={step} compact />)}
        </div>

        <div className="progress-wrap">
          <div className="progress-track"><div className="progress-fill" /></div>
          <strong>65%</strong>
        </div>

        <div className="notify-card">
          <div className="notify-icon"><i className="bi bi-bell" /></div>
          <div>
            <strong>Đang kết nối với dịch vụ thông báo (FCM)</strong>
            <p>Để đảm bảo bạn không bỏ lỡ thông tin quan trọng</p>
          </div>
          <div className="signal-dots"><span /><span /><i className="bi bi-wifi" /></div>
        </div>

        <div className="cloud-illus">
          <span className="boy">👦</span>
          <div className="cloud"><i className="bi bi-bell-fill" /><b>1</b></div>
          <span className="girl">👧</span>
          <span className="plane">✈</span>
        </div>

        <div className="tip-card">
          <i className="bi bi-lightbulb" />
          <div><strong>Mẹo nhỏ</strong><p>Hãy bật thông báo để nhận cập nhật kế hoạch và báo cáo của trẻ kịp thời!</p></div>
        </div>
      </section>

      <section className="splash-extra">
        <div>
          <h3>Các trạng thái Loading</h3>
          <div className="status-grid">
            {statusCards.map((card) => (
              <article className="status-card" key={card.title}>
                <div className={`mini-icon ${card.tone}`}><i className={`bi ${card.icon}`} /></div>
                <strong>{card.title}</strong>
                <p>{card.desc}</p>
                <div className="mini-dots"><span /><span /><span /><span /></div>
              </article>
            ))}
          </div>
        </div>

        <div className="note-panel">
          <h3>Liên quan đến Push Notification (FCM)</h3>
          {notificationNotes.map((item, index) => (
            <p key={item}><i className={`bi ${['bi-bell','bi-wifi','bi-cloud-arrow-up','bi-shield-check'][index]}`} /> {item}</p>
          ))}
        </div>

        <div className="companion-card">
          <div className="big-bell"><i className="bi bi-bell" /><b>1</b></div>
          <strong>Luôn đồng hành cùng bạn</strong>
          <p>Nhận thông báo kịp thời<br />- Không bỏ lỡ thông tin quan trọng!</p>
        </div>
      </section>
    </main>
  );
}
