import {
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { convertTargetField } from "../../constants/convertTargetAndField";
import { handleTimeStampFirestore } from "../../constants/convertTimeStamp";
import { addDocData } from "../../constants/firebase/addDocData";
import { getDocsData } from "../../constants/firebase/getDocsData";
import { updateDocData } from "../../constants/firebase/updateDocData";
import { groupArrayWithField } from "../../constants/groupArrayWithField";
import {
  handleToastError,
  handleToastSuccess,
} from "../../constants/handleToast";
import { calculateAgeText, icon512 } from "../../constants/info";
import { exportWord } from "../../exportFile/WordExport";
import { db, functions } from "../../firebase.config";
import { PlanTaskModel, ReportTaskModel } from "../../models";
import {
  useChildStore,
  useCommentStore,
  useFieldStore,
  useLoadingOverLayStore,
  useReportStore,
  useSelectNavbarStore,
  useTargetStore,
  useTeacherStore,
  useUserStore,
} from "../../zustand";
import CommentModal from "../modal/comment/CommentModal";
import "./ReportDetailPage.css";
import ReportTaskRow from "./ReportTaskRow";
import { exportReportDocx } from "../../constants/exportReportDocx";

export default function ReportDetailPage() {
  const [showComment, setShowComment] = useState(false);

  const [showFeedback, setShowFeedback] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { report } = location.state || {};
  const [reportTasks, setReportTasks] = useState<ReportTaskModel[]>([]);
  const { setLoadingOverLay } = useLoadingOverLayStore();
  const { targets } = useTargetStore();
  const { fields } = useFieldStore();
  const { child } = useChildStore();
  const { user } = useUserStore();
  const [disableComment, setDisableComment] = useState(true);
  const [isComment, setIsComment] = useState(false);
  const [text, setText] = useState("");
  const { reports, editReport } = useReportStore();
  const [planTasks, setPlanTasks] = useState<PlanTaskModel[]>([]);
  const { teachers } = useTeacherStore();
  const { setSelectNavbar } = useSelectNavbarStore();
  const isPending = report.status === "pending";
  const [showDelete, setShowDelete] = useState(false);
  const { removeReport } = useReportStore();
  const { addComment, comments } = useCommentStore();

  const myComments = useMemo(() => {
    return comments.filter((cmt) => cmt._id === report.id);
  }, [comments, report.id]);

  const teacherMap = useMemo(() => {
    const map: any = {};
    teachers.forEach((t) => {
      map[t.id] = t;
    });
    return map;
  }, [teachers]);
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
  const planTaskMap = useMemo(() => {
    const map: any = {};
    planTasks.forEach((t) => {
      map[t.id] = t;
    });
    return map;
  }, [planTasks]);

  // Lấy trực tiếp từ firebase
  useEffect(() => {
    if (report) {
      getDocsData({
        nameCollect: "reportTasks",
        condition: [
          where("teacherIds", "array-contains", user?.id),
          where("reportId", "==", report.id),
        ],
        setData: setReportTasks,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [report]);

  useEffect(() => {
    setIsComment(myComments.length > 0);
  }, [myComments]);

  useEffect(() => {
    if (text !== myComments[0]?.content) {
      setDisableComment(false);
    } else {
      setDisableComment(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  useEffect(() => {
    if (reportTasks.length > 0) {
      getPlanTasks(reportTasks);
    }
  }, [reportTasks]);

  const getPlanTasks = async (reportTasks: ReportTaskModel[]) => {
    const promiseItems = reportTasks.map(async (reportTask) => {
      const docSnap = await getDoc(doc(db, "planTasks", reportTask.planTaskId));
      return {
        ...docSnap.data(),
        id: docSnap.id,
      };
    });
    const result = await Promise.all(promiseItems);

    setPlanTasks(result as PlanTaskModel[]);
  };

  const getPlanTask = (planTaskId: string, planTasks: PlanTaskModel[]) => {
    const index = planTasks.findIndex((pt) => pt.id === planTaskId);
    if (index !== -1) {
      return planTasks[index];
    }
  };
  const handleGroupReportWithField = (reportTasks: ReportTaskModel[]) => {
    return groupArrayWithField(
      reportTasks.map((rt) => {
        return {
          ...rt,
          fieldId: convertTargetField(
            getPlanTask(rt.planTaskId, planTasks)?.targetId as string,
            targets,
            fields,
          ).fieldId,
        };
      }),
      "fieldId",
    );
  };

  const groupedReportTasks = useMemo(() => {
    if (!reportTasks?.length) return [];

    return handleGroupReportWithField(reportTasks);
  }, [reportTasks, planTasks, targets, fields]);

  //-------------------
  
  const handleExportWordBC = async () => {
    setLoadingOverLay(true);
    
    const promiseItems = handleGroupReportWithField(reportTasks).map(
      async (reportTask: ReportTaskModel) => {
        const docSnap = await getDoc(
          doc(db, "planTasks", reportTask.planTaskId),
        );
        if (docSnap.exists()) {
          return {
            intervention: docSnap.data().intervention,
            content: docSnap.data().content,
            field: convertTargetField(docSnap.data().targetId, targets, fields)
              .nameField,
            target: convertTargetField(docSnap.data().targetId, targets, fields)
              .nameTarget,
            total: reportTask.content,
          };
        } else {
          console.log(`getDoc data error`);
        }
      },
    );
    const result = await Promise.all(promiseItems);

    // exportWord(
    //   {
    //     rows: result,
    //     title: report.title.trim(),
    //     child: child?.fullName,
    //     teacher: user?.fullName,
    //   },
    //   "/template_BC.docx",
    // );
    await exportReportDocx({
          rows: result as any,
          title: report.title.trim(),
          child: child?.fullName,
          teacher: user?.fullName,
        });
    setLoadingOverLay(false);
  };
  const handleApproved = () => {
    const indexReport = reports.findIndex((r) => r.id === report.id);
    editReport(report.id, { ...reports[indexReport], status: "approved" });

    setLoadingOverLay(true);
    updateDocData({
      nameCollect: "reports",
      id: report.id,
      valueUpdate: { status: "approved", updateById: user?.id },
      metaDoc: "reports",
    })
      .then(() => {
        setLoadingOverLay(false);
        navigate("../pending");
        setSelectNavbar("pending");
        handleToastSuccess("Báo cáo được duyệt thành công !");
      })
      .catch((error) => {
        setLoadingOverLay(false);
        handleToastError("Duyệt báo cáo thất bại !");
        console.log(error);
      });
  };
  const handleDeleteReport = async () => {
    if (!report) return;

    setShowDelete(false);
    setLoadingOverLay(true);

    try {
      const res: any = await httpsCallable(
        functions,
        "deleteReport",
      )({
        reportId: report.id,
      });

      removeReport(report.id);

      handleToastSuccess(
        `Xóa báo cáo thành công cùng ${res.data.deletedCount} mục chi tiết báo cáo.`,
      );

      navigate("../pending");
      setSelectNavbar("pending");
    } catch (err: any) {
      console.error(err);

      if (err.code === "functions/permission-denied") {
        handleToastError("Bạn không có quyền xoá báo cáo");
      } else if (err.code === "functions/failed-precondition") {
        handleToastError("Không được xoá báo cáo đã duyệt");
      } else {
        handleToastError("Không thể xoá báo cáo");
      }
    } finally {
      setLoadingOverLay(false);
    }
  };
  const handleSaveReportTask = async () => {
    setLoadingOverLay(true);

    try {
      const res: any = await httpsCallable(
        functions,
        "updateReportTasks",
      )({
        reportId: report.id,
        reportTasks,
      });

      handleToastSuccess(
        `Đã cập nhật ${res.data.updatedCount} mục chi tiết báo cáo`,
      );
    } catch (error: any) {
      console.log(error);

      if (error.code === "functions/failed-precondition") {
        handleToastError("Báo cáo đã duyệt, không thể chỉnh sửa");
      } else {
        handleToastError("Chỉnh sửa báo cáo thất bại !");
      }
    } finally {
      setLoadingOverLay(false);
    }
  };
  const handleChangeTotal = (id: string, value: string) => {
    setReportTasks((prev: any[]) =>
      prev.map((item) => (item.id === id ? { ...item, content: value } : item)),
    );
  };
  const handleSaveComment = async (val: string) => {
    setShowFeedback(false);
    setLoadingOverLay(true);

    const ref = doc(collection(db, "comments"));

    const newComment = {
      _id: report.id,
      authorId: user?.id || "",
      childId: child?.id || "",
      content: val,
      createAt: Date.now(),
      id: ref.id,
      teacherIds: report.teacherIds,
      type: "BC",
      updateAt: Date.now(),
    };

    addComment(newComment);

    await addDocData({
      nameCollect: "comments",
      value: {
        ...newComment,
        createAt: serverTimestamp(),
        updateAt: serverTimestamp(),
      },
      metaDoc: "comments",
    });

    await updateDoc(doc(db, "Meta", "comments"), {
      lastUpdated: serverTimestamp(),
    });
    await updateDocData({
      nameCollect: "reports",
      id: report.id,
      metaDoc: "reports",
      valueUpdate: {
        comment: val,
        updateById: user?.id,
      },
    });

    setText("");
    setIsComment(true);
    setLoadingOverLay(false);
    setDisableComment(true);
  };
  return (
    <>
      <section className="detail-card student-card">
        <div className="student-left">
          <img className="child-avatar" src={child?.avatar || icon512} alt="child" />
          <div>
            <div className="student-name-row">
              <h2>{child?.fullName}</h2>
              <span
                className={`status-badge ${isPending ? "pending" : "approved"}`}
              >
                {isPending ? "Chờ duyệt" : "Đã duyệt"}
              </span>
            </div>
            <div className="child-meta">
              <span>
                <i className="bi bi-calendar2-week" /> {child?.birth}
              </span>
              <span>
                <i className="bi bi-gender-male" /> {child?.gender}
              </span>
              <span>
                <i className="bi bi-people" /> {calculateAgeText(child?.birth)}
              </span>
            </div>
          </div>
        </div>

        <div className="detail-actions">
          {isPending && (
            <>
              {["Phó Giám đốc", "Giám đốc"].includes(
                user?.position as string,
              ) && (
                <button
                  className="outline-btn blue"
                  onClick={() => setShowComment(true)}
                >
                  <i className="bi bi-chat-square-text" /> Góp ý
                </button>
              )}

              <button
                className="outline-btn red"
                onClick={() => setShowDelete(true)}
              >
                <i className="bi bi-trash" /> Xóa
              </button>
              <button
                className="outline-btn yellow"
                onClick={handleSaveReportTask}
              >
                <i className="bi bi-floppy" /> Lưu chỉnh sửa
              </button>
              {user?.role === "admin" && (
                <button
                  className="outline-btn pink"
                  style={{ textDecoration: "none" }}
                  onClick={handleApproved}
                >
                  <i className="bi-patch-check-fill" /> Duyệt
                </button>
              )}
            </>
          )}
          {!isPending && (
            <button className="export-btn" onClick={handleExportWordBC}>
              <i className="bi bi-download" /> Xuất file
            </button>
          )}
        </div>

        <div className="plan-info-grid">
          <div>
            <b>Báo cáo:</b>
            <span>Báo cáo can thiệp cá nhân tháng {report.title}</span>
          </div>
          <div>
            <b>Ngày tạo:</b>
            <span>
              {typeof report?.createAt === "number"
                ? moment(report?.createAt).format("HH:mm:ss DD/MM/YYYY")
                : moment(handleTimeStampFirestore(report?.createAt)).format(
                    "HH:mm:ss DD/MM/YYYY",
                  )}
            </span>
          </div>
          <div>
            <b>GV thực hiện:</b>
            <span>
              <img src={teacherMap[report.authorId]?.avatar || icon512} alt="teacher" />
              {teacherMap[report.authorId]?.fullName}
            </span>
          </div>
        </div>
      </section>

      <section className="detail-card task-card">
        <h3 className="section-title">Chi tiết báo cáo</h3>
        <div className="plan-table">
          <div className="report-table-head">
            <span>STT</span>
            <span>Lĩnh vực / Mục tiêu</span>
            <span>Nội dung can thiệp</span>
            <span>Mức độ hỗ trợ</span>
            <span>Tổng kết</span>
          </div>
          <div className="plan-table-body">
            {reportTasks.map((item, index) => (
              <ReportTaskRow
                key={item.id}
                item={item}
                index={index}
                targetMap={targetMap}
                fieldMap={fieldMap}
                planTaskMap={planTaskMap}
                onChangeTotal={handleChangeTotal}
                isPending={isPending}
              />
            ))}
          </div>
        </div>
      </section>

      {/* <section className="detail-card summary-card">
        <h3 className="section-title">Tổng kết chung</h3>
        <p>
          Trẻ có tiến bộ ở lĩnh vực giao tiếp và vận động tinh. Cần tăng cường
          hỗ trợ kỹ năng xã hội và duy trì luyện tập các kỹ năng đã đạt được để
          ổn định và phát triển tiếp.
        </p>
      </section> */}
      {isPending && myComments.length > 0 && (
        <section className="review-grid">
          <div className="detail-card review-card">
            <div className="review-head">
              <h3>Góp ý gần nhất</h3>
              {/* <span className="status-badge approved">Đã duyệt</span> */}
            </div>
            {myComments[0] && (
              <>
                <div className="review-person">
                  <img
                    src={teacherMap[myComments[0]?.authorId]?.avatar}
                    alt="reviewer"
                  />
                  <div>
                    <strong>
                      Cô {teacherMap[myComments[0]?.authorId]?.fullName}
                    </strong>
                    <span>{teacherMap[myComments[0]?.authorId]?.position}</span>
                  </div>
                  <time>
                    {typeof myComments[0]?.createAt === "number"
                      ? moment(myComments[0]?.createAt).format(
                          "HH:mm:ss DD/MM/YYYY",
                        )
                      : moment(
                          handleTimeStampFirestore(myComments[0]?.createAt),
                        ).format("HH:mm:ss DD/MM/YYYY")}
                  </time>
                </div>
                <p>{myComments[0].content} </p>
              </>
            )}
          </div>

          <div className="detail-card history-card">
            <div className="review-head">
              <h3>Lịch sử góp ý</h3>
              <button onClick={() => setShowComment(true)}>
                Danh sách góp ý
              </button>
            </div>
            <ul>
              <li>
                <i className="bi bi-chat-square-text blue-text" /> Tất cả góp ý{" "}
                <b>{myComments.length}</b>
              </li>
              {/* <li>
              <i className="bi bi-check2-circle green-text" /> Đã duyệt <b>1</b>
            </li>
            <li>
              <i className="bi bi-pencil-square yellow-text" /> Yêu cầu chỉnh
              sửa <b>2</b>
            </li>
            <li>
              <i className="bi bi-chat-left-dots orange-text" /> Đang chờ phản
              hồi <b>0</b>
            </li> */}
            </ul>
          </div>
        </section>
      )}

      <CommentModal
        show={showComment}
        onClose={() => setShowComment(false)}
        report={report}
        handleSaveComment={(val) => handleSaveComment(val)}
        comments={myComments}
        teacherMap={teacherMap}
        title="Danh sách góp ý"
        type="BC"
      />

      {showDelete && (
        <div className="custom-modal-backdrop">
          <div className="custom-modal">
            {/* Title */}
            <h5 className="fw-black text-danger mb-2">Xác nhận xoá báo cáo</h5>

            {/* Description */}
            <p className="text-green-muted small">
              Hành động này sẽ xoá toàn bộ nội dung báo cáo và không thể khôi
              phục.
            </p>

            {/* Plan info */}
            <div className="plan-delete-box mt-2">
              <div className="small">
                <strong>Tháng:</strong> {report.title}
              </div>
              <div className="small">
                <strong>Mã báo cáo:</strong> {report.id}
              </div>
            </div>

            {/* Actions */}
            <div className="d-flex gap-2 justify-content-end mt-3">
              <button
                className="btn action-btn-soft"
                onClick={() => setShowDelete(false)}
              >
                Huỷ
              </button>

              <button
                className="btn action-btn-danger"
                onClick={handleDeleteReport}
              >
                <i className="bi bi-trash me-2" />
                Xoá báo cáo
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
