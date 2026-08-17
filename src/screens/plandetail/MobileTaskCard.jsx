export default function MobileTaskCard({ item }) {
  return (
    <article className="pd-mobile-card">
      <div className="pd-mobile-head">
        <div className="pd-mobile-field">
          <span className={`pd-field-icon ${item.fieldColor}`}><i className={`bi ${item.fieldIcon}`}></i></span>
          <b>{item.field}</b>
        </div>
        <span className={`pd-mobile-support ${item.supportColor}`}>{item.support}</span>
        <i className="bi bi-chevron-up"></i>
      </div>
      <p className="pd-mobile-target">{item.target}</p>
      <label>Nội dung</label>
      <p>{item.content}</p>
    </article>
  );
}
