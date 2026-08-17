import React from 'react';

export default function PlanCard({ item }: any) {
  const statusClass = item.status === 'Đã duyệt' ? 'approved' : 'pending';

  return (
    <article className={`plan-card card-${item.color}`}>
      {item.newest && <span className="newest-badge">MỚI NHẤT</span>}

      <span className={`pin-ribbon ${item.waitingPin ? 'waiting' : ''}`}>
        <i className={`bi ${item.waitingPin ? 'bi-clock-fill' : 'bi-pin-angle-fill'}`} />
      </span>

      <div className="card-top">
        <div className="plan-illustration" aria-hidden="true">
          <span className="calendar-sheet sheet-back" />
          <span className="calendar-sheet sheet-front">
            <i className="ring r1" />
            <i className="ring r2" />
            <i className="ring r3" />
            <b className="dot d1" />
            <b className="dot d2" />
            <b className="dot d3" />
            <b className="dot d4" />
            <em />
          </span>
        </div>

        <div className="card-title-group">
          <h3>{item.month}</h3>
          <p>{item.subTitle}</p>
        </div>
      </div>

      <div className="card-stats">
        <div>
          <i className="bi bi-bullseye" />
          <strong>{item.goals}</strong>
          <span>Mục tiêu</span>
        </div>
        <div>
          <i className="bi bi-calendar2-check" />
          <strong>{item.plans}</strong>
          <span>Kế hoạch</span>
        </div>
        <div>
          <i className="bi bi-check-circle" />
          <strong>{item.approved}</strong>
          <span>Đã duyệt</span>
        </div>
      </div>

      <div className="teacher-block">
        <p>Giáo viên thực hiện</p>
        <div className="teacher-row">
          <div className="teacher-info">
            <img src="https://i.pravatar.cc/80?img=47" alt={item.teacher} />
            <div>
              <strong>{item.teacher}</strong>
              <span>Tạo ngày: {item.createdAt}</span>
            </div>
          </div>
          <span className={`status-badge ${statusClass}`}>{item.status}</span>
        </div>
      </div>
    </article>
  );
}
