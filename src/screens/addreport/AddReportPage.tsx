import { useEffect, useMemo, useState } from "react";
import "./AddReportPage.css";
import AddReportRow from "./AddReportRow";
import MobileReportCard from "./MobileReportCard";
import { reportGoals } from "./addReportData";
import { useNavigate } from "react-router-dom";
import { where } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { convertTargetField } from "../../constants/convertTargetAndField";
import { getDocsData } from "../../constants/firebase/getDocsData";
import { groupArrayWithField } from "../../constants/groupArrayWithField";
import {
  handleToastSuccess,
  handleToastError,
} from "../../constants/handleToast";
import { functions } from "../../firebase.config";
import { PlanTaskModel, PlanModel, ReportSavedModel } from "../../models";
import {
  usePlanStore,
  useTeacherStore,
  useTargetStore,
  useFieldStore,
  useUserStore,
  useChildStore,
  useReportStore,
  useSelectNavbarStore,
  useReportSavedStore,
  useLoadingOverLayStore,
} from "../../zustand";
import { icon512 } from "../../constants/info";

// interface Plan {
//   id: string;
//   name: string;
//   status: string;
// }

export default function AddReportPage() {
  // const plans = [
  //   {
  //     id: "1",
  //     name: "Kế hoạch can thiệp cá nhân - 05/2026",
  //     status: "Đã duyệt",
  //   },
  //   {
  //     id: "2",
  //     name: "Kế hoạch can thiệp cá nhân - 06/2026",
  //     status: "Đã duyệt",
  //   },
  //   {
  //     id: "3",
  //     name: "Kế hoạch can thiệp cá nhân - 07/2026",
  //     status: "Đã duyệt",
  //   },
  // ];

  const [showPlanDropdown, setShowPlanDropdown] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanModel | null>(null);

  const navigate = useNavigate();
  const { plans } = usePlanStore();
  const { targets } = useTargetStore();
  const { fields } = useFieldStore();
  const { user } = useUserStore();
  const { child } = useChildStore();
  const [planTasks, setPlanTasks] = useState<PlanTaskModel[]>([]);
  const [addReports, setAddReports] = useState<any[]>([]);
  const [disable, setDisable] = useState(true);
  const { setLoadingOverLay } = useLoadingOverLayStore();
  const [plan, setPlan] = useState<PlanModel>();
  const { addReport } = useReportStore();
  const [planApprovals, setPlanApprovals] = useState<PlanModel[]>([]);
  const { setSelectNavbar } = useSelectNavbarStore();
  const { reportSaveds, removeReportSaved, addReportSaved } =
    useReportSavedStore();
  const [isReportSaved, setIsReportSaved] = useState(false);
  const [planSelected, setPlanSelected] = useState(""); //nó chỉ là planId mà thôi
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiKeywordText, setAiKeywordText] = useState("");
  const [aiSelectedReport, setAiSelectedReport] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const targetMap = useMemo(() => {
    const map: any = {};
    targets.forEach((t) => {
      map[t.id] = t;
    });
    return map;
  }, [targets]);
  const fieldMap = useMemo(() => {
    const map: any = {};
    fields.forEach((t) => {
      map[t.id] = t;
    });
    return map;
  }, [fields]);

  const groupedReports = useMemo(() => {
    if (!addReports?.length) return [];

    return groupArrayWithField(
      addReports.map((item) => ({
        ...item,
        fieldId: convertTargetField(item.targetId, targets, fields).fieldId,
      })),
      "fieldId",
    );
  }, [addReports, targets, fields]);

  useEffect(() => {
    if (plans) {
      const items = plans.filter((plan) => plan.status === "approved");
      setPlanApprovals(items);
    }
  }, [plans]);

  useEffect(() => {
    if (addReports.length > 0) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [addReports]);

  useEffect(() => {
    if (planTasks) {
      // if (isReportSaved) {
      //   setAddReports(
      //     planTasks.map((planTask: any) => {
      //       const { id, ..._ } = planTask;
      //       return {
      //         ..._,
      //         reportSavedId: id,
      //         id: _.planTaskId,
      //       };
      //     })
      //   );
      // } else {
      //   setAddReports(planTasks);
      // }
      setAddReports(planTasks.map((item: any) => ({ ...item })));
    }
  }, [planTasks]);

  // -----------------
  const handleSelectPlan = (planId: string) => {
    setPlanSelected(planId);
    if (planId !== "") {
      const index = planApprovals.findIndex((_) => _.id === planId);
      setPlan(planApprovals[index]);

      const items = reportSaveds
        .filter(
          (reportSaved: ReportSavedModel) => reportSaved.planId === planId,
        )
        .map((item: any) => ({ ...item }));
      if (items.length > 0) {
        setIsReportSaved(true);
        setPlanTasks(items);
      } else {
        setIsReportSaved(false);
        getDocsData({
          nameCollect: "planTasks",
          condition: [
            where("teacherIds", "array-contains", user?.id),
            where("planId", "==", planId),
          ],
          setData: setPlanTasks,
        });
      }
    } else {
      setPlanTasks([]);
      setDisable(true);
    }
  };
  const handleGenerateAiSummary = async () => {
    if (!user) {
      handleToastError("Bạn cần đăng nhập để dùng AI");
      return;
    }

    if (!aiSelectedReport) {
      handleToastError("Chưa chọn mục tiêu để tạo tổng kết");
      return;
    }

    const teacherBullets = aiKeywordText
      .split(/\n|,|;/)
      .map((line) => line.replace(/^[-•]\s*/, "").trim())
      .filter(Boolean);

    if (teacherBullets.length === 0) {
      handleToastError("Vui lòng nhập ít nhất một ý chính để AI tạo tổng kết");
      return;
    }

    const domain =
      convertTargetField(aiSelectedReport.targetId, targets, fields)
        .nameField || "";

    const supportText = aiSelectedReport.intervention || "";
    const teachingContent = aiSelectedReport.content || "";

    if (!domain) {
      handleToastError("Thiếu lĩnh vực của mục tiêu");
      return;
    }

    if (!supportText) {
      handleToastError("Thiếu mức độ hỗ trợ");
      return;
    }

    if (!teachingContent) {
      handleToastError("Thiếu nội dung can thiệp");
      return;
    }

    // setShowAiModal(false);
    setAiLoading(true);
    setLoadingOverLay(true);

    try {
      const res = await httpsCallable<
        {
          goal: {
            domain: string;
            supportText: string;
            teachingContent: string;
            teacherBullets: string[];
          };
        },
        {
          ok: boolean;
          summary: string;
        }
      >(
        functions,
        "generateGoalSummaryAI",
      )({
        goal: {
          domain,
          supportText,
          teachingContent,
          teacherBullets,
        },
      });

      if (!res.data?.ok || !res.data?.summary?.trim()) {
        handleToastError("AI chưa tạo được nội dung tổng kết");
        return;
      }

      setAddReports((prev: any[]) =>
        prev.map((item) =>
          item.id === aiSelectedReport.id
            ? {
                ...item,
                total: res.data.summary.trim(),
              }
            : item,
        ),
      );

      handleToastSuccess("Đã tạo tổng kết bằng AI");
      setShowAiModal(false);

      setAiSelectedReport(null);
      setAiKeywordText("");
    } catch (error: any) {
      console.error("Generate AI summary error:", error);

      if (error.code === "functions/unauthenticated") {
        handleToastError("Bạn cần đăng nhập để dùng AI");
      } else if (error.code === "functions/invalid-argument") {
        handleToastError(error.message || "Thiếu dữ liệu để tạo tổng kết");
      } else if (error.code === "functions/resource-exhausted") {
        handleToastError("AI đang quá tải, vui lòng thử lại sau");
      } else {
        handleToastError("Không thể tạo tổng kết bằng AI");
      }
    } finally {
      setAiLoading(false);
      setLoadingOverLay(false);
    }
  };
  const handleOpenAiModal = (report: any) => {
    setAiSelectedReport(report);
    setAiKeywordText("");
    setShowAiModal(true);
  };
  const handleCloseAiModal = () => {
    setShowAiModal(false);
    setAiSelectedReport(null);
    setAiKeywordText("");
  };
  const handleAddReport = async () => {
    if (!user || !child || !plan) return;

    setLoadingOverLay(true);

    try {
      const res = await httpsCallable<
        {
          childId: string;
          planId: string;
          addReports: any[];
          isReportSaved: boolean;
        },
        {
          success: boolean;
          reportId: string;
          created: {
            reports: number;
            reportTasks: number;
          };
          deleted: {
            reportSaveds: number;
          };
        }
      >(
        functions,
        "createReportFromPlan",
      )({
        childId: child.id,
        planId: plan.id,
        addReports,
        isReportSaved,
      });

      addReport({
        id: res.data.reportId,
        type: "BC",
        title: plan.title as string,
        childId: child.id,
        teacherIds: child.teacherIds,
        authorId: user.id,
        planId: plan.id,
        status: "pending",
        comment: "",
        updateById: user.id,
        createAt: Date.now(),
        updateAt: Date.now(),
      });

      if (isReportSaved) {
        addReports.forEach((item) => {
          if (item.id) {
            removeReportSaved(item.id);
          }
        });
      }

      setIsReportSaved(false);

      handleToastSuccess(
        `Thêm mới báo cáo thành công! Đã tạo ${res.data.created.reportTasks} mục báo cáo.`,
      );

      navigate("../pending");
      setSelectNavbar("pending");
    } catch (error: any) {
      console.error(error);

      if (error.code === "functions/permission-denied") {
        handleToastError("Bạn không có quyền tạo báo cáo");
      } else if (error.code === "functions/failed-precondition") {
        handleToastError(
          error.message || "Không thể tạo báo cáo từ kế hoạch này",
        );
      } else if (error.code === "functions/not-found") {
        handleToastError("Không tìm thấy trẻ hoặc kế hoạch");
      } else {
        handleToastError("Thêm mới báo cáo thất bại!");
      }
    } finally {
      setLoadingOverLay(false);
      setSelectedPlan(null);
    }
  };
  const handleSaveReportSaved = async () => {
    if (!child || !plan) return;

    setLoadingOverLay(true);

    try {
      const res = await httpsCallable<
        {
          childId: string;
          planId: string;
          addReports: any[];
          isReportSaved: boolean;
        },
        {
          success: boolean;
          saved: {
            reportSaveds: number;
          };
          deleted: {
            reportSaveds: number;
          };
          items: any[];
        }
      >(
        functions,
        "saveReportSaveds",
      )({
        childId: child.id,
        planId: plan.id,
        addReports,
        isReportSaved,
      });

      // Nếu đang lưu lại bản nháp cũ thì xoá UI cũ
      if (isReportSaved) {
        addReports.forEach((item) => {
          if (item.id) {
            removeReportSaved(item.id);
          }
        });
      }

      // Thêm UI bản nháp mới từ CF trả về
      res.data.items.forEach((item) => {
        addReportSaved({
          ...item,
          createAt: Date.now(),
          updateAt: Date.now(),
        });
      });

      setIsReportSaved(true);
      setPlan(undefined);
      setPlanSelected("");
      setPlanTasks([]);
      setDisable(true);

      handleToastSuccess(
        `Lưu nháp báo cáo thành công! Đã lưu ${res.data.saved.reportSaveds} mục.`,
      );
    } catch (error: any) {
      console.error(error);

      if (error.code === "functions/permission-denied") {
        handleToastError("Bạn không có quyền lưu nháp báo cáo");
      } else if (error.code === "functions/not-found") {
        handleToastError("Không tìm thấy trẻ hoặc kế hoạch");
      } else {
        handleToastError("Lưu nháp báo cáo thất bại!");
      }
    } finally {
      setLoadingOverLay(false);
      setSelectedPlan(null);
    }
  };
  const handleChangeTotal = (id: string, value: string) => {
    setAddReports((prev: any[]) =>
      prev.map((item) => (item.id === id ? { ...item, total: value } : item)),
    );
  };

  return (
    <section className="add-report-layout">
      <div className="form-column">
        <div className="top-form-grid">
          <label className="form-group child-select">
            <span>Tạo báo cáo can thiệp cho trẻ</span>
            <button className="select-box">
              <img src={child?.avatar || icon512} alt="child" />
              <b>{child?.fullName}</b>
            </button>
          </label>

          {/* <label className="form-group plan-select">
            <span>Chọn kế hoạch can thiệp</span>
            <button className="select-box">
              <b>Kế hoạch can thiệp cá nhân - 01/05/2024</b>
              <em>Đã duyệt</em>
              <i className="bi bi-chevron-down" />
            </button>
          </label> */}
          <label className="form-group plan-select">
            <span>Chọn kế hoạch can thiệp</span>

            <div className="custom-select-wrapper">
              <button
                type="button"
                className={`select-box ${selectedPlan ? "has-value" : ""}`}
                onClick={() => setShowPlanDropdown((v) => !v)}
              >
                <b>
                  {selectedPlan
                    ? `Kế hoạch can thiệp tháng ${selectedPlan?.title}`
                    : "Chọn kế hoạch can thiệp đã duyệt"}
                </b>

                {selectedPlan && (
                  <em>
                    {selectedPlan.status === "approved"
                      ? "Đã duyệt"
                      : "Chờ duyệt"}
                  </em>
                )}

                <i
                  className={`bi ${
                    showPlanDropdown ? "bi-chevron-up" : "bi-chevron-down"
                  }`}
                />
              </button>

              {showPlanDropdown && (
                <div className="plan-dropdown">
                  <button
                    type="button"
                    className="plan-option"
                    onClick={() => {
                      setSelectedPlan(null);
                      setShowPlanDropdown(false);
                    }}
                  >
                    <div>
                      <strong>Bỏ chọn</strong>
                      <span></span>
                    </div>
                  </button>
                  {planApprovals &&
                    planApprovals.map((plan) => (
                      <button
                        key={plan.id}
                        type="button"
                        className="plan-option"
                        onClick={() => {
                          setSelectedPlan(plan);
                          setShowPlanDropdown(false);
                          handleSelectPlan(plan.id);
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: 0,
                            gap: "16px",
                          }}
                        >
                          <strong>
                            Kế hoạch can thiệp tháng {plan.title}{" "}
                          </strong>
                          <span>Đã duyệt</span>
                          {selectedPlan?.id === plan.id && (
                            <i className="bi bi-check2-all"></i>
                          )}
                        </div>
                      </button>
                    ))}
                </div>
              )}
            </div>
          </label>

          {/* <label className="form-group date-select">
            <span>Ngày báo cáo</span>
            <button className="select-box">
              <b>24/05/2024</b>
              <i className="bi bi-calendar2-week" />
            </button>
          </label> */}
        </div>
        {selectedPlan ? (
          <>
            <section className="report-table-card">
              <div className="add-report-table-head">
                <span>Lĩnh vực/Mục tiêu</span>
                <span>Chiến lược</span>
                <span>Mức độ hỗ trợ</span>
                <span>Tổng kết</span>
              </div>
              <div className="report-table-body">
                {addReports.map((item) => (
                  <AddReportRow
                    key={item.id}
                    item={item}
                    targetMap={targetMap}
                    fieldMap={fieldMap}
                    onChangeTotal={handleChangeTotal}
                    onOpenAiModal={handleOpenAiModal}
                  />
                ))}
              </div>
            </section>

            <section className="mobile-form-list">
              {addReports.map((item, index) => (
                <MobileReportCard
                  key={item.id}
                  item={item}
                  index={index}
                  targetMap={targetMap}
                  fieldMap={fieldMap}
                  onChangeTotal={handleChangeTotal}
                  onOpenAiModal={handleOpenAiModal}
                />
              ))}
            </section>

            {/* <label className="general-note">
              <span>Nhận xét chung</span>
              <textarea defaultValue="Trẻ có tiến bộ ở nhóm kỹ năng giao tiếp và vận động tinh. Cần tăng cường hỗ trợ ở kỹ năng xã hội. Tiếp tục duy trì các mục tiêu hiện tại và theo dõi sát sao." />
            </label> */}
          </>
        ) : (
          <section className="empty-report-state">
            <div className="empty-icon">
              <i className="bi bi-clipboard2-check"></i>
            </div>

            <h3>Chưa chọn kế hoạch can thiệp</h3>

            <p>
              Vui lòng chọn một <strong>kế hoạch đã được duyệt</strong> để tạo
              báo cáo can thiệp.
            </p>

            <button
              className="choose-plan-btn"
              onClick={() => setShowPlanDropdown(!showPlanDropdown)}
            >
              <i className="bi bi-folder2-open"></i>
              Chọn kế hoạch
            </button>
          </section>
        )}

        <div className="form-actions">
          <button
            className="draft-btn"
            style={{ background: "#2d9c4b", color: "#fff" }}
            onClick={disable ? undefined : handleSaveReportSaved}
          >
            Lưu nháp
          </button>
          <button
            className="submit-btn"
            onClick={disable ? undefined : handleAddReport}
          >
            <i className="bi bi-send-check" style={{ marginRight: "12px" }}></i>
            Gửi chờ duyệt
          </button>
        </div>
      </div>

      {showAiModal && (
        <div className="custom-modal-backdrop">
          <div className="custom-modal">
            <h5 className="fw-black text-green-dark mb-2">
              Tạo tổng kết bằng AI
            </h5>

            <p className="text-green-muted small">
              Nhập các ý chính giáo viên muốn đưa vào phần tổng kết. Mỗi ý nên
              xuống dòng riêng.
            </p>

            <textarea
              className="form-control"
              rows={6}
              placeholder={`Ví dụ:
- trẻ thực hiện tốt hơn khi có mẫu
- cần nhắc bằng lời
- đạt 7/10 cơ hội
- duy trì 3 ngày`}
              value={aiKeywordText}
              onChange={(e) => setAiKeywordText(e.target.value)}
            />

            <div className="d-flex gap-2 justify-content-end mt-3">
              <button
                className="btn action-btn-soft"
                onClick={handleCloseAiModal}
                style={{ background: "#d2cccc" }}
              >
                Huỷ
              </button>

              <button
                className="btn action-btn-primary"
                onClick={handleGenerateAiSummary}
                disabled={aiKeywordText.trim() === ""}
                style={{ background: "rgb(45, 156, 75)", color: "#fff" }}
              >
                <i className="bi bi-stars me-2" />
                {aiLoading ? "Đang tạo..." : "Tạo tổng kết"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
