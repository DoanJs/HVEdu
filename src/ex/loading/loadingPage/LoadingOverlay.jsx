export default function LoadingOverlay({
  show = true,
  title = "Đang xử lý...",
  desc = "Vui lòng chờ trong giây lát",
}) {
  if (!show) return null;

  return (
    <div className="ak-processing-overlay" role="status" aria-live="polite">
      <div className="ak-processing-box">
        <div className="ak-processing-spinner" />
        <h3>{title}</h3>
        <p>{desc}</p>
      </div>
    </div>
  );
}
