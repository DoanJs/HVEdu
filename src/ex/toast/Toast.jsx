import { useEffect, useMemo, useState } from "react";
import "./Toast.css";

const ICONS = {
  success: "bi-check-circle-fill",
  warning: "bi-exclamation-triangle-fill",
  error: "bi-x-circle-fill",
  info: "bi-info-circle-fill",
};

export default function Toast({ toast, onClose }) {
  const duration = toast.duration ?? 3500;
  const [leaving, setLeaving] = useState(false);

  const style = useMemo(
    () => ({ "--toast-duration": `${duration}ms` }),
    [duration]
  );

  useEffect(() => {
    const closeTimer = setTimeout(() => {
      setLeaving(true);
      setTimeout(() => onClose(toast.id), 240);
    }, duration);

    return () => clearTimeout(closeTimer);
  }, [duration, onClose, toast.id]);

  const handleClose = () => {
    setLeaving(true);
    setTimeout(() => onClose(toast.id), 220);
  };

  return (
    <div
      className={`ak-toast ak-toast-${toast.type || "info"} ${leaving ? "ak-toast-leave" : ""}`}
      style={style}
      role="status"
    >
      <div className="ak-toast-icon-wrap">
        <i className={`bi ${ICONS[toast.type] || ICONS.info}`}></i>
      </div>

      <div className="ak-toast-content">
        <div className="ak-toast-title-row">
          <h4>{toast.title}</h4>
          <button type="button" onClick={handleClose} aria-label="Đóng thông báo">
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        {toast.message && <p>{toast.message}</p>}
      </div>

      <div className="ak-toast-progress" />
    </div>
  );
}
