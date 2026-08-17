import React from 'react';

export default function PlanTaskRow({ item }) {
  return (
    <div className="plan-task-row">
      <div className="plan-col index-col">{item.id}</div>
      <div className="plan-col target-col">{item.target}</div>
      <div className="plan-col field-col">
        <span className={`field-dot ${item.fieldClass}`}><i className={`bi ${item.fieldIcon}`} /></span>
        <strong>{item.field}</strong>
      </div>
      <div className="plan-col support-col">
        <button className={`support-select ${item.supportClass}`}>
          <span className="support-light" />
          {item.support}
          <i className="bi bi-chevron-down" />
        </button>
      </div>
      <div className="plan-col content-col">
        <div className="content-box">{item.content}</div>
      </div>
    </div>
  );
}
