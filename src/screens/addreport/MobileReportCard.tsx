import React from "react";
import { getRandomItem } from "./addReportData";

export default function MobileReportCard({
  item,
  index,
  targetMap,
  fieldMap,
  onChangeTotal,
  onOpenAiModal,
}: any) {
  return (
    <article className="mobile-report-card">
      <div className="mobile-card-head">
        <div className="field-cell">
          <span className={`field-dot ${getRandomItem().color}`}>
            <i className={`bi ${getRandomItem().icon}`} />
          </span>
          <strong>{fieldMap[targetMap[item.targetId]?.fieldId].name}</strong>
        </div>
        <b>{index + 1}</b>
      </div>
      <label>Mục tiêu</label>
      <p>{targetMap[item.targetId].name}</p>
      <label>Chiến lược</label>
      <span>{item.content}</span>
      <label>Mức độ hỗ trợ</label>
      <button className={`support-select ${getRandomItem().supportType}`}>
        <span>
          <i />
          {item.intervention}
        </span>
      </button>
      <label>Tổng kết</label>
      <div style={{position: "relative"}}>
        <textarea
          rows={6}
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
    </article>
  );
}
