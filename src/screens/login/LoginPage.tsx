import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { icon512, loginImg } from "../../constants/info";
import "./LoginPage.css";
import { auth } from "../../firebase.config";
import { Link } from "react-router-dom";
import { handleToastError, handleToastSuccess } from "../../constants/handleToast";

const Logo = () => (
  <div className="ak-login-logo">
    <img src={icon512} alt="login-logo" />
    <div className="ak-login-logo-text">AN KHANG</div>
    <div className="ak-login-logo-sub">EDUCATION</div>
  </div>
);
const LoginForm = ({ loading, onSubmit, form, setForm }: any) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form className="ak-login-card" onSubmit={onSubmit}>
      <h2>Đăng nhập</h2>
      <p>Vui lòng nhập thông tin tài khoản</p>

      <label>Email đã đăng ký</label>
      <div className="ak-input-wrap">
        <i className="bi bi-person"></i>
        <input
          type="text"
          placeholder="Nhập email đã đăng ký"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>

      <label>Mật khẩu</label>
      <div className="ak-input-wrap">
        <i className="bi bi-lock"></i>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Nhập mật khẩu"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button
          type="button"
          className="ak-eye"
          onClick={() => setShowPassword(!showPassword)}
        >
          <i className={showPassword ? "bi bi-eye" : "bi bi-eye-slash"}></i>
        </button>
      </div>

      <div className="ak-login-row">
        <label className="ak-remember">
          <input type="checkbox" defaultChecked />{" "}
          <span>Ghi nhớ đăng nhập</span>
        </label>
        <Link to={"../forgotpassword"}>
          <button type="button" className="ak-link-btn">
            Quên mật khẩu?
          </button>
        </Link>
      </div>

      <button className="ak-primary-btn" type="submit" disabled={loading}>
        {loading ? "Đang xử lý..." : "Đăng nhập"}
      </button>

      {/* <button className="ak-google-btn" type="button">
        <span className="ak-google-g">G</span>
        Đăng nhập với Google
      </button> */}

      <div className="ak-register-text">
        Chưa có tài khoản? <button type="button">Liên hệ Admin</button>
      </div>
    </form>
  );
};

const LoadingOverlay = ({ show }: any) => {
  if (!show) return null;
  return (
    <div className="ak-login-overlay">
      <div className="ak-loading-box">
        <div className="ak-spinner"></div>
        <strong>Đang xử lý...</strong>
        <span>Vui lòng chờ trong giây lát</span>
      </div>
    </div>
  );
};

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    // setTimeout(() => setLoading(false), 2200);
    await signInWithEmailAndPassword(auth, form.email, form.password)
      .then(async (userCredential) => {
        // Signed in
        setLoading(false);
        // const user = userCredential.user;
        // if (remember) {
        //   await localforage.setItem("user", user.email as string);
        // }
        handleToastSuccess(
          `Xin chào cô ${userCredential.user.displayName} đã đăng nhập thành công !`,
        );
      })
      .catch(() => {
        handleToastError("Đăng nhập thất bại, tài khoản không chính xác !");
        setLoading(false);
      });
  };

  return (
    <div className="ak-login-page">
      <div className="ak-bg-star st1">★</div>
      <div className="ak-bg-star st2">★</div>
      <div className="ak-bg-star st3">✦</div>
      <div className="ak-login-shell">
        <section className="ak-login-left">
          <Logo />
          <div className="ak-mobile-top-illus">
            <img src={loginImg} alt="login-bg" />
          </div>
          <div className="ak-welcome">
            <h1>Chào mừng bạn trở lại 👋</h1>
            <p>Đăng nhập để tiếp tục quản lý và đồng hành cùng trẻ mỗi ngày.</p>
          </div>
          <div className="ak-desktop-illus">
            <img src={loginImg} alt="login-bg" />
          </div>
        </section>

        <section className="ak-login-right">
          <LoginForm
            loading={loading}
            onSubmit={handleSubmit}
            form={form}
            setForm={setForm}
          />
        </section>

        <div className="ak-login-footer">
          © 2024 An Khang Education. All rights reserved.
        </div>
      </div>
      <LoadingOverlay show={loading} />
    </div>
  );
}
