export default function CartDemoCard({ item }) {
  return (
    <article className={`cart-demo-card tone-${item.tone}`}>
      <button className="cart-demo-remove" type="button" aria-label="Xóa mục tiêu">
        <i className="bi bi-trash3"></i>
      </button>

      <div className="cart-demo-card-head">
        <div className="cart-demo-avatar">
          <span className="cart-demo-child">{item.child}</span>
          <span className="cart-demo-mini-icon">{item.icon}</span>
        </div>
        <h3>{item.field}</h3>
      </div>

      <div className="cart-demo-section">
        <div className="cart-demo-label">Mục tiêu</div>
        <p>{item.target}</p>
        {item.example && <small>{item.example}</small>}
      </div>

      <div className="cart-demo-section strategy-row">
        <div className="cart-demo-strategy-icon">
          <i className={`bi ${item.strategyIcon}`}></i>
        </div>
        <div>
          <div className="cart-demo-label">Chiến lược</div>
          <p>{item.strategy}</p>
        </div>
      </div>

      <div className="cart-demo-section support-wrap">
        <div className="cart-demo-label">Mức độ hỗ trợ</div>
        <span className="cart-demo-support">{item.support}</span>
      </div>
    </article>
  );
}
