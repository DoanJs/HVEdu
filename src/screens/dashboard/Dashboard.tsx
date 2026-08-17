import { onValue, ref } from "firebase/database";
import { orderBy, where } from "firebase/firestore";
import { Message } from "iconsax-react";
import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { getDocData } from "../../constants/firebase/getDocData";
import { getDocsData } from "../../constants/firebase/getDocsData";
import {
  query_fields,
  query_interventions,
  query_targets,
} from "../../constants/firebase/query/Index";
import {
  dashboardMenu,
  handleCommentTotal,
  icon512,
} from "../../constants/info";
import { useFirestoreWithMeta } from "../../constants/useFirestoreWithMeta";
import { useFirestoreWithMetaCondition } from "../../constants/useFirestoreWithMetaCondition";
import { rtdb } from "../../firebase.config";
import { useViewingChild } from "../../hooks/useViewingChild";
import {
  CommentModel,
  FieldModel,
  InterventionModel,
  PlanModel,
  ReportModel,
  ReportSavedModel,
  TargetModel,
} from "../../models";
import { CartModel } from "../../models/CartModel";
import {
  useCartStore,
  useChildStore,
  useCommentStore,
  useFieldStore,
  useInterventionStore,
  usePlanStore,
  useReportSavedStore,
  useReportStore,
  useSelectNavbarStore,
  useTargetStore,
  useTeacherStore,
  useTitleNavbarStore,
  useTotalPlanTaskStore,
  useTotalReportTaskStore,
  useUserStore,
} from "../../zustand";
import UserDropdown from "../dropdown/user/UserDropdown";
import "./Dashboard.css";
import { menuItems } from "./dashboardData";
import ScrollButtons from "../../scroll/ScrollButtons";

