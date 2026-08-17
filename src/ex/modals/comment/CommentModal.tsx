import { useEffect } from "react";
import CommentItem from "./CommentItem";
import "./CommentModal.css";
type CommentStatus = "approved" | "edit" | "pending";
type CommentItemType = {
  id: number;
  avatar: string;
  name: string;
  role: string;
  date: string;
  status: CommentStatus;
  content: string;
};

type CommentModalProps = {
  show: boolean;
  onClose: () => void;
  plan?: string;
  report?: string;
  comments: CommentItemType[];
  title: string
};

export default function CommentModal({
  show = false,
  onClose = () => {},
  title = "Danh sách góp ý",
  plan = "",
  report = "",
  comments = [],
}: CommentModalProps) {
  useEffect(() => {
    if (!show) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: any) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [show, onClose]);

  if (!show) return null;

  const safeComments = Array.isArray(comments) ? comments : [];

  return (
    <div className="ak-comment-modal-overlay" role="presentation" onMouseDown={onClose}>
      <section
        className="ak-comment-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ak-comment-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="ak-comment-modal-header">
          <button className="ak-comment-back" type="button" onClick={onClose} aria-label="Quay lại">
            <i className="bi bi-chevron-left" />
          </button>

          <div className="ak-comment-heading">
            <h2 id="ak-comment-modal-title">{title}</h2>
            <p>{safeComments.length} góp ý được ghi nhận</p>
          </div>

          <button className="ak-comment-close" type="button" onClick={onClose} aria-label="Đóng">
            <i className="bi bi-x-lg" />
          </button>
        </header>

        <div className="ak-comment-meta">
          <div>
            <span>Kế hoạch:</span>
            <strong>{plan || "Kế hoạch can thiệp cá nhân - 01/05/2024"}</strong>
          </div>
          <div>
            <span>Báo cáo:</span>
            <strong>{report || "Báo cáo can thiệp ngày 07/05/2024"}</strong>
          </div>
        </div>

        <div className="ak-comment-list">
          {safeComments.length > 0 ? (
            safeComments.map((comment) => <CommentItem key={comment.id} comment={comment} />)
          ) : (
            <div className="ak-comment-empty">
              <i className="bi bi-chat-square-text" />
              <h3>Chưa có góp ý</h3>
              <p>Khi có góp ý mới, nội dung sẽ hiển thị tại đây.</p>
            </div>
          )}
        </div>

        <footer className="ak-comment-footer">
          <button className="ak-comment-done" type="button" onClick={onClose}>Đóng</button>
        </footer>
      </section>
    </div>
  );
}
