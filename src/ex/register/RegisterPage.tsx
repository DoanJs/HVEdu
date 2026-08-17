import { httpsCallable } from "firebase/functions";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  handleToastError,
  handleToastSuccess,
} from "../../constants/handleToast";
import { icon512, loginImg } from "../../constants/info";
import { validateEmail } from "../../constants/validateEmailPhone";
import { functions } from "../../firebase.config";
import { useLoadingOverLayStore } from "../../zustand";
import "./RegisterPage.css";

const Logo = () => (
  <Link
    to="/"
    className="ak-register-logo"
    style={{
      textDecoration: "none",
      display: "flex",
      justifyContent: "center",
      flexDirection: "column",
    }}
  >
    <img src={icon512} alt="register-logo" />
    <div className="ak-register-logo-text">AN KHANG</div>
    <div className="ak-register-logo-sub">EDUCATION</div>
  </Link>
);

const PasswordRule = ({ children }: any) => (
  <div className="ak-rule-item">
    <span>
      <i className="bi bi-check-lg"></i>
    </span>
    {children}
  </div>
);

const RegisterForm = ({ loading, onSubmit }: any) => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { setLoadingOverLay } = useLoadingOverLayStore();
const [checkRule, setCheckRule] = useState(true);

  const errors = useMemo(() => {
    return {
      fullName: submitted && !fullName.trim() ? "Vui lòng nhập họ và tên." : "",
      email: submitted && !email ? "Vui lòng nhập email." : "",
      validateEmail:
        email && !validateEmail(email) ? "Email không đúng định dạng." : "",
      password: submitted && !password ? "Vui lòng nhập mật khẩu." : "",
      lengthPassword:
        password && password.length < 6 ? "Mật khẩu phải 6 ký tự trở lên." : "",
      checkPassword:
        password && password.trim() !== confirmPassword.trim()
          ? "Mật khẩu không trùng khớp với mật khẩu xác nhận."
          : "",
      confirmPassword:
        submitted && !confirmPassword ? "Vui lòng nhập lại mật khẩu." : "",
      checkConfirmPassword:
        confirmPassword && confirmPassword.trim() !== password.trim()
          ? "Xác nhận mật khẩu không khớp với mật khẩu"
          : "",
      checkRule:
        !checkRule
          ? "Bạn chưa đồng ý với 'Điều khoản sử dụng và Chính sách bảo mật'"
          : "",
    };
  }, [fullName, password, email, confirmPassword, submitted]);

  const isValid =
    fullName.trim() !== "" &&
    email.trim() &&
    password.trim() !== "" &&
    confirmPassword.trim() !== "" &&
    checkRule

  const handleRegister = async (e: any) => {
    e.preventDefault();

    setSubmitted(true);
    if (!isValid || loading) return;


    setLoadingOverLay(true);

    try {
      const createStaffAccount = httpsCallable(functions, "createStaffAccount");

      await createStaffAccount({
        email: email.trim(),
        password: password,
        fullName: fullName.trim(),
        phone: "",
        role: "teacher",
        position: "Chuyên viên Tâm lý",
      });

      handleToastSuccess("Đăng ký tài khoản thành công!");

      navigate("/");
    } catch (error: any) {
      console.error(error);

      const code = error.code;

      if (code === "functions/already-exists") {
        handleToastError("Email này đã được sử dụng");
      } else if (code === "functions/invalid-argument") {
        handleToastError(error.message || "Thông tin không hợp lệ");
      } else if (code === "functions/permission-denied") {
        handleToastError("Bạn không có quyền tạo tài khoản");
      } else if (code === "functions/unauthenticated") {
        handleToastError("Bạn chưa đăng nhập");
      } else {
        handleToastError("Đăng ký thất bại, vui lòng thử lại");
      }
    } finally {
      setLoadingOverLay(false);
    }
  };

  return (
    <form className="ak-register-card" onSubmit={onSubmit}>
      <h2>Đăng ký</h2>
      <p>Tạo tài khoản mới để bắt đầu</p>

      <label>Họ và tên</label>
      <div className="ak-input-wrap">
        <i className="bi bi-person"></i>
        <input
          type="text"
          placeholder="Nhập họ và tên"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>
      {errors.fullName && (
        <span className="ak-child-error">{errors.fullName}</span>
      )}

      <label>Email</label>
      <div className="ak-input-wrap">
        <i className="bi bi-envelope"></i>
        <input
          type="text"
          placeholder="Nhập email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      {errors.email && <span className="ak-child-error">{errors.email}</span>}
      {errors.validateEmail && (
        <span className="ak-child-error">{errors.validateEmail}</span>
      )}

      <label>Mật khẩu</label>
      <div className="ak-input-wrap">
        <i className="bi bi-lock"></i>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Nhập mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="button"
          className="ak-eye"
          onClick={() => setShowPassword(!showPassword)}
        >
          <i className={showPassword ? "bi bi-eye" : "bi bi-eye-slash"}></i>
        </button>
      </div>
      {errors.password && (
        <span className="ak-child-error">{errors.password}</span>
      )}
      {errors.lengthPassword && (
        <span className="ak-child-error">{errors.lengthPassword}</span>
      )}
      {errors.checkPassword && (
        <span className="ak-child-error">{errors.checkPassword}</span>
      )}

      <label>Xác nhận mật khẩu</label>
      <div className="ak-input-wrap">
        <i className="bi bi-lock"></i>
        <input
          type={showConfirm ? "text" : "password"}
          placeholder="Nhập lại mật khẩu"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button
          type="button"
          className="ak-eye"
          onClick={() => setShowConfirm(!showConfirm)}
        >
          <i className={showConfirm ? "bi bi-eye" : "bi bi-eye-slash"}></i>
        </button>
      </div>
      {errors.confirmPassword && (
        <span className="ak-child-error">{errors.confirmPassword}</span>
      )}
      {errors.checkConfirmPassword && (
        <span className="ak-child-error">{errors.checkConfirmPassword}</span>
      )}

      <div className="ak-rules">
        <div className="ak-rules-title">Mật khẩu phải có ít nhất:</div>
        <PasswordRule>8 ký tự trở lên</PasswordRule>
        <PasswordRule>Bao gồm chữ hoa, chữ thường và số</PasswordRule>
        <PasswordRule>Ít nhất 1 ký tự đặc biệt</PasswordRule>
      </div>

      <label className="ak-agree">
        <input type="checkbox" checked={checkRule} onChange={() => setCheckRule(!checkRule)} />
        <span>
          Tôi đồng ý với <button type="button">Điều khoản sử dụng</button>
          <br className="ak-desktop-break" /> và{" "}
          <button type="button">Chính sách bảo mật</button>
        </span>
      </label>
      {errors.checkRule && (
        <span className="ak-child-error">{errors.checkRule}</span>
      )}

      <button
        className="ak-primary-btn"
        type="submit"
        disabled={loading}
        onClick={handleRegister}
      >
        {loading ? "Đang xử lý..." : "Đăng ký"}
      </button>

      <div className="ak-login-text">
        Đã có tài khoản? <Link to={"../login"} style={{textDecoration: 'none'}} type="button">Đăng nhập ngay</Link>
      </div>
    </form>
  );
};

