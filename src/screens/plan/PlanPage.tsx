import { useEffect, useMemo, useState } from "react";
import {
  formatDateSearch,
  getTimeMs,
  getTimeValue,
} from "../../constants/info";
import { PlanModel } from "../../models";
import {
  usePlanStore,
  usePlanTaskStore,
  useSelectNavbarStore,
  useTeacherStore,
  useTitleNavbarStore,
  useTotalPlanTaskStore,
  useUserStore,
} from "../../zustand";
import PlanCard from "./PlanCard";
import "./PlanPage.css";
import { Link } from "react-router-dom";
import AddPlanModal from "../modal/addPlan/AddPlanModal";

export default function PlanPage() {
  const [keyword, setKeyword] = useState("");
  const { setSelectNavbar } = useSelectNavbarStore();
  const { setTitleNavbar } = useTitleNavbarStore();
  const [showAddPlan, setShowAddPlan] = useState(false);
  // const [teacher, setTeacher] = useState("all");

  // const teachers = useMemo(() => {
  //   const teacherSet = new Set(plans.map((item) => item.teacher));
  //   return ["all", ...Array.from(teacherSet)];
  // }, []);

  // const filteredPlans = useMemo(() => {
  //   return plans.filter((item) => {
  //     const matchKeyword = `${item.month} ${item.subTitle} ${item.teacher}`
  //       .toLowerCase()
  //       .includes(keyword.toLowerCase());
  //     const matchTeacher = teacher === "all" || item.teacher === teacher;
  //     return matchKeyword && matchTeacher;
  //   });
  // }, [keyword, teacher]);
  const { user } = useUserStore();
  const { plans } = usePlanStore();
  const [planNews, setPlanNews] = useState<PlanModel[]>([]);
  const { teachers } = useTeacherStore();
  const { totalPlanTasks } = useTotalPlanTaskStore();
  const isAdmin = user && user?.role === 'admin' 

  const teacherMap = useMemo(() => {
    const map: any = {};
    teachers.forEach((t) => {
      map[t.id] = t;
    });
    return map;
  }, [teachers]);
  const planTaskCounts = useMemo(() => {
    return totalPlanTasks.reduce<Record<string, number>>((acc, item) => {
      acc[item.planId] = (acc[item.planId] ?? 0) + 1;
      return acc;
    }, {});
  }, [totalPlanTasks]);

  useEffect(() => {
    if (plans) {
      const items = plans.filter((plan) => plan.status === "approved");
      setPlanNews(items);
    }
  }, [plans]);
  const newestPlan = useMemo(() => {
    if (!plans.length) return undefined;

    return plans.reduce((latest, current) =>
      getTimeMs(current.createAt) > getTimeMs(latest.createAt)
        ? current
        : latest,
    );
  }, [plans]);

  const filteredPlans = useMemo(() => {
    const search = keyword.trim().toLowerCase();

    return planNews
      .filter((item: any) => {
        const teacherName = teacherMap[item.authorId]?.fullName || "";

        const createdTime = formatDateSearch(item.createAt);
        const updatedTime = formatDateSearch(item.updateAt);

        const content = `
        ${item.title ?? ""}
        ${teacherName}
        ${createdTime}
        ${updatedTime}
      `.toLowerCase();

        return !search || content.includes(search);
      })
      .sort((a: any, b: any) => {
        return getTimeValue(b.createAt) - getTimeValue(a.createAt);
      });
  }, [planNews, keyword, teacherMap]);

  return (
    <>
      <section className="toolbar">
        <div className="search-box">
          <i className="bi bi-search" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm kiếm kế hoạch..."
          />
        </div>

        {/* <div className="filter-box">
          <i className="bi bi-funnel" />
          <select value={teacher} onChange={(e) => setTeacher(e.target.value)}>
            {teachers.map((name) => (
              <option key={name} value={name}>
                {name === "all" ? "Lọc theo giáo viên" : name}
              </option>
            ))}
          </select>
        </div> */}

        <Link
          to={"../cart"}
          className="create-btn"
          style={{ textDecoration: "none" }}
          onClick={() => {
            setSelectNavbar("cart");
            setTitleNavbar({
              title: "Giỏ mục tiêu",
              subTitle:
                "Danh sách mục tiêu đã chọn. Bạn có thể tạo kế hoạch can thiệp từ giỏ mục tiêu",
            });
          }}
        >
          <i className="bi bi-plus-lg" />
          Tạo kế hoạch mới
        </Link>

        {isAdmin && (
          <button className="target-add" onClick={() => setShowAddPlan(true)}>
            <i className="bi bi-pencil" />
            Chỉnh sửa kế hoạch
          </button>
        )}
      </section>

      <section className="plan-grid">
        {filteredPlans.map((item) => (
          <PlanCard
            key={item.id}
            item={item}
            teacherMap={teacherMap}
            newestPlan={newestPlan}
            total={planTaskCounts[item.id] ?? 0}
          />
        ))}
      </section>

      <AddPlanModal
        show={showAddPlan}
        loading={false}
        onClose={() => setShowAddPlan(false)}
      />
    </>
  );
}
