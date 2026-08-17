import { useEffect, useMemo, useState } from "react";
import "./DeleteModal.css";

interface DeleteModalProps {
  show?: boolean;
  onClose?: () => void;
  onConfirm?: (data?: any) => void;
  item?: any;
  data?: any;
  type?: "report" | "plan" | "child" | "teacher";
  title?: string;
  description?: string;
  warning?: string;
  requireConfirm?: boolean;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

export default function DeleteModal({
  item,
  show = false,
  onClose = () => {},
  onConfirm = () => {},
  type = "report",
  title,
  description,
  warning = "Hành động này không thể hoàn tác.",
  data = {},
  requireConfirm = true,
  confirmText = "Xoá dữ liệu",
  cancelText = "Hủy bỏ",
  loading = false,
}: DeleteModalProps) {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!show) return;
    setChecked(false);
    const handleKeyDown = (event: any) => {
      if (event.key === "Escape" && !loading) onClose();
    };
    document.body.classList.add("delete-modal-open");
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.classList.remove("delete-modal-open");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [show, onClose, loading]);

  const config = useMemo(() => {
    const map = {
      report: {
        icon: "bi-file-earmark-bar-graph",
        defaultTitle: "Xác nhận xoá báo cáo",
        defaultDescription: "Bạn có chắc chắn muốn xoá báo cáo này không?",
        confirmLabel: "Xoá báo cáo",
        checkLabel: "Tôi hiểu rằng dữ liệu sẽ bị xoá vĩnh viễn",
      },
      plan: {
        icon: "bi-calendar2-x",
        defaultTitle: "Xác nhận xoá kế hoạch",
        defaultDescription: "Bạn có chắc chắn muốn xoá kế hoạch này không?",
        confirmLabel: "Xoá kế hoạch",
        checkLabel: "Tôi hiểu rằng kế hoạch sẽ bị xoá vĩnh viễn",
      },
      child: {
        icon: "bi-person-x",
        defaultTitle: "Xác nhận xoá trẻ",
        defaultDescription: "Bạn có chắc chắn muốn xoá hồ sơ trẻ này không?",
        confirmLabel: "Xoá trẻ",
        checkLabel: "Tôi hiểu rằng toàn bộ dữ liệu liên quan sẽ bị xoá",
      },
      teacher: {
        icon: "bi-people",
        defaultTitle: "Xác nhận xoá giáo viên",
        defaultDescription: "Bạn có chắc chắn muốn xoá giáo viên này không?",
        confirmLabel: "Xoá giáo viên",
        checkLabel: "Tôi hiểu rằng dữ liệu liên quan sẽ bị ảnh hưởng",
      },
    };
    return map[type] || map.report;
  }, [type]);

  if (!show) return null;

  const canConfirm = !requireConfirm || checked;

  const handleOverlayClick = (event: any) => {
    if (event.target === event.currentTarget && !loading) onClose();
  };

  const handleConfirm = () => {
    if (!canConfirm || loading) return;
    onConfirm(data);
  };

  return (
    <div className="delete-modal-overlay" onMouseDown={handleOverlayClick}>
      <section className="delete-modal-shell" role="dialog" aria-modal="true">
        <div className="delete-modal-mobile-handle" />

        <button
          type="button"
          className="delete-modal-close"
          onClick={onClose}
          disabled={loading}
          aria-label="Đóng"
        >
          <i className="bi bi-x-lg" />
        </button>

        <div className="delete-modal-icon-wrap">
          <div className="delete-modal-icon">
            <i className={`bi ${config.icon}`} />
          </div>
        </div>

        <div className="delete-modal-header">
          <h3>{title || config.defaultTitle}</h3>
          <p>{description || config.defaultDescription}</p>
          <strong>{warning}</strong>
        </div>

        <div className="delete-modal-info-card">
          <div className="delete-modal-file-icon">
            <i className={`bi ${config.icon}`} />
          </div>

          <div className="delete-modal-info-content">
            <h4>{data.name || data.title || "Kế hoạch can thiệp cá nhân - 01/05/2024"}</h4>

            <div className="delete-modal-meta-grid">
              {data.childName && (
                <p>
                  <span>Trẻ:</span>
                  {data.childName}
                </p>
              )}
              {data.teacherName && (
                <p>
                  <span>Giáo viên:</span>
                  {data.teacherName}
                </p>
              )}
              {data.date && (
                <p>
                  <span>Ngày tạo:</span>
                  {data.date}
                </p>
              )}
              {data.group && (
                <p>
                  <span>Nhóm:</span>
                  {data.group}
                </p>
              )}
              {data.status && (
                <p>
                  <span>Trạng thái:</span>
                  <b className="delete-modal-status">{data.status}</b>
                </p>
              )}
            </div>
          </div>
        </div>

        {requireConfirm && (
          <label className="delete-modal-check">
            <input
              type="checkbox"
              checked={checked}
              onChange={(event) => setChecked(event.target.checked)}
              disabled={loading}
            />
            <span className="delete-modal-check-box">
              <i className="bi bi-check-lg" />
            </span>
            <span>{config.checkLabel}</span>
          </label>
        )}

        <div className="delete-modal-actions">
          <button
            type="button"
            className="delete-modal-btn delete-modal-cancel"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </button>

          <button
            type="button"
            className="delete-modal-btn delete-modal-danger"
            onClick={handleConfirm}
            disabled={!canConfirm || loading}
          >
            {loading ? (
              <>
                <span className="delete-modal-spinner" />
                Đang xoá...
              </>
            ) : (
              <>
                <i className="bi bi-trash3" />
                {confirmText || config.confirmLabel}
              </>
            )}
          </button>
        </div>
      </section>
    </div>
  );
}
