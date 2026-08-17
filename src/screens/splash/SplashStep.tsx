export default function SplashStep({ step, compact = false }: any) {
  return (
    <div className={`splash-step ${step.status} ${compact ? 'compact' : ''}`}>
      <div className={`step-icon ${step.tone}`}>
        <i className={`bi ${step.icon}`} />
      </div>
      <div className="step-text">
        <strong>{step.title}</strong>
        <span>{step.desc}</span>
      </div>
      {compact && (
        <div className={`step-state ${step.status}`}>
          {step.status === 'done' ? <i className="bi bi-check" /> : step.status === 'active' ? <span /> : null}
        </div>
      )}
    </div>
  );
}
