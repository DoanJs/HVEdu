import { serverTimestamp } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { updateDocData } from "../../../constants/firebase/updateDocData";
import {
  handleToastError,
  handleToastSuccess,
} from "../../../constants/handleToast";
import { functions } from "../../../firebase.config";
import { ReportModel } from "../../../models";
import { useLoadingOverLayStore, useReportStore } from "../../../zustand";
import "./AddReportModal.css";

export type NewReportForm = {
  title: string;
  status: string;
};

type AddReportModalProps = {
  show: boolean;
  onClose: () => void;
  loading?: boolean;
};

const initialForm: NewReportForm = {
  title: "",
  status: "",
};

export default function AddReportModal({
  show,
  onClose,
  loading = false,
}: AddReportModalProps) {
  const [form, setForm] = useState<NewReportForm>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const { setLoadingOverLay } = useLoadingOverLayStore();
  const [reportEdit, setReportEdit] = useState<ReportModel>();
  const { reports, editReport, removeReport } = useReportStore();

  const errors = useMemo(() => {
    return {
      title:
        submitted && !form.title.trim() ? "Vui lòng nhập tháng báo cáo." : "",
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
    if (reportEdit) {
      setForm({
        title: reportEdit.title || "",
        status: reportEdit.status || "pending",
      });
    }
  }, [reportEdit]);

  if (!show) return null;

  const updateField = <K extends keyof NewReportForm>(
    field: K,
    value: NewReportForm[K],
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
    setReportEdit(undefined);
  };
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);

    if (!isValid || loading) return;

    setLoadingOverLay(true);

    if (reportEdit) {
      updateDocData({
        nameCollect: "reports",
        id: reportEdit.id,
        valueUpdate: {
          ...form,
          updateAt: serverTimestamp(),
        },
        metaDoc: "reports",
      })
        .then((result) => {
          // cập nhật UI ngay
          editReport(reportEdit.id, { ...form });

          setLoadingOverLay(false);
          setReportEdit(undefined);
          handleToastSuccess(
            `Chỉnh sửa báo cáo thành công ! (${reportEdit.id}) `,
          );
        })
        .catch((error) => {
          setLoadingOverLay(false);
          handleToastError("Chỉnh sửa báo cáo thất bại !");
        });
    }

    resetData();
  };

  const handleSelectedPlan = (id: string) => {
    if (id.trim() === "") {
      resetData();
      return;
    }
    const report = reports.find((_) => _.id === id);
    setReportEdit(report);
  };
  const handleDeletePlan = async () => {
    if (!reportEdit) return;
    setLoadingOverLay(true);
    try {
      const deleteReportCF = httpsCallable<
        { reportId: string },
        {
          success: boolean;
          deleted: {
            reports: number;
            reportTasks: number;
          };
          deletedCount: number;
        }
      >(functions, "deleteReport");

      const res = await deleteReportCF({
        reportId: reportEdit.id,
      });

      removeReport(reportEdit.id);

      handleToastSuccess(
        `Xóa báo cáo thành công! Đã xóa ${res.data.deletedCount} mục liên quan.`,
      );
    } catch (err: any) {
      console.error(err);

      if (err.code === "functions/permission-denied") {
        handleToastError("Bạn không có quyền xoá báo cáo");
      } else if (err.code === "functions/not-found") {
        handleToastError("Không tìm thấy báo cáo");
      } else if (err.code === "functions/failed-precondition") {
        handleToastError("Chỉ được xoá báo cáo đang pending");
      } else if (err.code === "functions/unauthenticated") {
        handleToastError("Bạn cần đăng nhập lại");
      } else {
        handleToastError("Xóa báo cáo thất bại");
      }
    } finally {
      setLoadingOverLay(false);
      resetData();
    }
  };
  const onDeleteReport = () => {
    const isConfirmed = window.confirm(
      "Bạn có chắc chắn muốn xóa báo cáo này?\n\nDữ liệu sau khi xóa sẽ không thể khôi phục.",
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
            <h2 id="ak-child-modal-title">Chỉnh sửa thông tin báo cáo</h2>
            <p>Thay đổi, cập nhật thông tin mới cho báo cáo hoặc xóa báo cáo</p>
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
                Chọn báo cáo
                <strong style={{ color: "red" }}>*</strong>
              </label>
              <select
                className="form-select mb-3"
                onChange={(e) => handleSelectedPlan(e.target.value)}
                disabled={loading}
              >
                <option value="">
                  Danh sách báo cáo ({reports.length} báo cáo)
                </option>
                {reports.map((field) => (
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
                <h3>Thông tin báo cáo</h3>
                <p>Các thông tin nhận diện cơ bản</p>
              </div>
            </div>

            <div className="ak-child-form-grid">
              <div className="ak-child-field ak-child-field-full">
                <label htmlFor="child-full-name">
                  Báo cáo tháng
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
                  Trạng thái báo cáo
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
          {reportEdit && (
            <button
              type="button"
              className="ak-child-cancel"
              onClick={onDeleteReport}
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
                <i className={`bi bi-floppy2`} />
                Cập nhật
              </>
            )}
          </button>
        </footer>
      </section>
    </div>
  );
}
