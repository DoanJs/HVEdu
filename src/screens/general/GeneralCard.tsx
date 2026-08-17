import { Link } from "react-router-dom";
import { useSelectNavbarStore, useTitleNavbarStore } from "../../zustand";

export default function GeneralCard({ item }: any) {
  const { setSelectNavbar } = useSelectNavbarStore();
  const { setTitleNavbar } = useTitleNavbarStore();
  return (
    <Link
      to={`../${item.navigate}`}
      onClick={() => {
        setSelectNavbar(item.navigate);
        setTitleNavbar({ title: item.title, subTitle: item.subTitle });
      }}
      className={`general-card ${item.type === "yellow" ? "card-yellow" : "card-blue"}`}
    >
      <div className="general-card-left">
        <div className="general-icon-wrap">
          <div className="general-icon-circle">
            <i className={`bi ${item.icon}`} />
          </div>
        </div>
        <strong className="general-value">{item.value}</strong>
        <button className="general-link">
          Xem chi tiết <i className="bi bi-chevron-right" />
        </button>
      </div>

      <div className="general-card-content">
        <h3>{item.title}</h3>
        <p>{item.desc}</p>
      </div>

      <i className={`bi ${item.icon} general-watermark`} />
    </Link>
  );
}
