import { useEffect, useState } from "react";
import CommentItem from "./CommentItem";
import "./CommentModal.css";
import { useUserStore } from "../../../zustand";
// type CommentStatus = "approved" | "edit" | "pending";
// type CommentItemType = {
//   id: number;
//   avatar: string;
//   name: string;
//   role: string;
//   date: string;
//   status: CommentStatus;
//   content: string;
// };

type CommentModalProps = {
  show: boolean;
  onClose: () => void;
  handleSaveComment: (val: string) => void;
  plan?: any;
  report?: any;
  comments: any[];
  teacherMap: any;
  title: string;
  type: string;
};

export default function CommentModal({
  show = false,
  onClose = () => {},
  handleSaveComment = () => {},
  title = "Danh sách góp ý",
  plan,
  report,
  comments = [],
  teacherMap,
  type = "KH",
}: CommentModalProps) {
  const [isCommenting, setIsCommenting] = useState(false);
  const [content, setContent] = useState("");
  const { user } = useUserStore();
  const isAdmin = user && (user?.role === 'admin' || user?.position === 'Phó Giám đốc') 

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
    <div
      className="ak-comment-modal-overlay"
      role="presentation"
      onMouseDown={onClose}
    >
      <section
        className="ak-comment-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ak-comment-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="ak-comment-modal-header">
          <button
            className="ak-comment-back"
            type="button"
            onClick={onClose}
            aria-label="Quay lại"
          >
            <i className="bi bi-chevron-left" />
          </button>

          <div className="ak-comment-heading">
            <h2 id="ak-comment-modal-title">{title}</h2>
            <p>{safeComments.length} góp ý được ghi nhận</p>
          </div>

          <button
            className="ak-comment-close"
            type="button"
            onClick={onClose}
            aria-label="Đóng"
          >
            <i className="bi bi-x-lg" />
          </button>
        </header>

        <div className="ak-comment-meta">
          {type === "KH" ? (
            <div>
              <span>Kế hoạch:</span>
              <strong>Kế hoạch can thiệp cá nhân tháng {plan?.title}</strong>
            </div>
          ) : (
            <div>
              <span>Báo cáo:</span>
              <strong>Báo cáo can thiệp tháng {report?.title}</strong>
            </div>
          )}
        </div>

        <div className="ak-comment-list">
          {safeComments.length > 0 ? (
            safeComments.map((comment, index) => (
              <CommentItem
                key={index}
                comment={comment}
                teacherMap={teacherMap}
              />
            ))
          ) : (
            <div className="ak-comment-empty">
              <i className="bi bi-chat-square-text" />
              <h3>Chưa có góp ý</h3>
              <p>Khi có góp ý mới, nội dung sẽ hiển thị tại đây.</p>
            </div>
          )}
        </div>

        <footer className="ak-comment-footer">
          {!isCommenting ? (
            <>
            {
              isAdmin && 
              <button
                className="outline-btn blue"
                onClick={() => setIsCommenting(true)}
              >
                <i className="bi bi-chat-square-text" />
                Góp ý
              </button>
            }

              <button className="ak-comment-done" onClick={onClose}>
                Đóng
              </button>
            </>
          ) : (
            <div className="comment-editor">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Nhập góp ý..."
              />

              <div className="comment-editor-action">
                <button
                  className="ak-comment-done"
                  onClick={() => setIsCommenting(false)}
                >
                  Hủy
                </button>

                <button
                  className="ak-comment-done"
                  style={{
                    background: content.trim() === "" ? "#999696" : "#39c777",
                    color: "#fff",
                  }}
                  disabled={content.trim() === ""}
                  onClick={() => {
                    handleSaveComment(content);
                    setContent("");
                  }}
                >
                  Gửi góp ý
                </button>
              </div>
            </div>
          )}
        </footer>
      </section>
    </div>
  );
}
