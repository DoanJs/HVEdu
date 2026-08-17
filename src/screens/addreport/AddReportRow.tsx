import { getRandomItem } from "./addReportData";

export default function AddReportRow({ item, targetMap, fieldMap, onChangeTotal, onOpenAiModal }: any) {
  return (
    <div className="add-report-row">
      <div className="field-cell">
        <div className="goal-cell">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span className={`field-dot ${getRandomItem().color}`}>
              <i className={`bi ${getRandomItem().icon}`} />
            </span>
            <strong>{fieldMap[targetMap[item.targetId]?.fieldId].name}</strong>
          </div>
          {targetMap[item.targetId].name}
        </div>
      </div>

      <div className="summary-cell">
        <span>{item.content}</span>
      </div>
      <div className="support-cell">
        <button className={`support-select ${getRandomItem().supportType}`}>
          <span>
            <i />
            {item.intervention}
          </span>
        </button>
      </div>
      <div className="summary-cell">
        <textarea
          rows={4}
          placeholder="Nhập đánh giá kết quả thực hiện mục tiêu..."
          value={item.total || ""}
          onChange={(e) => onChangeTotal(item.id, e.target.value)}
        />
        <button
            type="button"
            className="btn-ai-summary"
            onClick={() => onOpenAiModal(item)}
          >
            <i className="bi bi-stars me-1" />
            Dùng AI
          </button>
      </div>
    </div>
  );
}