export default function Dashboard() {
  const navigate = useNavigate();
  const { titleNavbar, setTitleNavbar } = useTitleNavbarStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const handleLogout = () => {};

  const { childId } = useParams();
  const { user } = useUserStore();

  useViewingChild({
    childId: childId,
    fullName: user?.fullName,
    avatar: user?.avatar,
    role: user?.role,
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { selectNavbar, setSelectNavbar } = useSelectNavbarStore();
  const { child, setChild } = useChildStore();
  const { teachers, setTeachers } = useTeacherStore(); //teachers này là của riêng đứa trẻ đó # với teachers của toàn hệ thống
  const { setTargets } = useTargetStore();
  const { setFields } = useFieldStore();
  const { setInterventions } = useInterventionStore();
  const { plans, setPlans } = usePlanStore();
  const { reports, setReports } = useReportStore();
  const { setReportSaveds } = useReportSavedStore();
  const { setComments } = useCommentStore();
  const { setTotalPlanTasks } = useTotalPlanTaskStore();
  const { setTotalReportTasks } = useTotalReportTaskStore();
  const { carts, setCarts } = useCartStore();

  const [teacherStatus, setTeacherStatus] = useState<any>({});

  useEffect(() => {
    const statusRef = ref(rtdb, "status");

    const unsubscribe = onValue(statusRef, (snapshot) => {
      setTeacherStatus(snapshot.val() || {});
    });

    return () => unsubscribe();
  }, []);

  const { data: data_fields, loading } = useFirestoreWithMeta({
    key: "fieldsCache",
    query: query_fields,
    metaDoc: "fields",
  });
  const { data: data_targets, loading: loading_targets } = useFirestoreWithMeta(
    {
      key: "targetsCache",
      query: query_targets,
      metaDoc: "targets",
    },
  );
  const { data: data_interventions, loading: loading_interventions } =
    useFirestoreWithMeta({
      key: "interventions",
      query: query_interventions,
      metaDoc: "interventions",
    });
  const { data: data_plans, loading: loading_plans } =
    useFirestoreWithMetaCondition({
      key: "plansCache",
      metaDoc: "plans",
      id: user?.id,
      nameCollect: "plans",
      condition: [where("teacherIds", "array-contains", user?.id)],
    });

  const { data: data_carts, loading: loading_carts } =
    useFirestoreWithMetaCondition({
      key: "cartsCache",
      metaDoc: "carts",
      id: user?.id,
      nameCollect: "carts",
      condition: [where("teacherIds", "array-contains", user?.id)],
    });
  const { data: data_reportSaveds, loading: loading_reportSaveds } =
    useFirestoreWithMetaCondition({
      key: "reportSavedsCache",
      metaDoc: "reportSaveds",
      id: user?.id,
      nameCollect: "reportSaveds",
      condition: [where("teacherIds", "array-contains", user?.id)],
    });
  const { data: data_reports, loading: loading_reports } =
    useFirestoreWithMetaCondition({
      key: "reportsCache",
      metaDoc: "reports",
      id: user?.id,
      nameCollect: "reports",
      condition: [where("teacherIds", "array-contains", user?.id)],
    });
  const { data: data_comments, loading: loading_comments } =
    useFirestoreWithMetaCondition({
      key: `commentsCache_${user?.id}_${childId}`,
      metaDoc: "comments",
      id: user?.id,
      nameCollect: "comments",
      condition: [
        where("teacherIds", "array-contains", user?.id),
        where("childId", "==", childId),
        orderBy("createAt", "desc"),
      ],
    });

  const { data: childrenForTeacher } = useFirestoreWithMetaCondition({
    key: `children_teacher_${user?.id}`,
    metaDoc: "children",
    id: user?.id,
    nameCollect: "children",
    condition: [where("teacherIds", "array-contains", user?.id)],
  });

  useEffect(() => {
    if (!loading_comments) {
      setComments(data_comments as CommentModel[]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data_comments, loading_comments]);

  useEffect(() => {
    if (!loading_interventions) {
      setInterventions(data_interventions as InterventionModel[]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data_interventions, loading_interventions]);
  useEffect(() => {
    if (loading_reports) return;
    if (!childId) return;

    const items = (data_reports ?? []) as ReportModel[];

    setReports(items.filter((report) => report.childId === childId));
  }, [data_reports, loading_reports, childId, setReports]);

  useEffect(() => {
    if (loading_plans) return;
    if (!childId) return;

    const items = (data_plans ?? []) as PlanModel[];

    setPlans(items.filter((plan) => plan.childId === childId));
  }, [data_plans, loading_plans, childId, setPlans]);

  useEffect(() => {
    if (loading_carts) return;
    if (!childId) return;

    const items = (data_carts ?? []) as CartModel[];

    setCarts(items.filter((cart) => cart.childId === childId));
  }, [data_carts, loading_carts, childId, setCarts]);

   useEffect(() => {
    if (loading_reportSaveds) return;
    if (!childId) return;

    const items = (data_reportSaveds ?? []) as ReportSavedModel[];

    setReportSaveds(items.filter((item) => item.childId === childId));
  }, [data_reportSaveds, loading_reportSaveds, childId, setReportSaveds]);
  
  useEffect(() => {
    if (!loading) {
      setFields(data_fields as FieldModel[]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data_fields, loading]);
  useEffect(() => {
    if (!loading_targets) {
      setTargets(data_targets as TargetModel[]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data_targets, loading_targets]);
  useEffect(() => {
    if (childId) {
      getDocData({
        id: childId,
        nameCollect: "children",
        setData: setChild,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childId]);
  useEffect(() => {
    if (child) {
      getDocsData({
        nameCollect: "users",
        condition: [where("id", "in", child.teacherIds)],
        setData: setTeachers,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [child]);
  useEffect(() => {
    if (child) {
      getDocsData({
        nameCollect: "planTasks",
        setData: setTotalPlanTasks,
        condition: [
          where("childId", "==", child.id),
          where("teacherIds", "array-contains", user?.id),
        ],
      });
      getDocsData({
        nameCollect: "reportTasks",
        setData: setTotalReportTasks,
        condition: [
          where("childId", "==", child.id),
          where("teacherIds", "array-contains", user?.id),
        ],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [child, user]);

  return (
    <div className="ak-dashboard-page">
      <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
        <i className="bi bi-list" />
      </button>
      <img
        className="mobile-user"
        src={user?.avatar || icon512}
        alt="avatar"
        onClick={() => setShowUserMenu(true)}
      />

      {sidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`ak-sidebar ${sidebarOpen ? "show" : ""}`}>
        <Link to="/" className="logo-box">
          {/* <div className="logo-circle"><i className="bi bi-stars" /></div> */}
          <img src={icon512} alt="Hy Vọng Education" />
          <h2>HY VỌNG</h2>
          <span>EDUCATION</span>
        </Link>

        <nav className="ak-menu">
          {menuItems.map((item) => {
            const handleQuantityPending = () => {
              const items = plans
                .concat(reports)
                .filter((_: any) => _.status === "pending");
              return items;
            };
            return (
              <Link
                to={`./${item.navigate}`}
                onClick={() => {
                  setSelectNavbar(item.navigate);
                  setTitleNavbar({
                    title: item.title,
                    subTitle: item.subTitle,
                  });
                  setSidebarOpen(false);
                }}
                key={item.label}
                className={`menu-item ${item.navigate === selectNavbar ? "active" : ""}`}
              >
                <i className={`bi ${item.icon}`} />
                <span>{item.label}</span>

                {item.navigate === "pending" &&
                  handleCommentTotal(plans.concat(reports)) && (
                    <Message color={"red"} size={26} variant="Bold" />
                  )}
                {item.navigate === "pending" && (
                  <span className="badge-pending">
                    {handleQuantityPending().length}
                  </span>
                )}
                {item.navigate === "cart" && (
                  <span className="navbar-bell">{carts.length}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-kids">
          <img src={dashboardMenu} alt="dashboard-menu" />
        </div>
      </aside>

      <main className="ak-dashboard-main">
        <header className="top-header">
          <div className="ak-dashboard-title-area">
            {![
              "Xin chào, Giáo viên Hy Vọng",
              "Ngân hàng mục tiêu",
              "Kế hoạch can thiệp",
              "Báo cáo can thiệp",
              "Chờ duyệt",
              "Giỏ mục tiêu",
            ].includes(titleNavbar.title) && (
              <>
                <button
                  className="back-btn"
                  aria-label="Quay lại"
                  onClick={() => {
                    navigate(-1);
                    setTitleNavbar({
                      title: "Ngân hàng mục tiêu",
                      subTitle: "Chọn lĩnh vực để xem và chọn mục tiêu",
                    });
                  }}
                >
                  <i className="bi bi-chevron-left" />
                </button>
                <img
                  src={titleNavbar.icon}
                  alt="dashboard-target"
                  onClick={() => {
                    navigate(-1);
                    setTitleNavbar({
                      title: "Ngân hàng mục tiêu",
                      subTitle: "Chọn lĩnh vực để xem và chọn mục tiêu",
                    });
                  }}
                />
              </>
            )}
            <div>
              <h1>{titleNavbar.title}</h1>
              <p>{titleNavbar.subTitle}</p>
            </div>
          </div>

          <div className="user-area">
            {/* <button className="bell-btn">
              <i className="bi bi-bell" />
              <span>3</span>
            </button> */}
            <img src={user?.avatar || icon512} alt="avatar" />
            <div className="user-info" onClick={() => setShowUserMenu(true)}>
              <strong>{user?.fullName}</strong>
              <p>{user?.position}</p>
            </div>
            <i className="bi bi-chevron-down" />
          </div>
        </header>

        <section className="dashboard-scroll-area">
          <Outlet />
          <div className="dashboard-slogan">
            <span>★</span> “Kết nối yêu thương – Kiến tạo tương lai”{" "}
            <span>★</span>
          </div>
        </section>
      </main>

      {user && (
        <UserDropdown
          show={showUserMenu}
          data={{ plans, reports, childrenForTeacher }}
          onClose={() => setShowUserMenu(false)}
          user={user}
          onProfile={() => navigate("./profile")}
          onChangePassword={() => navigate("./changepassword")}
          // onSetting={() => navigate("/")}
          // onHelp={() => navigate("/help")}
          onLogout={handleLogout}
        />
      )}

      <ScrollButtons />
    </div>
  );
}
