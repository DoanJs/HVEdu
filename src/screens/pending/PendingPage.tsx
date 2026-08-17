import { useEffect, useMemo, useState } from "react";
import PendingCard from "./PendingCard";
import { pendingItems } from "./pendingData";
import "./PendingPage.css";
import { usePlanStore, useReportStore, useSelectNavbarStore, useTeacherStore } from "../../zustand";
import { formatDateSearch } from "../../constants/info";
import { PlanModel, ReportModel } from "../../models";

export default function PendingPage() {
  const [keyword, setKeyword] = useState("");
  const { plans } = usePlanStore();
  const { reports } = useReportStore();
  const [plansPending, setPlansPending] = useState<PlanModel[]>([]);
  const [reportsPending, setReportsPending] = useState<ReportModel[]>([]);
  const { teachers } = useTeacherStore();
  const { setSelectNavbar } = useSelectNavbarStore();


  const teacherMap = useMemo(() => {
    const map: any = {};
    teachers.forEach((t) => {
      map[t.id] = t;
    });
    return map;
  }, [teachers]);

  useEffect(() => {
    if (plans) {
      const items = plans.filter((plan) => plan.status === "pending");
      setPlansPending(items);
    }
  }, [plans]);

  useEffect(() => {
    if (reports) {
      const items = reports.filter((report) => report.status === "pending");
      setReportsPending(items);
    }
  }, [reports]);

  const filteredItems = useMemo(() => {
    const search = keyword.trim().toLowerCase();

    return plansPending.concat(reportsPending).filter((item: any) => {
      const teacherName = teacherMap[item.authorId]?.fullName || "";

      const createdTime = formatDateSearch(item.createAt);
      const updatedTime = formatDateSearch(item.updateAt);

      const content = `
        ${item.title ?? ""}
        ${item.id ?? ""}
        ${teacherName}
        ${createdTime}
        ${updatedTime}
      `.toLowerCase();

      return !search || content.includes(search);
    });
  }, [plansPending, reportsPending, keyword, teacherMap]);
  return (
    <>
      <section className="pending-grid">
        {filteredItems.map((item) => (
          <PendingCard key={item.id} item={item} teacherMap={teacherMap}/>
        ))}
      </section>

      <div className="pending-note">
        <span>
          <i className="bi bi-info-lg" />
        </span>
        <p>
          Sau khi được duyệt, kế hoạch và báo cáo sẽ được lưu trữ và hiển thị
          trong danh sách chính thức.
        </p>
      </div>
    </>
  );
}
