import React from 'react';

export default function AddReportRow({ item }) {
  return (
    <div className="add-report-row">
      <div className="field-cell">
        <span className={`field-dot ${item.color}`}><i className={`bi ${item.icon}`} /></span>
        <strong>{item.field}</strong>
      </div>
      <div className="goal-cell">{item.goal}</div>
      <div className="support-cell">
        <button className={`support-select ${item.supportType}`}>
          <span><i />{item.support}</span>
          <i className="bi bi-chevron-down" />
        </button>
      </div>
      <div className="summary-cell">
        <textarea defaultValue={item.summary} />
      </div>
    </div>
  );
}
