import React from "react";

export default function UserStatCard({ item }) {
  return (
    <article className="user-stat-card">
      <div className="user-stat-icon">
        <i className={`bi ${item.icon}`} />
      </div>
      <div>
        <span>{item.label}</span>
        <strong>{item.value}</strong>
        <p>{item.desc}</p>
      </div>
    </article>
  );
}
