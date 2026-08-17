import React from 'react';

function ReportIllustration({ type = 'bar' }) {
  return (
    <div className={`report-illustration report-illustration-${type}`}>
      <div className="clip-head">
        <span />
      </div>
      <div className="paper-lines">
        <i />
        <i />
        <i />
      </div>
      {type === 'donut' ? (
        <div className="donut-chart" />
      ) : type.includes('pie') ? (
        <div className="pie-chart" />
      ) : type === 'line' ? (
        <div className="line-chart">
          <b />
          <b />
          <b />
        </div>
      ) : (
        <div className="bar-chart">
          <b />
          <b />
          <b />
        </div>
      )}
    </div>
  );
}

export default function ReportCard({ item }) {
  return (
    <article className={`report-card card-${item.color}`}>
      {item.newest && <span className="newest-badge">MỚI NHẤT</span>}
      <span className="pin-ribbon"><i className="bi bi-pin-angle-fill" /></span>

      <div className="card-top">
        <ReportIllustration type={item.chart} />
        <div className="card-title-group">
          <h3>{item.month}</h3>
          <p>{item.subTitle}</p>
        </div>
      </div>

      <div className="card-stats">
        <div>
          <i className="bi bi-bullseye" />
          <strong>{item.target}</strong>
          <span>Mục tiêu</span>
        </div>
        <div>
          <i className="bi bi-calendar2-check" />
          <strong>{item.report}</strong>
          <span>Báo cáo</span>
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
            <img src="https://i.pravatar.cc/80?img=47" alt="teacher" />
            <div>
              <strong>{item.teacher}</strong>
              <span>Tạo ngày: {item.createdAt}</span>
            </div>
          </div>
          <span className={`status-badge ${item.status === 'Đã duyệt' ? 'approved' : 'pending'}`}>
            {item.status}
          </span>
        </div>
      </div>
    </article>
  );
}
