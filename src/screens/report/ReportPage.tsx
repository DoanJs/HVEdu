import { useEffect, useMemo, useState } from "react";
import ReportCard from "./ReportCard";
import { reports } from "./reportData";
import "./ReportPage.css";
import { Link } from "react-router-dom";
import {
  formatDateSearch,
  getTimeMs,
  getTimeValue,
} from "../../constants/info";
import { ReportModel } from "../../models";
import {
  useReportStore,
  useSelectNavbarStore,
  useTeacherStore,
  useTotalReportTaskStore,
  useUserStore,
} from "../../zustand";
import AddReportModal from "../modal/addReport/AddReportModal";

export default function ReportPage() {
  const [keyword, setKeyword] = useState("");
  const [showAddReport, setShowAddReport] = useState(false);
  const { user } = useUserStore();
  const { reports } = useReportStore();
  const [reportNews, setReportNews] = useState<ReportModel[]>([]);
  const { setSelectNavbar } = useSelectNavbarStore();
  const { teachers } = useTeacherStore();
  const { totalReportTasks } = useTotalReportTaskStore();

  const teacherMap = useMemo(() => {
    const map: any = {};
    teachers.forEach((t) => {
      map[t.id] = t;
    });
    return map;
  }, [teachers]);
  const newestPlan = useMemo(() => {
    if (!reports.length) return undefined;

    return reports.reduce((latest, current) =>
      getTimeMs(current.createAt) > getTimeMs(latest.createAt)
        ? current
        : latest,
    );
  }, [reports]);
  const reportTaskCounts = useMemo(() => {
    return totalReportTasks.reduce<Record<string, number>>((acc, item) => {
      acc[item.reportId] = (acc[item.reportId] ?? 0) + 1;
      return acc;
    }, {});
  }, [totalReportTasks]);

  useEffect(() => {
    if (reports) {
      const items = reports.filter((report) => report.status === "approved");
      setReportNews(items);
    }
  }, [reports]);

  const filteredReports = useMemo(() => {
    const search = keyword.trim().toLowerCase();

    return reportNews
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
  }, [reportNews, keyword, teacherMap]);

  return (
    <>
      <section className="toolbar">
        <div className="search-box">
          <i className="bi bi-search" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm kiếm báo cáo..."
          />
        </div>

        <Link
          to="../addreport"
          className="create-btn"
          style={{ textDecoration: "none" }}
        >
          <i className="bi bi-plus-lg" />
          Tạo báo cáo mới
        </Link>
        {user && user.role && (
          <button className="target-add" onClick={() => setShowAddReport(true)}>
            <i className="bi bi-pencil" />
            Chỉnh sửa báo cáo
          </button>
        )}
      </section>

      <section className="report-grid">
        {filteredReports.slice(0, 8).map((item) => (
          <ReportCard
            key={item.id}
            item={item}
            teacherMap={teacherMap}
            newestPlan={newestPlan}
            total={reportTaskCounts[item.id] ?? 0}
          />
        ))}
      </section>

      <AddReportModal
        show={showAddReport}
        loading={false}
        onClose={() => setShowAddReport(false)}
      />
    </>
  );
}
