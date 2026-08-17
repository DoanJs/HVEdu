import { getRandomItem } from "./planDetailData";

export default function PlanTaskRow({ item, index, targetMap, fieldMap }: any) {
  return (
    <div className="plan-task-row">
      <div className="plan-col index-col">{index + 1}</div>
      <div className="plan-col target-col">{targetMap[item.targetId]?.name}</div>
      <div className="plan-col field-col">
        <span className={`field-dot ${getRandomItem().fieldClass}`}>
          <i className={`bi ${getRandomItem().fieldIcon}`} />
        </span>
        <strong>{fieldMap[targetMap[item.targetId]?.fieldId]?.name}</strong>
      </div>
      <div className="plan-col support-col">
        <button className={`support-select ${getRandomItem().supportClass}`}>
          <span className="support-light" />
          {item.intervention}
        </button>
      </div>
      <div className="plan-col content-col">
        <div className="content-box">{item.content}</div>
      </div>
    </div>
  );
}