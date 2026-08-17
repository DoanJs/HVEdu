import { signOut } from "firebase/auth";
import { onValue, ref, set, remove } from "firebase/database";
import { serverTimestamp, where } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { query_users } from "../../constants/firebase/query/Index";
import {
  handleToastError,
  handleToastSuccess,
} from "../../constants/handleToast";
import { icon512, indexedDBName } from "../../constants/info";
import { useFirestoreWithMeta } from "../../constants/useFirestoreWithMeta";
import { useFirestoreWithMetaCondition } from "../../constants/useFirestoreWithMetaCondition";
import { auth, rtdb } from "../../firebase.config";
import { ChildrenModel, PlanModel, ReportModel, UserModel } from "../../models";
import {
  useChildrenStore,
  useChildStore,
  useTeacherStore,
  useUserStore,
} from "../../zustand";
import AddChildModal from "../modal/addChild/AddChildModal";
import ChildrenCard from "./ChildrenCard";
import "./ChildrenPage.css";
import { data } from "../../constants/database/data";
import { addDocData } from "../../constants/firebase/addDocData";
import { data25TieuChi } from "../../constants/database/data25TieuChiFull";
import AddTeacherModal from "../modal/addTeacher/AddTeacherModal";
import { dataGiacQuan } from "../../constants/database/dataGiacQuan";

