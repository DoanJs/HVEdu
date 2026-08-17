import { useMemo, useState } from "react";
import PlanCard from "./PlanCard";
import { plans } from "./planData";
import "./PlanPage.css";

export default function PlanPage() {
  const [keyword, setKeyword] = useState("");
  const [teacher, setTeacher] = useState("all");

  const teachers = useMemo(
    () => ["all", ...new Set(plans.map((item) => item.teacher))],
    [],
  );

  const filteredPlans = useMemo(() => {
    return plans.filter((item) => {
      const matchKeyword = `${item.month} ${item.subTitle} ${item.teacher}`
        .toLowerCase()
        .includes(keyword.toLowerCase());
      const matchTeacher = teacher === "all" || item.teacher === teacher;
      return matchKeyword && matchTeacher;
    });
  }, [keyword, teacher]);

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

        <div className="filter-box">
          <i className="bi bi-funnel" />
          <select value={teacher} onChange={(e) => setTeacher(e.target.value)}>
            {teachers.map((name) => (
              <option key={name} value={name}>
                {name === "all" ? "Lọc theo giáo viên" : name}
              </option>
            ))}
          </select>
        </div>

        <button className="create-btn">
          <i className="bi bi-plus-lg" />
          Tạo kế hoạch mới
        </button>
      </section>

      <section className="plan-grid">
        {filteredPlans.slice(0, 8).map((item) => (
          <PlanCard key={item.id} item={item} />
        ))}
      </section>
    </>
  );
}