const LoadingOverlay = ({ show }: any) => {
  if (!show) return null;
  return (
    <div className="ak-register-overlay">
      <div className="ak-loading-box">
        <div className="ak-spinner"></div>
        <strong>Đang xử lý...</strong>
        <span>Vui lòng chờ trong giây lát</span>
      </div>
    </div>
  );
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  return (
    <div className="ak-register-page">
      <div className="ak-back-mobile">
        <i className="bi bi-chevron-left" onClick={() => navigate(-1)}></i>
      </div>
      <div className="ak-bg-star st1">★</div>
      <div className="ak-bg-star st2">★</div>
      <div className="ak-bg-star st3">✦</div>

      <div className="ak-register-shell">
        <section className="ak-register-left">
          <Logo />
          <div className="ak-mobile-top-illus">
            <img src={loginImg} alt="login-bg" />
          </div>

          <div className="ak-welcome">
            <h1>
              Chào mừng bạn đến với <br />
              An Khang Education
            </h1>
            <p>
              Tạo tài khoản để tiếp tục quản lý và đồng hành cùng trẻ mỗi ngày.
            </p>
          </div>

          <div className="ak-desktop-illus">
            <img src={loginImg} alt="login-bg" />
          </div>
        </section>

        <section className="ak-register-right">
          <RegisterForm loading={loading} />
        </section>

        <div className="ak-register-footer">
          © 2026 An Khang Education. All rights reserved.
        </div>
      </div>

      <LoadingOverlay show={loading} />
    </div>
  );
}