export default function ChildrenPage() {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const { children, setChildren } = useChildrenStore();
  const [plansTotal, setPlansTotal] = useState<PlanModel[]>([]);
  const [reportsTotal, setReportsTotal] = useState<ReportModel[]>([]);
  const [showNotificationOnly, setShowNotificationOnly] = useState(false);
  const { teachers } = useTeacherStore();
  const { setTeachers } = useTeacherStore();
  const [showLogout, setShowLogout] = useState(false);
  const [showAddChild, setShowAddChild] = useState(false);
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const { child } = useChildStore();

  const [viewingChildren, setViewingChildren] = useState<any>({});

  useEffect(() => {
    const viewingRef = ref(rtdb, "viewingChildren");

    const unsubscribe = onValue(viewingRef, (snapshot) => {
      setViewingChildren(snapshot.val() || {});
    });

    return () => unsubscribe();
  }, []);

  const { data: data_children, loading: loading_children } =
    useFirestoreWithMetaCondition({
      key: `${user?.id}_childrenCache`,
      id: user?.id,
      metaDoc: "children",
      nameCollect: "children",
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
  const { data: data_plans, loading: loading_plans } =
    useFirestoreWithMetaCondition({
      key: "plansCache",
      metaDoc: "plans",
      id: user?.id,
      nameCollect: "plans",
      condition: [where("teacherIds", "array-contains", user?.id)],
    });
  const { data: data_users, loading: loading_users } = useFirestoreWithMeta({
    key: "users",
    query: query_users,
    metaDoc: "users",
  });

  // -----------------test add data-----------------
  // const addDataToFirebase = async () => {
  //   const promiseItems = dataGiacQuan.map((_) =>
  //     addDocData({
  //       nameCollect: "targets",
  //       value: {
  //         ..._,

  //         createAt: serverTimestamp(),
  //         updateAt: serverTimestamp(),
  //       },
  //       metaDoc: "targets",
  //     }),
  //   );
  //   await Promise.all(promiseItems);
  //   console.log("Completed");
  //   // console.log(data.length);
  //   //   {

  //   //   id: "vzPZKsn6QEeP0uKTh8bgisRhlwx2",
  //   // },
  //   // setDoc(doc(db, "users", "vzPZKsn6QEeP0uKTh8bgisRhlwx2"), {
  //   //   fullName: "Ngô Thị Hương",
  //   //   position: "Giám đốc",
  //   //   email: "huonghuong.vl@gmail.com",
  //   //   phone: "0973.868.631",
  //   //   avatar: "",
  //   //   birth: "",
  //   //   id: "vzPZKsn6QEeP0uKTh8bgisRhlwx2",
  //   //   role: "admin",
  //   //   shortName: "",
  //   //   telegramChatId: "",
  //   //   createAt: serverTimestamp(),
  //   //   updateAt: serverTimestamp(),
  //   // });
  //   // const promiseItems = dataTeachers.map((item) =>
  //   //   setDoc(doc(db, "users", item.id), {
  //   //     ...item,
  //   //     avatar: "",
  //   //     birth: "",
  //   //     id: item.id,
  //   //     position: "Chuyên viên tâm lý",
  //   //     role: "teacher",
  //   //     shortName: "",
  //   //     telegramChatId: "",
  //   //     createAt: serverTimestamp(),
  //   //     updateAt: serverTimestamp(),
  //   //   }),
  //   // );
  //   // await Promise.all(promiseItems);
  //   // console.log('completed')
  // };

  // ------------------test add data-----------------

  useEffect(() => {
    if (!loading_users) {
      setTeachers(data_users as UserModel[]);
    }
  }, [data_users, loading_users]);
  useEffect(() => {
    if (!loading_children) {
      setChildren(data_children as ChildrenModel[]);
    }
  }, [data_children, loading_children]);
  useEffect(() => {
    if (!loading_reports) {
      const items = data_reports as ReportModel[];
      setReportsTotal(items);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data_reports, loading_reports]);
  useEffect(() => {
    if (!loading_plans) {
      const items = data_plans as PlanModel[];
      setPlansTotal(items);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data_plans, loading_plans]);

  const myTeacherIds = Array.from(
    new Set(children.flatMap((child) => child.teacherIds ?? [])),
  );

  const teacherMap = useMemo(() => {
    const map: any = {};
    teachers.forEach((t) => {
      map[t.id] = t;
    });
    return map;
  }, [teachers]);

  const pendingChildIds = useMemo(() => {
    return new Set(
      plansTotal
        .concat(reportsTotal)
        .filter((item) => item.status === "pending")
        .map((item) => item.childId),
    );
  }, [plansTotal, reportsTotal]);

  const filteredStudents = useMemo(() => {
    const search = keyword.trim().toLowerCase();
    return children.filter((student) => {
      const teacherNames = student.teacherIds
        .map((id) => teacherMap[id]?.fullName ?? "")
        .join(" ");
      const content =
        `${student?.fullName} ${student?.status} ${teacherNames}`.toLowerCase();
      const matchKeyword = !search || content.includes(search);

      if (showNotificationOnly) {
        return matchKeyword && pendingChildIds.has(student.id);
      }

      return matchKeyword;
    });
  }, [keyword, children, pendingChildIds, showNotificationOnly]);

  const clearIndexedDB = () => {
    return new Promise((resolve: any, reject) => {
      const request = indexedDB.deleteDatabase(indexedDBName);

      request.onsuccess = () => {
        console.log("IndexedDB deleted");
        resolve();
      };

      request.onerror = (event) => {
        console.error("Error deleting IndexedDB", event);
        reject();
      };

      request.onblocked = () => {
        console.warn("Delete blocked (close other tabs)");
      };
    });
  };
  const handleLogout = async () => {
    const uid = auth.currentUser?.uid;
    if (uid) {
      await set(ref(rtdb, `status/${uid}`), {
        online: false,
        lastSeen: Date.now(),
      });
      await remove(ref(rtdb, `viewingChildren/${child?.id}/${uid}`));
    }
    setIsLoading(true);

    try {
      await signOut(auth);

      // ✅ clear cache IndexedDB
      await clearIndexedDB();

      handleToastSuccess("Đăng xuất tài khoản thành công !");
      navigate("/login", { replace: true });
    } catch (error) {
      handleToastError("Đăng xuất tài khoản thất bại !");
      console.error("Error signing out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="children-main">
      <header className="children-topbar">
        <div className="children-title-row">
          <div className="title-area">
            <h1>Danh sách trẻ</h1>
            <p>Quản lý thông tin và quá trình can thiệp của trẻ</p>
          </div>
        </div>
        {/* <button onClick={addDataToFirebase}>Add Data</button> */}
        <div className="user-area">
          <img src={user?.avatar || icon512} alt="user-avatar" />
          <div>
            <strong>{user?.fullName}</strong>
            <p>{user?.position}</p>
          </div>
          {/* <i className="bi bi-chevron-down" /> */}
          <button
            className="logout-btn"
            aria-label="Đăng xuất"
            title="Đăng xuất"
            onClick={() => setShowLogout(true)}
            style={{
              background: "linear-gradient(135deg, #F8B800, #0058B0)",
              color: "#fff",
              padding: "10px",
              borderRadius: "100%",
              width: "42px",
              height: "42px",
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
              boxShadow: "0 14px 30px rgba(0, 126, 217, 0.25)",
            }}
          >
            <i className="bi bi-box-arrow-right" />
          </button>
        </div>
      </header>

      <section className="children-toolbar">
        <select
          // value={group}
          onChange={(e) => setKeyword(e.target.value)}
        >
          <option value="">Tất cả trẻ</option>
          <option value={"studying"}>Đang can thiệp</option>
          <option value={"paused"}>Tạm dừng</option>
          {/* <option>Có thông báo</option>
          <option>Có góp ý</option> */}
        </select>

        <select
          //  value={teacher}
          onChange={(e) => setKeyword(e.target.value)}
        >
          <option value="">Tất cả giáo viên</option>
          {myTeacherIds.map((_) => (
            <option value={teacherMap[_]?.fullName} key={_}>
              Cô {teacherMap[_]?.fullName}
            </option>
          ))}
        </select>

        <div className="children-search">
          <i className="bi bi-search" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm kiếm trẻ..."
          />
          <b style={{ minWidth: "100px", textAlign: "center" }}>
            {filteredStudents.length} trẻ
          </b>
        </div>
        {user && user.role === "admin" && (
          <>
            <button
              className="add-child-btn"
              onClick={() => setShowAddChild(true)}
            >
              <i className="bi bi-plus-lg" /> Thêm trẻ
            </button>
            <button
              className="add-child-btn"
              onClick={() => setShowAddTeacher(true)}
            >
              <i className="bi bi-plus-lg" /> Quản lý giáo viên
            </button>
          </>
        )}
        {/* <button className="filter-icon-btn">
          <i className="bi bi-sliders2" />
        </button> */}
        <button
          className="bell-btn"
          onClick={() => setShowNotificationOnly((prev) => !prev)}
        >
          <i className="bi bi-bell" />
          <span>
            {
              plansTotal
                .concat(reportsTotal)
                .filter((_) => _.status === "pending").length
            }
          </span>
          {/* <span>{showNotificationOnly && <span>Tất cả trẻ</span>}</span> */}
        </button>
      </section>

      <section className="children-grid">
        {filteredStudents.length > 0 &&
          [...filteredStudents].map((child) => {
            const viewers = Object.values(
              viewingChildren?.[child.id] || {},
            ) as any[];
            return (
              <ChildrenCard
                child={child}
                key={child.id}
                teacherMap={teacherMap}
                isNotification={pendingChildIds.has(child.id)}
                onShowAddChild={setShowAddChild}
                viewers={viewers}
              />
            );
          })}
      </section>

      <div className="children-bottom-space" />

      {showLogout && (
        <div className="custom-modal-backdrop">
          <div className="custom-modal">
            {/* Title */}
            <h5 className="fw-black text-danger mb-2">Xác nhận đăng xuất</h5>

            {/* Description */}
            <p className="text-green-muted small">
              Cô chắc chắn muốn đăng xuất khỏi thiết bị này ?
            </p>

            {/* Actions */}
            <div className="d-flex gap-2 justify-content-end mt-3">
              <button
                className="btn action-btn-soft"
                onClick={() => setShowLogout(false)}
                style={{ background: "#aaa8a8" }}
              >
                Huỷ
              </button>

              <button
                className="btn action-btn-danger"
                onClick={handleLogout}
                style={{
                  background: "linear-gradient(135deg, #0058B0, #0072d8)",
                  color: "#fff",
                }}
              >
                <i className="bi bi-box-arrow-right me-2" />
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      <AddChildModal
        teachers={teachers}
        show={showAddChild}
        loading={false}
        onClose={() => setShowAddChild(false)}
      />
      <AddTeacherModal
        teachers={teachers}
        show={showAddTeacher}
        loading={false}
        onClose={() => setShowAddTeacher(false)}
      />
    </main>
  );
}
