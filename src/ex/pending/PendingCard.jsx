import React from 'react';

function PlanIllustration() {
  return (
    <div className="pending-hero-art plan-art" aria-hidden="true">
      <span className="cloud c1" />
      <span className="cloud c2" />
      <span className="leaf l1" />
      <span className="leaf l2" />
      <span className="big-star">★</span>
      <span className="calendar-back" />
      <span className="calendar-front">
        <i className="ring r1" />
        <i className="ring r2" />
        <i className="ring r3" />
        <i className="ring r4" />
        <b className="dot d1" />
        <b className="dot d2" />
        <b className="dot d3" />
        <b className="dot d4" />
        <b className="dot d5" />
        <b className="dot d6" />
      </span>
    </div>
  );
}

function ReportIllustration() {
  return (
    <div className="pending-hero-art report-art" aria-hidden="true">
      <span className="cloud c1" />
      <span className="cloud c2" />
      <span className="heart" />
      <span className="report-board">
        <i className="clip" />
        <b className="pie" />
        <em className="line ln1" />
        <em className="line ln2" />
        <em className="line ln3" />
        <i className="bar b1" />
        <i className="bar b2" />
        <i className="bar b3" />
      </span>
    </div>
  );
}

export default function PendingCard({ item }) {
  const isPlan = item.type === 'plan';

  return (
    <article className={`pending-card ${isPlan ? 'plan' : 'report'}`}>
      <span className="floating-star st-left">★</span>
      <span className="floating-star st-right">★</span>

      <span className="pending-type-badge">{item.label}</span>

      {isPlan ? <PlanIllustration /> : <ReportIllustration />}

      <div className="pending-title-block">
        <h2>{item.title}</h2>
        <strong>{item.month}</strong>
      </div>

      <div className="pending-info-box">
        <div className="info-row">
          <i className="bi bi-bullseye" />
          <span>Tổng số mục tiêu</span>
          <strong>{item.totalGoals} mục tiêu</strong>
        </div>
        <div className="info-row">
          <i className="bi bi-calendar2-check" />
          <span>Ngày tạo</span>
          <strong>{item.createdAt}</strong>
        </div>
        <div className="info-row">
          <i className="bi bi-person-badge" />
          <span>Giáo viên thực hiện</span>
          <div className="teacher-mini">
            <img src="https://i.pravatar.cc/80?img=47" alt={item.teacher} />
            <strong>{item.teacher}</strong>
          </div>
        </div>
      </div>

      <div className="waiting-strip">
        <span className="clock-dot"><i className="bi bi-clock-fill" /></span>
        <div>
          <strong>ĐANG CHỜ DUYỆT</strong>
          <p>Dự kiến phê duyệt trước: {item.dueDate}</p>
        </div>
        <span className={`kid ${isPlan ? 'boy' : 'girl'}`}>{isPlan ? '👦' : '👧'}</span>
      </div>

      <button className="detail-btn">
        <i className="bi bi-eye" />
        Xem chi tiết
      </button>
    </article>
  );
}
