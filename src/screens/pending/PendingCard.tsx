import moment from "moment";
import { Link } from "react-router-dom";
import { handleTimeStampFirestore } from "../../constants/convertTimeStamp";
import { icon512, pendingPlan, pendingReport } from "../../constants/info";
import { Message } from "iconsax-react";

function PlanIllustration() {
  return (
    <div className="pending-hero-art plan-art" aria-hidden="true">
      <span className="cloud c1" />
      <span className="cloud c2" />
      <span className="leaf l1" />
      <span className="leaf l2" />
      <span className="big-star">★</span>
      <span className="calendar-back" />
      <span className="calendar-front">
        <i className="ring r1" />
        <i className="ring r2" />
        <i className="ring r3" />
        <i className="ring r4" />
        <b className="dot d1" />
        <b className="dot d2" />
        <b className="dot d3" />
        <b className="dot d4" />
        <b className="dot d5" />
        <b className="dot d6" />
      </span>
    </div>
  );
}

function ReportIllustration() {
  return (
    <div className="pending-hero-art report-art" aria-hidden="true">
      <span className="cloud c1" />
      <span className="cloud c2" />
      <span className="heart" />
      <span className="report-board">
        <i className="clip" />
        <b className="pie" />
        <em className="line ln1" />
        <em className="line ln2" />
        <em className="line ln3" />
        <i className="bar b1" />
        <i className="bar b2" />
        <i className="bar b3" />
      </span>
    </div>
  );
}

export default function PendingCard({ item, teacherMap }: any) {
  const isPlan = item.type === "KH";

  return (
    <Link
      to={`../${isPlan ? `plan/${item.id}` : `report/${item.id}`}`}
      state={isPlan ? { plan: item } : { report: item }}
      className={`pending-card ${isPlan ? "plan" : "report"}`}
    >
      <span className="floating-star st-left">★</span>
      <span className="floating-star st-right">★</span>

      <span className="pending-type-badge">
        {isPlan ? "Kế hoạch can thiệp" : "Báo cáo kết quả"}
      </span>

      {isPlan ? <PlanIllustration /> : <ReportIllustration />}

      <div className="pending-title-block">
        <h2>{isPlan ? "Kế hoạch tháng mới" : "Báo cáo tháng hiện tại"}</h2>
        <strong>{item.title}</strong>
      </div>

      <div className="pending-info-box">
        {/* <div className="info-row">
          <i className="bi bi-bullseye" />
          <span>Tổng số mục tiêu</span>
          <strong>{item.totalGoals} mục tiêu</strong>
        </div> */}
        <div className="info-row">
          <i className="bi bi-calendar2-check" />
          <span>Ngày tạo</span>
          <strong>
            {typeof item?.createAt === "number"
              ? moment(item?.createAt).format("HH:mm:ss DD/MM/YYYY")
              : moment(handleTimeStampFirestore(item?.createAt)).format(
                  "HH:mm:ss DD/MM/YYYY",
                )}
          </strong>
        </div>
        <div className="info-row">
          <i className="bi bi-person-badge" />
          <span>Giáo viên thực hiện</span>
          <div className="teacher-mini">
            <img
              src={teacherMap[item.authorId]?.avatar || icon512}
              alt={"pending-teacher"}
            />
            <strong>{teacherMap[item.authorId]?.fullName}</strong>
          </div>
        </div>
      </div>

      <div className="pending-card-footer">
        <button className="detail-btn" style={{ position: "relative" }}>
          <i className="bi bi-eye" />
          Xem chi tiết
        </button>
        <img src={isPlan ? pendingPlan : pendingReport} alt="pending-plan" />
      </div>

      {item.comment && (
        <div
          className="fw-bold text-danger fst-italic"
          style={{ position: "absolute", top: "16px", right: "16px" }}
        >
          <Message color="red" size={26} variant="Bold" className="me-2" />
          Có nhận xét
        </div>
      )}
    </Link>
  );
}
