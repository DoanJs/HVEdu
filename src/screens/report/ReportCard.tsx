import { Link } from "react-router-dom";
import { getRandomItem } from "./reportData";
import moment from "moment";
import { handleTimeStampFirestore } from "../../constants/convertTimeStamp";
import { icon512 } from "../../constants/info";

function ReportIllustration({ type = "bar" }) {
  return (
    <div className={`report-illustration report-illustration-${type}`}>
      <div className="clip-head">
        <span />
      </div>
      <div className="paper-lines">
        <i />
        <i />
        <i />
      </div>
      {type === "donut" ? (
        <div className="donut-chart" />
      ) : type.includes("pie") ? (
        <div className="pie-chart" />
      ) : type === "line" ? (
        <div className="line-chart">
          <b />
          <b />
          <b />
        </div>
      ) : (
        <div className="bar-chart">
          <b />
          <b />
          <b />
        </div>
      )}
    </div>
  );
}

export default function ReportCard({
  item,
  teacherMap,
  newestPlan,
  total,
}: any) {
  const statusText = item.status === "approved" ? "Đã duyệt" : "Chờ duyệt";
  return (
    <Link
      to={`./${item.id}`}
      state={{ report: item }}
      className={`report-card card-${getRandomItem().color}`}
    >
      {item.id === newestPlan.id && (
        <span className="newest-badge">MỚI NHẤT</span>
      )}
      <span className="pin-ribbon">
        <i className="bi bi-pin-angle-fill" />
      </span>

      <div className="card-top">
        <ReportIllustration type={item.chart} />
        <div className="card-title-group">
          <p>Báo cáo</p>
          <h3>{item.title}</h3>
          {/* <p>{`item.subTitle`}</p> */}
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
              alt="teacher"
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
