const statusMap = {
  approved: { label: "Đã duyệt", className: "approved" },
  edit: { label: "Yêu cầu chỉnh sửa", className: "edit" },
  pending: { label: "Đang chờ phản hồi", className: "pending" },
};

export default function CommentItem({ comment }: any) {
  const statusInfo =
  statusMap[comment.status as keyof typeof statusMap] || statusMap.pending;

  return (
    <article className="ak-comment-item">
      <div className="ak-comment-item-top">
        <img
          className="ak-comment-avatar"
          src={comment.avatar || "https://i.pravatar.cc/96?img=47"}
          alt={comment.name || "Người góp ý"}
        />

        <div className="ak-comment-author">
          <div className="ak-comment-name-row">
            <h3>{comment.name}</h3>
            <span className={`comment-status ${statusInfo.className}`}>
  {statusInfo.label}
</span>
          </div>
          <div className="ak-comment-sub-row">
            <span className="ak-comment-role">{comment.role}</span>
            <span className="ak-comment-date">
              <i className="bi bi-clock" />
              {comment.date}
            </span>
          </div>
        </div>
      </div>

      <p className="ak-comment-content">{comment.content}</p>
    </article>
  );
}
