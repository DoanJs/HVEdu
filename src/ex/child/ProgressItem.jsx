import React from 'react';

export default function ProgressItem({ item }) {
  return (
    <div className={`progress-item ${item.color}`}>
      <div className="progress-head">
        <span><i className={`bi ${item.icon}`} /></span>
        <strong>{item.field}</strong>
        <em>{item.progress}%</em>
      </div>
      <div className="progress-track"><div style={{ width: `${item.progress}%` }} /></div>
    </div>
  );
}
