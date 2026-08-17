import { getToneTheme, getUIForBank } from "../../constants/info";
import { useInterventionStore } from "../../zustand";
import { getRandomItem } from "./cartDemoData";

export default function CartDemoCard({
  item,
  fieldMap,
  handleDeleteCart,
  handleSelectIntervention,
}: any) {
  const themes = getToneTheme();
  const { interventions } = useInterventionStore();

  return (
    <article className={`cart-demo-card tone-${themes.name}`}>
      <button
        className="cart-demo-remove"
        type="button"
        aria-label="Xóa mục tiêu"
        onClick={() => handleDeleteCart(item.id)}
      >
        <i className="bi bi-trash3"></i>
      </button>

      <div className="cart-demo-card-head">
        <div className="cart-demo-avatar">
          <img
            src={getUIForBank(fieldMap[item.fieldId]?.name)?.icon}
            alt="cart-demo-avatar-img"
          />
          {/* <span className="cart-demo-child">{item.child}</span>
          <span className="cart-demo-mini-icon">{item.icon}</span> */}
        </div>
        <h3>{fieldMap[item.fieldId]?.name}</h3>
      </div>

      <div className="cart-demo-section">
        <div className="cart-demo-label">Mục tiêu</div>
        <p>{item.name}</p>
        {item.example && <small>{item.example}</small>}
      </div>

      <div className="cart-demo-section strategy-row">
        <div className="cart-demo-strategy-icon">
          <i className={`bi ${getRandomItem()}`}></i>
        </div>
        <div>
          <div className="cart-demo-label">Chiến lược</div>
          <p className="limit-lines">{item.content}</p>
        </div>
      </div>

      <div className="cart-demo-section support-wrap">
        <div className="cart-demo-label">Mức độ hỗ trợ</div>
        {/* <span className="cart-demo-support">{item.support}</span> */}
        <select
          value={item.intervention}
          onChange={(e) =>
            handleSelectIntervention(item.id, {
              ...item,
              intervention: e.target.value,
            })
          }
          className="support-select"
        >
          <option value="">Chọn mức độ</option>
          {interventions.map((_) => (
            <option value={_.name} key={_.level}>
              {_.level === 1
                ? "🟥"
                : _.level === 2
                  ? "🟧"
                  : _.level === 3
                    ? "🟨"
                    : "🟩"}{" "}
              {_.name}
            </option>
          ))}
        </select>
      </div>

      <div className="support-level"></div>
    </article>
  );
}
