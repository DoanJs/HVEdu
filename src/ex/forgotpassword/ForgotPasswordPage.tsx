import { useState } from "react";
import "./ForgotPasswordPage.css";

const LOGO = "https://dummyimage.com/160x160/ffffff/0077dc.png&text=AN+KHANG";

const steps = [
  { id: 1, label: "Nhập email" },
  { id: 2, label: "Kiểm tra email" },
  { id: 3, label: "Đặt lại mật khẩu" },
];

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("example@email.com");

  return (
    <main className="forgot-page">
      <section className="forgot-shell">
        <button className="forgot-back" aria-label="Quay lại">
          <i className="bi bi-chevron-left" />
        </button>

        <section className="forgot-hero">
          <img className="forgot-logo" src={LOGO} alt="An Khang Education" />
          <h1>
            Quên mật khẩu? <span>🔐</span>
          </h1>
          <p>
            Đừng lo lắng! Nhập email của bạn, chúng tôi sẽ gửi hướng dẫn đặt lại
            mật khẩu.
          </p>

          <div className="hero-icons">
            <span className="icon-bubble mail">
              <i className="bi bi-envelope" />
            </span>
            <span className="hero-star">★</span>
            <span className="icon-bubble send">
              <i className="bi bi-send-fill" />
            </span>
          </div>

          <div className="kids-illustration" aria-hidden="true">
            <div className="cloud cloud-1" />
            <div className="cloud cloud-2" />
            <div className="kid boy">👦</div>
            <div className="book">📘</div>
            <div className="kid girl">👧</div>
          </div>

          <div className="wave-blue" />
          <div className="wave-yellow" />
        </section>

        <section className="forgot-card">
          <StepLine step={step} />

          {step === 1 && (
            <EmailStep
              email={email}
              setEmail={setEmail}
              onNext={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <CheckEmailStep
              email={email}
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
            />
          )}

          {step === 3 && <ResetPasswordStep onSuccess={() => setStep(4)} />}

          {step === 4 && <SuccessStep onHome={() => setStep(1)} />}
        </section>

        <p className="forgot-copy">
          © 2024 An Khang Education. All rights reserved.
        </p>
      </section>
    </main>
  );
}

function StepLine({ step }: any) {
  return (
    <div className="step-line">
      {steps.map((item) => {
        const active = step === item.id;
        const done = step > item.id || step === 4;
        return (
          <div
            className={`step-item ${active ? "active" : ""} ${done ? "done" : ""}`}
            key={item.id}
          >
            <div className="step-dot">
              {done ? <i className="bi bi-check-lg" /> : item.id}
            </div>
            <div className="step-text">{item.label}</div>
          </div>
        );
      })}
    </div>
  );
}

function EmailStep({ email, setEmail, onNext }: any) {
  return (
    <div className="form-state email-state">
      <div className="state-illustration envelope">
        <i className="bi bi-envelope-fill" />
        <span>
          <i className="bi bi-lock-fill" />
        </span>
      </div>
      <h2>Nhập email của bạn</h2>
      <p>Chúng tôi sẽ gửi liên kết đặt lại mật khẩu vào email này.</p>

      <label className="form-label">Email</label>
      <div className="input-wrap">
        <i className="bi bi-envelope" />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Nhập email của bạn"
        />
      </div>

      <button className="primary-btn" onClick={onNext}>
        Gửi hướng dẫn
      </button>
      <button className="link-btn">
        <i className="bi bi-arrow-left" /> Quay lại đăng nhập
      </button>

      <div className="help-box">
        <i className="bi bi-shield" />
        <div>
          <strong>Không nhận được email?</strong>
          <span>Kiểm tra thư mục Spam hoặc thử lại với email khác.</span>
        </div>
      </div>
    </div>
  );
}

function CheckEmailStep({ email, onBack, onNext }: any) {
  return (
    <div className="form-state check-state">
      <div className="state-illustration success-mail">
        <i className="bi bi-envelope-open-fill" />
        <span>
          <i className="bi bi-check-lg" />
        </span>
      </div>
      <h2>Kiểm tra email của bạn</h2>
      <p>Chúng tôi đã gửi liên kết đặt lại mật khẩu đến</p>
      <div className="email-chip">{email}</div>

      <div className="info-box">
        <i className="bi bi-info-circle" />
        <span>
          Liên kết có hiệu lực trong 15 phút. Vui lòng kiểm tra hộp thư đến hoặc
          thư mục Spam.
        </span>
      </div>

      <button className="ghost-btn" onClick={onNext}>
        <i className="bi bi-arrow-clockwise" /> Giả lập đặt lại mật khẩu
      </button>
      <button className="link-btn" onClick={onBack}>
        <i className="bi bi-arrow-left" /> Quay lại nhập email
      </button>
    </div>
  );
}

function ResetPasswordStep({ onSuccess }: any) {
  return (
    <div className="form-state reset-state">
      <h2>Đặt lại mật khẩu mới</h2>
      <p>Vui lòng tạo mật khẩu mới cho tài khoản của bạn.</p>

      <label className="form-label">Mật khẩu mới</label>
      <div className="input-wrap">
        <i className="bi bi-lock" />
        <input type="password" value="12345678" readOnly />
        <i className="bi bi-eye-slash" />
      </div>

      <ul className="rule-list">
        <li>
          <i className="bi bi-check-circle-fill" /> Ít nhất 8 ký tự
        </li>
        <li>
          <i className="bi bi-check-circle-fill" /> Bao gồm chữ hoa, chữ thường
          và số
        </li>
        <li>
          <i className="bi bi-check-circle-fill" /> Không chứa khoảng trắng
        </li>
      </ul>

      <label className="form-label">Xác nhận mật khẩu mới</label>
      <div className="input-wrap">
        <i className="bi bi-lock" />
        <input type="password" value="12345678" readOnly />
        <i className="bi bi-eye-slash" />
      </div>

      <button className="primary-btn" onClick={onSuccess}>
        Đặt lại mật khẩu
      </button>
      <button className="link-btn">
        <i className="bi bi-arrow-left" /> Quay lại đăng nhập
      </button>
    </div>
  );
}

function SuccessStep({ onHome }: any) {
  return (
    <div className="form-state success-state">
      <div className="state-illustration shield-ok">
        <i className="bi bi-shield-fill-check" />
      </div>
      <h2>Đặt lại mật khẩu thành công!</h2>
      <p>
        Mật khẩu của bạn đã được cập nhật thành công. Bạn có thể đăng nhập với
        mật khẩu mới.
      </p>
      <button className="primary-btn" onClick={onHome}>
        Đăng nhập ngay
      </button>
      <button className="link-btn">
        <i className="bi bi-arrow-left" /> Quay lại trang chủ
      </button>
    </div>
  );
}
