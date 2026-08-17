import { useState } from "react";
import LogoutConfirmModal from "./LogoutConfirmModal";
import "./LogoutDemo.css";

export default function LogoutDemo() {
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = () => {
    setShowLogout(false);
    // TODO: gọi hàm đăng xuất thật ở đây, ví dụ: await signOut(auth)
    console.log("Đã xác nhận đăng xuất");
  };

  return (
    <main className="logout-demo-page">
      <button className="demo-logout-btn" onClick={() => setShowLogout(true)}>
        <i className="bi bi-box-arrow-right" />
        Đăng xuất
      </button>

      <LogoutConfirmModal
        open={showLogout}
        userName="Nguyễn Thị An"
        userRole="Giáo viên can thiệp"
        onCancel={() => setShowLogout(false)}
        onConfirm={handleLogout}
      />
    </main>
  );
}
