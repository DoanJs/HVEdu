import { Link } from "react-router-dom";

export default function BankCard({ item }: any) {
  return (
    <Link to={"/"} className={`bank-card card-${item.color}`} >
      <div className={`bank-illus illus-${item.color}`}>
        <img src={`/images/${item.key}.png`} alt={item.key}/>
      </div>

      <h3>{item.name}</h3>
      <p>{item.desc}</p>

      <div className="bank-card-footer">
        <span>{item.count} mục tiêu</span>
        <button aria-label={`Xem ${item.name}`}>
          <i className="bi bi-chevron-right" />
        </button>
      </div>
    </Link>
  );
}
