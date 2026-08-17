import { Link } from "react-router-dom";
import { useSelectNavbarStore, useTitleNavbarStore, useUserStore } from "../../zustand";
import { ADMINID, getRandomAvatar, icon512 } from "../../constants/info";

export default function ChildrenCard({
  child,
  teacherMap,
  isNotification,
  viewers,
}: any) {
  const { setSelectNavbar } = useSelectNavbarStore();
  const { setTitleNavbar } = useTitleNavbarStore();
  const {user} = useUserStore()
  
  const isAdmin = user && user?.role === 'admin' 
  return (
    <Link
      to={`/home/${child.id}/general`}
      onClick={(e) => {
        if (child.status === "paused") {
          e.preventDefault();
          return;
        }
        setSelectNavbar("general");
        setTitleNavbar({
          title: "Xin chào, Giáo viên Hy Vọng",
          subTitle: "Chào mừng bạn trở lại hệ thống quản lý can thiệp.",
        });
      }}
      className="ak-child-card"
      style={{
        color: '#0058B0'
      }}
    >
      <div className="child-photo-wrap">
        <img
          className="child-photo"
          src={child.avatar || getRandomAvatar().icon}
          alt={child.fullName}
        />
        {child.status && child.status === "paused" && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.6)",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div style={{ fontSize: 30 }}>🔒</div>

            <b className="text-white">Tạm dừng</b>
          </div>
        )}
        {isNotification && (
          <span
            className="student-bell"
            title="Có mục chờ xử lý"
            style={{
              color: "red",
              position: "absolute",
              top: "8px",
              right: "8px",
              fontSize: "24px",
            }}
          >
            <i className="bi bi-bell-fill" />
          </span>
        )}
        <span className={`child-status ${child.statusType}`}>
          {child.status === "studying" ? "Đang can thiệp" : "tạm dừng"}
        </span>
      </div>

      <div className="child-body">
        <h3>{child.fullName}</h3>
        <div className="child-meta">
          <span>
            <i className="bi bi-calendar3" /> {child.birth}
          </span>
          <span>
            <i className="bi bi-gender-ambiguous" /> {child.gender}
          </span>
          {/* <span>
            <i className="bi bi-people" /> {child.group}
          </span> */}
        </div>
        {child.teacherIds.length > 0 &&
          child.teacherIds.map((_: any) => {
            if (!isAdmin) {
              return (
                <div className="teacher-row" key={_} style={{justifyContent: "flex-start"}}>
                  <img
                    src={teacherMap[_]?.avatar || getRandomAvatar().icon}
                    alt={"child-teacher"}
                  />
                  <div>
                    <strong>Cô {teacherMap[_]?.fullName}</strong>
                    <p>{teacherMap[_]?.position}</p>
                  </div>
                </div>
              );
            }
          })}
          {viewers.filter((v: any) => v.role !== "admin").length > 0 && (
          <div className="viewing-row">
            <span className="viewing-label">Đang xem</span>

            <div className="viewing-avatars">
              {viewers
                .filter((v: any) => v.role !== "admin")
                .slice(0, 4)
                .map((viewer: any, index: number) => (
                  <img
                    key={`${viewer.uid}-${index}`}
                    src={viewer.avatar || icon512}
                    className="viewing-avatar"
                    title={`${viewer.fullName} đang xem`}
                  />
                ))}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
