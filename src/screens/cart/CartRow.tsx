import React from 'react';

export default function CartRow({ item }: any) {
  return (
    <article className={`cart-row row-${item.fieldColor}`}>
      <div className="field-cell">
        <div className={`field-illus illus-${item.fieldColor}`}>
          <span className="child-face">{item.child}</span>
          <span className="field-symbol">{item.icon}</span>
        </div>
        <strong>{item.field.split('\n').map((line: any) => <React.Fragment key={line}>{line}<br /></React.Fragment>)}</strong>
      </div>

      <div className="target-cell">
        <h3>{item.target}</h3>
        <p>{item.example}</p>
      </div>

      <div className="strategy-cell">
        <i className={`bi ${item.strategyIcon} strategy-${item.strategyColor}`} />
        <p>{item.strategy.split('\n').map((line: any) => <React.Fragment key={line}>{line}<br /></React.Fragment>)}</p>
      </div>

      <div className="support-cell">
        <span className={`support-badge ${item.supportType}`}>{item.support}</span>
      </div>

      <div className="action-cell">
        <button className="delete-row" aria-label="Xóa mục tiêu">
          <i className="bi bi-trash3" />
        </button>
      </div>
    </article>
  );
}
