import moment from "moment";
import { Link } from "react-router-dom";
import { handleTimeStampFirestore } from "../../constants/convertTimeStamp";
import { getRandomItem } from "./planData";
import { icon512 } from "../../constants/info";

export default function PlanCard({ item, teacherMap, newestPlan, total }: any) {
  const statusText = item.status === "approved" ? "Đã duyệt" : "Chờ duyệt";

  return (
    <Link
      to={`./${item.id}`}
      state={{ plan: item }}
      className={`plan-card card-${getRandomItem().color}`}
    >
      {item.id === newestPlan.id && (
        <span className="newest-badge">MỚI NHẤT</span>
      )}
      <span className={`pin-ribbon ${true ? "waiting" : ""}`}>
        <i className={`bi ${true ? "bi-clock-fill" : "bi-pin-angle-fill"}`} />
      </span>

      <div className="card-top">
        <div className="plan-illustration" aria-hidden="true">
          <span className="calendar-sheet sheet-back" />
          <span className="calendar-sheet sheet-front">
            <i className="ring r1" />
            <i className="ring r2" />
            <i className="ring r3" />
            <b className="dot d1" />
            <b className="dot d2" />
            <b className="dot d3" />
            <b className="dot d4" />
            <em />
          </span>
        </div>

        <div className="card-title-group">
          <p>Kế hoạch</p>
          <h3>{item.title}</h3>
          <p>{item.subTitle}</p>
        </div>
      </div>

      <div className="card-stats">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <i className="bi bi-bullseye" />
            <span>Mục tiêu</span>
          </div>
          <strong>{total}</strong>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <i className="bi bi-calendar2-check" />
            <span>Tạo</span>
          </div>
          <strong>
            {typeof item?.createAt === "number"
              ? moment(item?.createAt).format("HH:mm:ss DD/MM/YYYY")
              : moment(handleTimeStampFirestore(item?.createAt)).format(
                  "HH:mm:ss DD/MM/YYYY",
                )}
          </strong>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <i className="bi bi-check-circle" />
            <span>Duyệt</span>
          </div>
          <strong>
            {typeof item?.updateAt === "number"
              ? moment(item?.updateAt).format("HH:mm:ss DD/MM/YYYY")
              : moment(handleTimeStampFirestore(item?.updateAt)).format(
                  "HH:mm:ss DD/MM/YYYY",
                )}
          </strong>
        </div>
      </div>

      <div className="teacher-block">
        <p>Giáo viên thực hiện</p>
        <div className="teacher-row">
          <div className="teacher-info">
            <img
              src={teacherMap[item.authorId]?.avatar || icon512}
              alt={"plan-teacher"}
            />
            <div>
              <strong>{teacherMap[item.authorId]?.fullName}</strong>
              <span>Chức vụ: {teacherMap[item.authorId]?.position}</span>
            </div>
          </div>
          <span className={`status-badge ${item.status}`}>{statusText}</span>
        </div>
      </div>
    </Link>
  );
}
