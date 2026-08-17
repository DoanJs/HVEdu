import {
  collection,
  doc,
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
import { PlanTaskModel } from "../../models";
import {
  useCartEditStore,
  useCartStore,
  useChildStore,
  useCommentStore,
  useFieldStore,
  useLoadingOverLayStore,
  usePlanStore,
  useSelectNavbarStore,
  useTargetStore,
  useTeacherStore,
  useUserStore,
} from "../../zustand";
import CommentModal from "../modal/comment/CommentModal";
import "./PlanDetailPage.css";
import PlanTaskRow from "./PlanTaskRow";

export default function PlanDetailPage() {
  const [showComment, setShowComment] = useState(false);

  const [showFeedback, setShowFeedback] = useState(false);
  const [text, setText] = useState("");
  const [disableComment, setDisableComment] = useState(true);
  const { setLoadingOverLay } = useLoadingOverLayStore();
  const [isComment, setIsComment] = useState(false);

  const location = useLocation();
  const { plan } = location.state || {};
  const { targets } = useTargetStore();
  const { fields } = useFieldStore();
  const { child } = useChildStore();
  const { user } = useUserStore();
  const [planTasks, setPlanTasks] = useState<PlanTaskModel[]>([]);
  const { teachers } = useTeacherStore();
  const { plans, editPlan } = usePlanStore();
  const navigate = useNavigate();
  const { setSelectNavbar } = useSelectNavbarStore();
  const isPending = plan.status === "pending";
  const { setCarts } = useCartStore();
  const { setCartEdit } = useCartEditStore();
  const [showDelete, setShowDelete] = useState(false);
  const { removePlan } = usePlanStore();
  const { addComment, comments } = useCommentStore();

  const myComments = useMemo(() => {
    return comments.filter((cmt) => cmt._id === plan.id);
  }, [comments, plan.id]);

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

  // Lấy trực tiếp từ firebase
  useEffect(() => {
    if (plan) {
      getDocsData({
        nameCollect: "planTasks",
        condition: [
          where("teacherIds", "array-contains", user?.id),
          where("planId", "==", plan.id),
        ],
        setData: setPlanTasks,
      });
    }
    // eslint-disable-next-line
  }, [plan]);

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

  const hanldeGroupPlanWithField = (planTasks: PlanTaskModel[]) => {
    return groupArrayWithField(
      planTasks.map((_) => {
        return {
          ..._,
          fieldId: convertTargetField(_.targetId, targets, fields).fieldId,
        };
      }),
      "fieldId",
    );
  };

  // ----------------
  const handleExportWordKH = () => {
    const items = hanldeGroupPlanWithField(planTasks).map(
      (planTask: PlanTaskModel) => {
        return {
          field: convertTargetField(planTask.targetId, targets, fields)
            .nameField,
          target: convertTargetField(planTask.targetId, targets, fields)
            .nameTarget,
          intervention: planTask.intervention,
          content: planTask.content,
        };
      },
    );
    exportWord(
      {
        rows: items,
        title: plan.title.trim(),
        child: child?.fullName,
        teacher: user?.fullName,
      },
      "/template_KH.docx",
    );
  };
  const handleDeletePlan = async () => {
    if (!plan) return;

    setShowDelete(false);
    setLoadingOverLay(true);

    try {
      const res: any = await httpsCallable(
        functions,
        "deletePlan",
      )({
        planId: plan.id,
        mode: "hard",
      });

      const deleted = res.data.deleted;

      removePlan(plan.id);

      handleToastSuccess(
        `Đã xoá kế hoạch thành công cùng ${deleted.planTasks} chi tiết kế hoạch, 
        ${deleted.reports} báo cáo, 
        ${deleted.reportTasks} chi tiết báo cáo, 
        ${deleted.reportSaveds} bản lưu báo cáo, 
        ${deleted.comments} góp ý`,
      );

      navigate("../pending");
      setSelectNavbar("pending");
    } catch (err: any) {
      console.error(err);

      if (err.code === "functions/permission-denied") {
        handleToastError("Bạn không có quyền xoá kế hoạch");
      } else {
        handleToastError("Không thể xoá kế hoạch");
      }
    } finally {
      setLoadingOverLay(false);
    }
  };
  const handleApproved = () => {
    const indexPlan = plans.findIndex((p) => p.id === plan.id);
    editPlan(plan.id, { ...plans[indexPlan], status: "approved" });
    setLoadingOverLay(true);
    updateDocData({
      nameCollect: "plans",
      id: plan.id,
      valueUpdate: { status: "approved", updateById: user?.id },
      metaDoc: "plans",
    })
      .then(() => {
        setLoadingOverLay(false);
        navigate("../pending");
        setSelectNavbar("pending");
        handleToastSuccess("Kế hoạch được duyệt thành công !");
      })
      .catch((error) => {
        setLoadingOverLay(false);
        handleToastError("Duyệt kế hoạch thất bại !");
        console.log(error);
      });
  };
  const handleEditPlan = () => {
    const convertPlanTasksToCarts = planTasks.map((_) => {
      const { targetId, planId, ...newPlanTask } = _;
      return {
        ...newPlanTask,
        targetId: _.targetId,
        fieldId: convertTargetField(_.targetId, targets, fields).fieldId,
        name: convertTargetField(_.targetId, targets, fields).nameTarget,
        level: convertTargetField(_.targetId, targets, fields).levelTarget,
      };
    });
    setCarts(convertPlanTasksToCarts);
    setCartEdit(plan.id);
    setSelectNavbar("cart");
  };
  const handleSaveComment = async (val: string) => {
    setShowFeedback(false);
    setLoadingOverLay(true);
    const ref = doc(collection(db, "comments"));

    const newComment = {
      _id: plan.id,
      authorId: user?.id || "",
      childId: child?.id || "",
      content: val,
      createAt: Date.now(),
      id: ref.id,
      teacherIds: plan.teacherIds,
      type: "KH",
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
      nameCollect: "plans",
      id: plan.id,
      metaDoc: "plans",
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
          <img className="child-avatar" src={child?.avatar  || icon512} alt="child" />
          <div>
            <div className="student-name-row">
              <h2>{child?.fullName}</h2>
              <span className={`status-badge ${plan?.status}`}>
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
              <Link
                to={"../cart"}
                className="outline-btn yellow"
                style={{ textDecoration: "none" }}
                onClick={handleEditPlan}
              >
                <i className="bi bi-pencil" /> Chỉnh sửa
              </Link>
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
            <button className="export-btn" onClick={handleExportWordKH}>
              <i className="bi bi-download" /> Xuất file
            </button>
          )}
        </div>

        <div className="plan-info-grid">
          <div>
            <b>Kế hoạch:</b>
            <span>Kế hoạch can thiệp cá nhân tháng {plan?.title}</span>
          </div>
          <div>
            <b>Ngày tạo:</b>
            <span>
              {typeof plan?.createAt === "number"
                ? moment(plan?.createAt).format("HH:mm:ss DD/MM/YYYY")
                : moment(handleTimeStampFirestore(plan?.createAt)).format(
                    "HH:mm:ss DD/MM/YYYY",
                  )}
            </span>
          </div>
          {/* <div>
            <b>Tần suất</b>
            <span>3 buổi/tuần</span>
          </div> */}
          <div>
            <b>GV thực hiện:</b>
            <span>
              <img src={teacherMap[plan?.authorId]?.avatar || icon512} alt="teacher" />
              {teacherMap[plan?.authorId]?.fullName}
            </span>
          </div>
        </div>
      </section>

      <section className="detail-card task-card">
        <h3 className="section-title">Danh sách mục tiêu</h3>
        <div className="plan-table">
          <div className="plan-table-head">
            <span>STT</span>
            <span>Mục tiêu</span>
            <span>Lĩnh vực</span>
            <span>Mức độ hỗ trợ</span>
            <span>Nội dung can thiệp</span>
          </div>
          <div className="plan-table-body">
            {planTasks.map((item, index) => (
              <PlanTaskRow
                key={item.id}
                item={item}
                index={index}
                targetMap={targetMap}
                fieldMap={fieldMap}
              />
            ))}
          </div>
        </div>
      </section>

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
                    src={teacherMap[myComments[0].authorId]?.avatar}
                    alt="reviewer"
                  />
                  <div>
                    <strong>
                      Cô {teacherMap[myComments[0].authorId]?.fullName}{" "}
                    </strong>
                    <span>{teacherMap[myComments[0].authorId]?.position}</span>
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
                <p>{myComments[0].content}</p>
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

      {showDelete && (
        <div className="custom-modal-backdrop">
          <div className="custom-modal">
            {/* Title */}
            <h5 className="fw-black text-danger mb-2">Xác nhận xoá kế hoạch</h5>

            {/* Description */}
            <p className="text-green-muted small">
              Hành động này sẽ xoá toàn bộ nội dung kế hoạch và không thể khôi
              phục.
            </p>

            {/* Plan info */}
            <div className="plan-delete-box mt-2">
              <div className="small">
                <strong>Tháng:</strong> {plan.title}
              </div>
              <div className="small">
                <strong>Mã kế hoạch:</strong> {plan.id}
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
                onClick={handleDeletePlan}
              >
                <i className="bi bi-trash me-2" />
                Xoá kế hoạch
              </button>
            </div>
          </div>
        </div>
      )}

      <CommentModal
        show={showComment}
        onClose={() => setShowComment(false)}
        plan={plan}
        handleSaveComment={(val) => handleSaveComment(val)}
        comments={myComments}
        teacherMap={teacherMap}
        title="Danh sách góp ý"
        type="KH"
      />
    </>
  );
}
