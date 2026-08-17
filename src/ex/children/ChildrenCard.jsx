import React from 'react';

export default function ChildrenCard({ child }) {
  return (
    <article className="ak-child-card">
      <div className="child-photo-wrap">
        <img className="child-photo" src={child.avatar} alt={child.name} />
        <span className={`child-status ${child.statusType}`}>{child.status}</span>
      </div>

      <div className="child-body">
        <h3>{child.name}</h3>
        <div className="child-meta">
          <span><i className="bi bi-calendar3" /> {child.birthday}</span>
          <span><i className="bi bi-gender-ambiguous" /> {child.gender}</span>
          <span><i className="bi bi-people" /> {child.group}</span>
        </div>

        <div className="teacher-row">
          <img src={child.teacherAvatar} alt={child.teacher} />
          <div>
            <strong>{child.teacher}</strong>
            <p>{child.teacherNote}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
