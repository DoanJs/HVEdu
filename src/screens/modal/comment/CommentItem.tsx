import moment from "moment";
import { handleTimeStampFirestore } from "../../../constants/convertTimeStamp";

// const statusMap = {
//   approved: { label: "Đã duyệt", className: "approved" },
//   edit: { label: "Yêu cầu chỉnh sửa", className: "edit" },
//   pending: { label: "Đang chờ phản hồi", className: "pending" },
// };

export default function CommentItem({ comment, teacherMap }: any) {
  // const statusInfo =
  //   statusMap[comment.status as keyof typeof statusMap] || statusMap.pending;

  return (
    <article className="ak-comment-item">
      <div className="ak-comment-item-top">
        <img
          className="ak-comment-avatar"
          src={
            teacherMap[comment.authorId]?.avatar ||
            "https://cdnphoto.dantri.com.vn/hjLMhfzUwBM2mJdGV1QysRM2sNs=/thumb_w/960/2021/04/05/te-giac-1617586363417.jpg"
          }
          alt={comment.name || "Người góp ý"}
        />

        <div className="ak-comment-author">
          <div className="ak-comment-name-row">
            <h3>{teacherMap[comment.authorId]?.fullName}</h3>
            <span className={`comment-status`}>
              {teacherMap[comment.authorId]?.position}
            </span>
          </div>
          <div className="ak-comment-sub-row">
            {/* <span className="ak-comment-role">{comment.role}</span> */}
            <span className="ak-comment-date">
              <i className="bi bi-clock" />
              {typeof comment?.createAt === "number"
                ? moment(comment?.createAt).format("HH:mm:ss DD/MM/YYYY")
                : moment(handleTimeStampFirestore(comment?.createAt)).format(
                    "HH:mm:ss DD/MM/YYYY",
                  )}
            </span>
          </div>
        </div>
      </div>

      <p className="ak-comment-content">{comment.content}</p>
    </article>
  );
}
