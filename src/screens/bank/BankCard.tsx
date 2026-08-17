import { Link } from "react-router-dom";
import { getUIForBank, icon512 } from "../../constants/info";
import { useTargetStore, useTitleNavbarStore } from "../../zustand";
import { useMemo } from "react";

export default function BankCard({ item }: any) {
  const { setTitleNavbar } = useTitleNavbarStore();
  const { targets } = useTargetStore();

  const targetsByField = useMemo(() => {
    return targets.filter((target) => target.fieldId === item.id);
  }, [targets, item.id]);

  return (
    <Link
      to={`./${item.id}`}
      onClick={() =>
        setTitleNavbar({
          title: item.name,
          subTitle: getUIForBank(item.name).desc,
          icon: getUIForBank(item.name).icon,
        })
      }
      className={`bank-card card-${getUIForBank(item.name).color}`}
    >
      <div className={`bank-illus illus-${getUIForBank(item.name).color}`}>
        <img src={getUIForBank(item.name).icon || icon512} alt={"bank-icon"} />
      </div>

      <h3>{item.name}</h3>
      <p>{item.desc}</p>

      <div className="bank-card-footer">
        <span>{targetsByField.length} mục tiêu</span>
        <button aria-label={`Xem ${item.name}`}>
          <i className="bi bi-chevron-right" />
        </button>
      </div>
    </Link>
  );
}
