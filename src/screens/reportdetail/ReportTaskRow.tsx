import { getRandomItem } from "./reportDetailData";

export default function ReportTaskRow({
  item,
  index,
  targetMap,
  fieldMap,
  planTaskMap,
  onChangeTotal, isPending
}: any) {
  return (
    <div className="report-task-row">
      <div className="report-col index-col">{index + 1}</div>
      <div className="report-col target-col">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span className={`field-dot ${getRandomItem().fieldClass}`}>
            <i className={`bi ${getRandomItem().fieldIcon}`} />
          </span>
          <strong>{fieldMap[targetMap[item.targetId]?.fieldId]?.name}</strong>
        </div>
        {targetMap[item.targetId]?.name}
      </div>

      <div className="report-col content-col">
        <div className="content-box">
          {planTaskMap[item.planTaskId]?.content}
        </div>
      </div>
      <div className="report-col support-col">
        <button className={`support-select ${getRandomItem().supportClass}`}>
          <span className="support-light" />
          {planTaskMap[item.planTaskId]?.intervention}
        </button>
      </div>
      <div className="report-col summary-cell">
        <textarea
          style={{ fieldSizing: "content" }}
          disabled={!isPending}
          rows={4}
          placeholder="Nhập đánh giá kết quả thực hiện mục tiêu..."
          value={item.content || ""}
          onChange={(e) => onChangeTotal(item.id, e.target.value)}
        />
      </div>
    </div>
  );
}
