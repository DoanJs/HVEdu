import { useState } from "react";
import CommentModal from "./CommentModal";
import { commentData } from "./commentData";

export default function ExampleUsage() {
  const [showComment, setShowComment] = useState(false);

  return (
    <>
      <button className="btn btn-outline-primary" onClick={() => setShowComment(true)}>
        <i className="bi bi-chat-left-text me-2" />
        Danh sách góp ý
      </button>

      <CommentModal
        show={showComment}
        onClose={() => setShowComment(false)}
        comments={commentData}
        plan="Kế hoạch can thiệp cá nhân - 01/05/2024"
        report="Báo cáo can thiệp ngày 07/05/2024"
      />
    </>
  );
}
