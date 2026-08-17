import React from 'react';

export default function InfoTile({ icon, label, value }) {
  return (
    <div className="child-info-tile">
      <span><i className={`bi ${icon}`} /></span>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
    </div>
  );
}
