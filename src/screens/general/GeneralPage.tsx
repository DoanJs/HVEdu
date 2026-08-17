import { useMemo } from "react";
import { calculateAgeText, icon512 } from "../../constants/info";
import {
  useCartStore,
  useChildStore,
  usePlanStore,
  useReportStore,
  useTargetStore,
} from "../../zustand";
import GeneralCard from "./GeneralCard";
import "./GeneralPage.css";

export default function GeneralPage() {
  const { child } = useChildStore();
  const { targets } = useTargetStore();
  const { plans } = usePlanStore();
  const { reports } = useReportStore();
  const { carts } = useCartStore();

  const approvedPlans = useMemo(
    () => plans.filter((item) => item.status === "approved"),
    [plans],
  );
  const approvedReports = useMemo(
    () => reports.filter((item) => item.status === "approved"),
    [reports],
  );
  const pendingTotals = useMemo(
    () => plans.concat(reports).filter((item) => item.status === "pending"),
    [plans, reports],
  );

  const dashboardCards = [
    {
      id: 1,
      title: "Ngân hàng mục tiêu",
      desc: "Kho mục tiêu theo từng lĩnh vực phát triển.",
      value: targets.length,
      icon: "bi-bullseye",
      type: "blue",
      navigate: "bank",
      subTitle: "Kho mục tiêu theo từng lĩnh vực phát triển",
    },
    {
      id: 2,
      title: "Kế hoạch can thiệp",
      desc: "Danh sách kế hoạch can thiệp đã tạo.",
      value: approvedPlans.length,
      icon: "bi-calendar3",
      type: "yellow",
      navigate: "plan",
      subTitle: "Danh sách kế hoạch can thiệp theo từng tháng",
    },
    {
      id: 3,
      title: "Báo cáo can thiệp",
      desc: "Danh sách báo cáo đã thực hiện.",
      value: approvedReports.length,
      icon: "bi-file-earmark-bar-graph-fill",
      type: "blue",
      navigate: "report",
      subTitle: "Danh sách báo cáo can thiệp theo từng tháng",
    },
    {
      id: 4,
      title: "Chờ duyệt",
      desc: "Kế hoạch và báo cáo đang chờ duyệt.",
      value: pendingTotals.length,
      icon: "bi-clock",
      type: "yellow",
      navigate: "pending",
      subTitle: "Các kế hoạch và báo cáo đang chờ Giám đốc duyệt",
    },
    {
      id: 5,
      title: "Giỏ mục tiêu",
      desc: "Các mục tiêu đã chọn chờ tạo kế hoạch.",
      value: carts.length,
      icon: "bi-cart3",
      type: "blue",
      navigate: "cart",
      subTitle:
        "Danh sách mục tiêu đã chọn. Bạn có thể tạo kế hoạch can thiệp từ giỏ mục tiêu",
    },
  ];
  return (
    <>
      <section className="child-info-card">
        <div className="child-title-row">
          <span className="child-title-icon">
            <i className="bi bi-person-bounding-box" />
          </span>
          <h2>Thông tin trẻ</h2>
        </div>

        <div className="child-content">
          <img
            className="child-avatar"
            src={child?.avatar || icon512}
            alt="child-avatar"
          />
          <div className="child-detail">
            <div className="child-name-line">
              <h3>{child?.fullName}</h3>
              <span>{child?.gender}</span>
            </div>
            <p>
              <i className="bi bi-calendar2-week" /> Ngày sinh: {child?.birth}
            </p>
            <p>
              <i className="bi bi-cake2" /> {calculateAgeText(child?.birth)}
            </p>
          </div>

          <div className="child-art">
            <i className="bi bi-puzzle-fill puzzle p1" />
            <i className="bi bi-person-arms-up figure" />
            <i className="bi bi-puzzle-fill puzzle p2" />
          </div>

          {/* <button className="detail-btn">
            Xem chi tiết <i className="bi bi-chevron-right" />
          </button> */}
        </div>
      </section>

      <section className="general-grid">
        {dashboardCards.map((item) => (
          <GeneralCard key={item.id} item={item} />
        ))}
      </section>
    </>
  );
}
