import { useState } from "react";
import LoadingDesktop from "./LoadingDesktop";
import LoadingMobile from "./LoadingMobile";
import "./LoadingPage.css";

export default function LoadingPage() {
  const [processing, setProcessing] = useState(false);

  return (
    <main className="ak-loading-page">
      <div className="ak-bg-stars">
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="ak-loading-desktop-wrapper">
        <LoadingDesktop processing={processing} />
      </div>

      <div className="ak-loading-mobile-wrapper">
        <LoadingMobile processing={processing} />
      </div>

      <button
        className="ak-toggle-loading"
        onClick={() => setProcessing((v) => !v)}
      >
        {processing ? "Ẩn loading" : "Hiện loading"}
      </button>
    </main>
  );
}
