import React from 'react';

export default function MobileReportCard({ item }) {
  return (
    <article className="mobile-report-card">
      <div className="mobile-card-head">
        <div className="field-cell">
          <span className={`field-dot ${item.color}`}><i className={`bi ${item.icon}`} /></span>
          <strong>{item.field}</strong>
        </div>
        <i className="bi bi-chevron-up" />
      </div>
      <label>Mục tiêu</label>
      <p>{item.goal}</p>
      <label>Mức độ hỗ trợ</label>
      <button className={`support-select ${item.supportType}`}>
        <span><i />{item.support}</span>
        <i className="bi bi-chevron-down" />
      </button>
      <label>Tổng kết</label>
      <textarea defaultValue={item.summary} />
    </article>
  );
}
