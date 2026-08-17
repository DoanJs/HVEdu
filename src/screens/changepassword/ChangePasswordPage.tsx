import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { useMemo, useState } from "react";
import {
  handleToastError,
  handleToastSuccess,
} from "../../constants/handleToast";
import { auth } from "../../firebase.config";
import { useLoadingOverLayStore, useUserStore } from "../../zustand";
import "./ChangePasswordPage.css";
import { icon512 } from "../../constants/info";

const securityNotes = [
  {
    icon: "bi-key",
    title: "Không dùng lại mật khẩu cũ",
    desc: "Nên tạo mật khẩu riêng cho tài khoản trung tâm để bảo vệ dữ liệu trẻ.",
  },
  {
    icon: "bi-shield-check",
    title: "Ưu tiên mật khẩu mạnh",
    desc: "Kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt để tăng độ an toàn.",
  },
  {
    icon: "bi-eye-slash",
    title: "Không chia sẻ tài khoản",
    desc: "Mỗi cô giáo nên dùng tài khoản cá nhân để hệ thống ghi nhận đúng lịch sử hoạt động.",
  },
];

export default function ChangePasswordPage() {
  const { user } = useUserStore();
  const [showPassword, setShowPassword] = useState({
    current: false,
    next: false,
    confirm: false,
  });
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [saved, setSaved] = useState(false);

  const passwordRules = useMemo(() => {
    const value = form.newPassword;
    return [
      { label: "Tối thiểu 8 ký tự", valid: value.length >= 8 },
      {
        label: "Có chữ hoa và chữ thường",
        valid: /[A-Z]/.test(value) && /[a-z]/.test(value),
      },
      { label: "Có ít nhất 1 số", valid: /\d/.test(value) },
      { label: "Có ký tự đặc biệt", valid: /[^A-Za-z0-9]/.test(value) },
    ];
  }, [form.newPassword]);

  const strength = useMemo(() => {
    const passed = passwordRules.filter((rule) => rule.valid).length;
    if (!form.newPassword)
      return {
        label: "Chưa nhập mật khẩu mới",
        className: "empty",
        percent: 0,
      };
    if (passed <= 1)
      return { label: "Mật khẩu yếu", className: "weak", percent: 28 };
    if (passed <= 3)
      return { label: "Mật khẩu khá", className: "medium", percent: 68 };
    return { label: "Mật khẩu mạnh", className: "strong", percent: 100 };
  }, [form.newPassword, passwordRules]);

  const passwordsMatch =
    form.confirmPassword && form.newPassword === form.confirmPassword;
  const canSubmit =
    form.currentPassword &&
    form.newPassword &&
    form.confirmPassword &&
    passwordsMatch &&
    passwordRules.every((rule) => rule.valid);

  // const handleChange = (field, value) => {
  //   setSaved(false);
  //   setForm((prev) => ({ ...prev, [field]: value }));
  // };

  const togglePassword = (field: keyof typeof showPassword) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   if (!canSubmit) return;
  //   setSaved(true);
  //   setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  // };

  // ----------------

  const { setLoadingOverLay } = useLoadingOverLayStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp");
      return;
    }

    // const auth = getAuth();
    const user = auth.currentUser;

    if (!user || !user.email) {
      alert("Không tìm thấy người dùng");
      return;
    }

    setLoadingOverLay(true);

    try {
      // 1. Tạo credential từ mật khẩu hiện tại
      const credential = EmailAuthProvider.credential(
        user.email,
        form.currentPassword,
      );

      // 2. Re-authenticate
      await reauthenticateWithCredential(user, credential);

      // 3. Update password
      await updatePassword(user, form.newPassword);

      handleToastSuccess("Đổi mật khẩu thành công!");
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      console.error(error);

      if (error.code === "auth/wrong-password") {
        handleToastError("Mật khẩu hiện tại không đúng");
      } else if (error.code === "auth/weak-password") {
        handleToastError("Mật khẩu mới quá yếu");
      } else {
        handleToastError("Có lỗi xảy ra, thử lại sau");
      }
    } finally {
      setLoadingOverLay(false);
    }
  };

  return (
    <>
      <section className="password-hero-card">
        <div className="password-hero-icon">
          <i className="bi bi-shield-lock-fill" />
        </div>
        <div>
          <span>Bảo mật tài khoản</span>
          <h2>Thay đổi mật khẩu đăng nhập</h2>
          <p>
            Mật khẩu mới nên dễ nhớ với cô giáo nhưng khó đoán với người khác.
            Sau khi đổi mật khẩu, hãy đăng nhập lại trên các thiết bị cần sử
            dụng.
          </p>
        </div>
      </section>

      <section className="change-password-grid">
        <form className="change-password-card" onSubmit={handleSubmit}>
          <div className="card-title-row">
            <div>
              <span>Cập nhật bảo mật</span>
              <h3>Thông tin mật khẩu</h3>
            </div>
            <span className={`password-status ${strength.className}`}>
              {strength.label}
            </span>
          </div>

          {saved && (
            <div className="success-alert">
              <i className="bi bi-check-circle-fill" />
              Mật khẩu đã được cập nhật thành công.
            </div>
          )}

          <label className="password-form-group">
            <span>Mật khẩu hiện tại</span>
            <div className="password-input-wrap">
              <input
                type={showPassword.current ? "text" : "password"}
                value={form.currentPassword}
                name="currentPassword"
                onChange={(e) => handleChange(e)}
                placeholder="Nhập mật khẩu hiện tại"
              />
              <button type="button" onClick={() => togglePassword("current")}>
                <i
                  className={`bi ${showPassword.current ? "bi-eye-slash" : "bi-eye"}`}
                />
              </button>
            </div>
          </label>

          <label className="password-form-group">
            <span>Mật khẩu mới</span>
            <div className="password-input-wrap">
              <input
                type={showPassword.next ? "text" : "password"}
                value={form.newPassword}
                name="newPassword"
                onChange={(e) => handleChange(e)}
                placeholder="Nhập mật khẩu mới"
              />
              <button type="button" onClick={() => togglePassword("next")}>
                <i
                  className={`bi ${showPassword.next ? "bi-eye-slash" : "bi-eye"}`}
                />
              </button>
            </div>
          </label>

          <div className="password-strength-box">
            <div className="strength-head">
              <span>Độ mạnh mật khẩu</span>
              <strong>{strength.label}</strong>
            </div>
            <div className="strength-track">
              <div
                className={`strength-fill ${strength.className}`}
                style={{ width: `${strength.percent}%` }}
              />
            </div>
            <div className="password-rule-list">
              {passwordRules.map((rule) => (
                <div className={rule.valid ? "valid" : ""} key={rule.label}>
                  <i
                    className={`bi ${rule.valid ? "bi-check-circle-fill" : "bi-circle"}`}
                  />
                  <span>{rule.label}</span>
                </div>
              ))}
            </div>
          </div>

          <label className="password-form-group">
            <span>Xác nhận mật khẩu mới</span>
            <div className="password-input-wrap">
              <input
                type={showPassword.confirm ? "text" : "password"}
                value={form.confirmPassword}
                name="confirmPassword"
                onChange={(e) => handleChange(e)}
                placeholder="Nhập lại mật khẩu mới"
              />
              <button type="button" onClick={() => togglePassword("confirm")}>
                <i
                  className={`bi ${showPassword.confirm ? "bi-eye-slash" : "bi-eye"}`}
                />
              </button>
            </div>
            {form.confirmPassword && !passwordsMatch && (
              <small className="error-text">
                Mật khẩu xác nhận chưa trùng khớp.
              </small>
            )}
            {passwordsMatch && (
              <small className="match-text">
                Mật khẩu xác nhận đã trùng khớp.
              </small>
            )}
          </label>

          <div className="password-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setForm({
                  currentPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                });
                setSaved(false);
              }}
            >
              Hủy
            </button>
            <button type="submit" className="save-btn" disabled={!canSubmit}>
              <i className="bi bi-check2-circle" />
              Lưu mật khẩu mới
            </button>
          </div>
        </form>

        <aside className="security-panel">
          <div className="security-profile-card">
            <img src={user?.avatar || icon512} alt={"teacher-avatar"} />
            <div>
              <span>Tài khoản đang đổi mật khẩu</span>
              <h3>{user?.fullName}</h3>
              <p>{user?.email}</p>
            </div>
          </div>

          <div className="security-note-list">
            {securityNotes.map((item) => (
              <article className="security-note-card" key={item.title}>
                <i className={`bi ${item.icon}`} />
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </aside>
      </section>
    </>
  );
}
