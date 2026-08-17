import React from 'react';

export default function TargetCard({ item, index }) {
  return (
    <article className="target-card">
      <div className="target-index">{String(index + 1).padStart(2, '0')}</div>
      <div className="target-info">
        <div className="target-card-head">
          <span className="target-code">{item.code}</span>
          <span className={`target-level ${item.level === 'Cơ bản' ? 'basic' : item.level === 'Trung bình' ? 'medium' : 'high'}`}>
            {item.level}
          </span>
        </div>
        <h3>{item.title}</h3>
        <p><b>Chiến lược:</b> {item.strategy}</p>
        <p><b>Mức độ hỗ trợ:</b> {item.support}</p>
      </div>
      <button className="target-add-btn" type="button">
        <i className="bi bi-cart-plus" />
        <span>Thêm</span>
      </button>
    </article>
  );
}
