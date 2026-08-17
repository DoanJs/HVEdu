import { useEffect, useRef, useState } from "react";
import "./UserDropdown.css";
import LogoutConfirmModal from "../../modal/logoutconfirm/LogoutConfirmModal";
import { UserModel } from "../../../models";
import { icon512, indexedDBName } from "../../../constants/info";
import { auth, rtdb } from "../../../firebase.config";
import { signOut } from "firebase/auth";
import { ref, remove, set } from "firebase/database";
import {
  handleToastSuccess,
  handleToastError,
} from "../../../constants/handleToast";
import { useChildStore, useLoadingOverLayStore } from "../../../zustand";
import { Link, useNavigate } from "react-router-dom";

export interface UserDropdownProps {
  show?: boolean;
  data?: any;
  user?: UserModel;
  onClose?: () => void;
  onProfile?: () => void;
  onChangePassword?: () => void;
  // onSetting?: () => void;
  onLogout?: () => void;
  // onHelp?: () => void;
}

export default function UserDropdown({
  show = false,
  data,
  user,
  onClose = () => {},
  onProfile = () => {},
  onChangePassword = () => {},
  // onSetting = () => {},
  onLogout = () => {},
  // onHelp = () => {},
}: UserDropdownProps) {
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLElement | null>(null);
  const [showLogout, setShowLogout] = useState(false);
  const { setLoadingOverLay } = useLoadingOverLayStore();
  const { child } = useChildStore();

  useEffect(() => {
    if (!show) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!dropdownRef.current) return;

      if (!dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEsc);
    };
  }, [show, onClose]);

  if (!show && !showLogout) return null;

  const clearIndexedDB = () => {
    return new Promise((resolve: any, reject) => {
      const request = indexedDB.deleteDatabase(indexedDBName);

      request.onsuccess = () => {
        console.log("IndexedDB deleted");
        resolve();
      };

      request.onerror = (event) => {
        console.error("Error deleting IndexedDB", event);
        reject();
      };

      request.onblocked = () => {
        console.warn("Delete blocked (close other tabs)");
      };
    });
  };
  const handleLogout = async () => {
    setShowLogout(false);

    const uid = auth.currentUser?.uid;
    if (uid) {
      await set(ref(rtdb, `status/${uid}`), {
        online: false,
        lastSeen: Date.now(),
      });
      await remove(ref(rtdb, `viewingChildren/${child?.id}/${uid}`));
    }
    setLoadingOverLay(true);

    try {
      await signOut(auth);

      // ✅ clear cache IndexedDB
      await clearIndexedDB();

      handleToastSuccess("Đăng xuất tài khoản thành công !");
      navigate("/login", { replace: true });
    } catch (error) {
      handleToastError("Đăng xuất tài khoản thất bại !");
      console.error("Error signing out:", error);
    } finally {
      setLoadingOverLay(false);
    }
  };

  return (
    <div className="ak-user-layer">
      {show && (
        <section
          ref={dropdownRef}
          className="ak-user-dropdown"
          role="dialog"
          aria-label="Tài khoản người dùng"
        >
          <div className="ak-user-card-bg">
            <span className="ak-user-star ak-user-star-1">✦</span>
            <span className="ak-user-star ak-user-star-2">✧</span>
            <span className="ak-user-star ak-user-star-3">✦</span>
          </div>

          <button
            className="ak-user-close"
            type="button"
            onClick={onClose}
            aria-label="Đóng"
          >
            <i className="bi bi-x-lg" />
          </button>

          <header className="ak-user-header">
            <div className="ak-user-avatar-wrap">
              <img
                src={user?.avatar || icon512}
                alt={"avatar-user"}
                className="ak-user-avatar"
              />
              <span className="ak-user-online" />
            </div>

            <div className="ak-user-info">
              <h3>{user?.fullName}</h3>
              <p>{user?.position}</p>
              <span>{user?.email}</span>
            </div>
          </header>

          <div className="ak-user-stat-grid">
            <div>
              <strong>{data.plans?.length}</strong>
              <span>Kế hoạch</span>
            </div>

            <div>
              <strong>{data.reports?.length}</strong>
              <span>Báo cáo</span>
            </div>

            <div>
              <strong>{data.childrenForTeacher?.length}</strong>
              <span>Trẻ phụ trách</span>
            </div>
          </div>

          <nav className="ak-user-menu">
            <button
              type="button"
              onClick={() => {
                onProfile();
                onClose();
              }}
            >
              <span className="ak-user-menu-icon ak-user-blue">
                <i className="bi bi-person-badge" />
              </span>

              <span>
                <strong>Thông tin cá nhân</strong>
                <em>Xem và chỉnh sửa hồ sơ</em>
              </span>

              <i className="bi bi-chevron-right ak-user-arrow" />
            </button>

            <button
              type="button"
              onClick={() => {
                onChangePassword();
                onClose();
              }}
            >
              <span className="ak-user-menu-icon ak-user-green">
                <i className="bi bi-shield-lock" />
              </span>

              <span>
                <strong>Đổi mật khẩu</strong>
                <em>Bảo mật tài khoản đăng nhập</em>
              </span>

              <i className="bi bi-chevron-right ak-user-arrow" />
            </button>
            <Link to={"../register"} style={{ textDecoration: "none" }}>
              <button type="button">
                <span className="ak-user-menu-icon ak-user-blue">
                  <i className="bi bi-person-badge" />
                </span>

                <span>
                  <strong>Tạo tài khoản</strong>
                  <em>Tạo mới tài khoản cho giáo viên</em>
                </span>

                <i className="bi bi-chevron-right ak-user-arrow" />
              </button>
            </Link>

            {/* <button
              type="button"
              onClick={() => {
                onSetting();
                onClose();
              }}
            >
              <span className="ak-user-menu-icon ak-user-purple">
                <i className="bi bi-gear" />
              </span>

              <span>
                <strong>Cài đặt</strong>
                <em>Tùy chỉnh giao diện hệ thống</em>
              </span>

              <i className="bi bi-chevron-right ak-user-arrow" />
            </button> */}
          </nav>

          <footer className="ak-user-footer">
            <button
              type="button"
              className="ak-user-logout"
              onClick={() => {
                onClose();
                setShowLogout(true);
              }}
            >
              <i className="bi bi-box-arrow-right" />
              Đăng xuất
            </button>
          </footer>
        </section>
      )}

      <LogoutConfirmModal
        open={showLogout}
        userName={user?.fullName}
        userRole={user?.position}
        avatar={user?.avatar}
        onCancel={() => setShowLogout(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}
