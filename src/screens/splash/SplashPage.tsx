// import { icon512, splash } from "../../constants/info";
// import "./SplashPage.css";
// import SplashStep from "./SplashStep";
// import { loadingSteps } from "./splashData";

// export default function SplashPage() {
//   return (
//     <main className="ak-splash-page">
//       <section className="splash-hero">
//         <div className="soft-star st-1">★</div>
//         <div className="soft-star st-2">★</div>
//         <div className="soft-star st-3">★</div>

//         <div className="splash-logo">
//           {/* <div className="logo-circle"><i className="bi bi-stars" /></div> */}
//           <img src={icon512} alt="splash-img" />
//           <h1>AN KHANG</h1>
//           <span>EDUCATION</span>
//         </div>

//         <div className="loading-title">
//           <h2>Đang tải dữ liệu...</h2>
//           <p>Vui lòng chờ trong giây lát</p>
//         </div>

//         <div className="desktop-steps">
//           {loadingSteps.map((step) => (
//             <SplashStep key={step.id} step={step} />
//           ))}
//         </div>

//         <div className="mobile-steps">
//           {loadingSteps.map((step) => (
//             <SplashStep key={step.id} step={step} compact />
//           ))}
//         </div>

//         <div className="progress-wrap">
//           <div className="progress-track">
//             <div className="progress-fill" />
//           </div>
//           <strong>65%</strong>
//         </div>

//         <div className="notify-card">
//           <div className="notify-icon">
//             <i className="bi bi-bell" />
//           </div>
//           <div>
//             <strong>Đang kết nối với dịch vụ thông báo (FCM)</strong>
//             <p>Để đảm bảo bạn không bỏ lỡ thông tin quan trọng</p>
//           </div>
//           <div className="signal-dots">
//             <span />
//             <span />
//             <i className="bi bi-wifi" />
//           </div>
//         </div>

//         <div className="cloud-illus">
//           <img src={splash} alt="splash-img" />
//         </div>

//         <div className="tip-card">
//           <i className="bi bi-lightbulb" />
//           <div>
//             <strong>Mẹo nhỏ</strong>
//             <p>
//               Hãy bật thông báo để nhận cập nhật kế hoạch và báo cáo của trẻ kịp
//               thời!
//             </p>
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }
import "./SplashPage.css";
import SplashStep from "./SplashStep";
import { loadingSteps } from "./splashData";
import { icon512, splash } from "../../constants/info";

type SplashPageProps = {
  progress: number;
};

export default function SplashPage({ progress }: SplashPageProps) {
  return (
    <main className="ak-splash-page">
      <section className="splash-hero">
        <div className="soft-star st-1">★</div>
        <div className="soft-star st-2">★</div>
        <div className="soft-star st-3">★</div>

        <div className="splash-logo">
          <img src={icon512} alt="logo" />
          <h1>HY VỌNG</h1>
          <span>EDUCATION</span>
        </div>

        <div className="loading-title">
          <h2>Đang tải dữ liệu...</h2>
          <p>Vui lòng chờ trong giây lát</p>
        </div>

        <div className="desktop-steps">
          {loadingSteps.map((step) => (
            <SplashStep key={step.id} step={step} progress={progress} />
          ))}
        </div>

        <div className="mobile-steps">
          {loadingSteps.map((step) => (
            <SplashStep
              key={step.id}
              step={step}
              progress={progress}
              compact
            />
          ))}
        </div>

        <div className="progress-wrap">
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <strong>{progress}%</strong>
        </div>

        <div className="notify-card">
          <div className="notify-icon">
            <i className="bi bi-bell" />
          </div>

          <div>
            <strong>Đang kết nối với dịch vụ thông báo (FCM)</strong>
            <p>Để đảm bảo bạn không bỏ lỡ thông tin quan trọng</p>
          </div>

          <div className="signal-dots">
            <span />
            <span />
            <i className="bi bi-wifi" />
          </div>
        </div>

        <div className="cloud-illus">
          <img src={splash} alt="splash" />
        </div>

        <div className="tip-card">
          <i className="bi bi-lightbulb" />
          <div>
            <strong>Mẹo nhỏ</strong>
            <p>
              Hãy bật thông báo để nhận cập nhật kế hoạch và báo cáo của trẻ
              kịp thời!
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}