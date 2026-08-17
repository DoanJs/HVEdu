import { serverTimestamp } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { updateDocData } from "../../../constants/firebase/updateDocData";
import {
  handleToastError,
  handleToastSuccess,
} from "../../../constants/handleToast";
import { functions } from "../../../firebase.config";
import { PlanModel } from "../../../models";
import { useLoadingOverLayStore, usePlanStore } from "../../../zustand";
import "./AddPlanModal.css";

export type NewPlanForm = {
  title: string;
  status: string;
};

type AddPlanModalProps = {
  show: boolean;
  onClose: () => void;
  loading?: boolean;
};

const initialForm: NewPlanForm = {
  title: "",
  status: "",
};

export default function AddPlanModal({
  show,
  onClose,
  loading = false,
}: AddPlanModalProps) {
  const [form, setForm] = useState<NewPlanForm>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const { setLoadingOverLay } = useLoadingOverLayStore();
  const [planEdit, setPlanEdit] = useState<PlanModel>();
  const { plans, editPlan, removePlan } = usePlanStore();

  const errors = useMemo(() => {
    return {
      title:
        submitted && !form.title.trim() ? "Vui lòng nhập tháng kế hoạch." : "",
    };
  }, [form, submitted]);

  const isValid = form.title.trim() !== "" && form.status !== "";

  useEffect(() => {
    if (!show) return;

    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [show, onClose, loading]);

  useEffect(() => {
    if (planEdit) {
      setForm({
        title: planEdit.title || "",
        status: planEdit.status || "pending",
      });
    }
  }, [planEdit]);

  if (!show) return null;

  const updateField = <K extends keyof NewPlanForm>(
    field: K,
    value: NewPlanForm[K],
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const resetAndClose = () => {
    if (loading) return;

    setForm(initialForm);
    onClose();
  };

  //   --------------------
  const resetData = () => {
    setForm(initialForm);
    setPlanEdit(undefined);
  };
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);

    if (!isValid || loading) return;

    setLoadingOverLay(true);

    if (planEdit) {
      updateDocData({
        nameCollect: "plans",
        id: planEdit.id,
        valueUpdate: {
          ...form,
          updateAt: serverTimestamp(),
        },
        metaDoc: "plans",
      })
        .then((result) => {
          // cập nhật UI ngay
          editPlan(planEdit.id, { ...form });

          setLoadingOverLay(false);
          setPlanEdit(undefined);
          handleToastSuccess(
            `Chỉnh sửa kế hoạch thành công ! (${planEdit.id}) `,
          );
        })
        .catch((error) => {
          setLoadingOverLay(false);
          handleToastError("Chỉnh sửa kế hoạch thất bại !");
        });
    }

    resetData();
  };

  const handleSelectedPlan = (id: string) => {
    if (id.trim() === "") {
      resetData();
      return;
    }
    const plan = plans.find((_) => _.id === id);
    setPlanEdit(plan);
  };
  const handleDeletePlan = async () => {
    if (!planEdit) return;
    setLoadingOverLay(true);
    try {
      const deletePlanCF = httpsCallable<
        { planId: string },
        {
          success: boolean;
          deleted: {
            planTasks: number;
            reports: number;
            reportTasks: number;
            reportSaveds: number;
          };
        }
      >(functions, "deletePlan");
      const res = await deletePlanCF({
        planId: planEdit.id,
      });
      const deleted = res.data.deleted;
      const totalDeleted =
        1 +
        deleted.planTasks +
        deleted.reports +
        deleted.reportTasks +
        deleted.reportSaveds;

      removePlan(planEdit.id);

      handleToastSuccess(
        `Xóa kế hoạch thành công! Đã xóa ${totalDeleted} mục liên quan.`,
      );
    } catch (err: any) {
      console.error(err);
      if (err.code === "functions/permission-denied") {
        handleToastError("Bạn không có quyền xoá kế hoạch");
      } else if (err.code === "functions/not-found") {
        handleToastError("Không tìm thấy kế hoạch");
      } else if (err.code === "functions/failed-precondition") {
        handleToastError("Chỉ được xoá kế hoạch đang pending");
      } else if (err.code === "functions/unauthenticated") {
        handleToastError("Bạn cần đăng nhập lại");
      } else {
        handleToastError("Xóa kế hoạch thất bại");
      }
    } finally {
      setLoadingOverLay(false);
      resetData();
    }
  };
  const onDeletePlan = () => {
    const isConfirmed = window.confirm(
      "Bạn có chắc chắn muốn xóa kế hoạch này?\n\nDữ liệu sau khi xóa sẽ không thể khôi phục.",
    );

    if (!isConfirmed) return;

    handleDeletePlan();
  };
  return (
    <div
      className="ak-child-modal-overlay"
      role="presentation"
      onMouseDown={resetAndClose}
    >
      <section
        className="ak-child-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ak-child-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="ak-child-modal-header">
          <button
            className="ak-child-back"
            type="button"
            onClick={resetAndClose}
            aria-label="Quay lại"
            disabled={loading}
          >
            <i className="bi bi-chevron-left" />
          </button>

          <div className="ak-child-heading">
            <h2 id="ak-child-modal-title">Chỉnh sửa thông tin kế hoạch</h2>
            <p>
              Thay đổi, cập nhật thông tin mới cho kế hoạch hoặc xóa kế hoạch
            </p>
          </div>

          <button
            className="ak-child-close"
            type="button"
            onClick={resetAndClose}
            aria-label="Đóng"
            disabled={loading}
          >
            <i className="bi bi-x-lg" />
          </button>
        </header>

        <form
          id="ak-add-child-form"
          className="ak-child-form"
          onSubmit={handleSubmit}
        >
          <div className="ak-child-avatar-section">
            <div
              className="ak-child-avatar-info"
              style={{
                width: "100%",
              }}
            >
              <label>
                Chọn kế hoạch
                <strong style={{ color: "red" }}>*</strong>
              </label>
              <select
                className="form-select mb-3"
                onChange={(e) => handleSelectedPlan(e.target.value)}
                disabled={loading}
              >
                <option value="">
                  Danh sách kế hoạch ({plans.length} kế hoạch)
                </option>
                {plans.map((field) => (
                  <option key={field.id} value={field.id}>
                    {field.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="ak-child-section">
            <div className="ak-child-section-title">
              <span>
                <i className="bi bi-person-vcard" />
              </span>

              <div>
                <h3>Thông tin kế hoạch</h3>
                <p>Các thông tin nhận diện cơ bản</p>
              </div>
            </div>

            <div className="ak-child-form-grid">
              <div className="ak-child-field ak-child-field-full">
                <label htmlFor="child-full-name">
                  Kế hoạch tháng
                  <strong>*</strong>
                </label>

                <div
                  className={`ak-child-input ${errors.title ? "error" : ""}`}
                >
                  <i className="bi bi-person" />

                  <input
                    id="child-full-name"
                    type="text"
                    value={form.title}
                    onChange={(event) =>
                      updateField("title", event.target.value)
                    }
                    placeholder="Ví dụ: 07/2026"
                    disabled={loading}
                  />
                </div>

                {errors.title && (
                  <span className="ak-child-error">{errors.title}</span>
                )}
              </div>
              <div className="ak-child-field ak-child-field-full">
                <label htmlFor="child-full-name">
                  Trạng thái kế hoạch
                  <strong>*</strong>
                </label>

                <select
                  className="form-select mb-3"
                  value={form.status}
                  onChange={(e) => updateField("status", e.target.value)}
                  disabled={loading}
                >
                  <option value="pending">Chờ duyệt</option>
                  <option value="approved">Đã duyệt</option>
                </select>
              </div>
            </div>
          </div>
        </form>

        <footer className="ak-child-footer">
          {planEdit && (
            <button
              type="button"
              className="ak-child-cancel"
              onClick={onDeletePlan}
              disabled={loading}
              style={{
                background: "red",
                color: "#fff",
              }}
            >
              Xóa
            </button>
          )}
          <button
            type="button"
            className="ak-child-cancel"
            onClick={resetAndClose}
            disabled={loading}
          >
            Đóng
          </button>

          <button
            type="submit"
            form="ak-add-child-form"
            className="ak-child-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="ak-child-spinner" />
                Đang lưu...
              </>
            ) : (
              <>
                <i className={`bi bi-floppy2}`} />
                Cập nhật
              </>
            )}
          </button>
        </footer>
      </section>
    </div>
  );
}
