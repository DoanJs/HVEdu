# LogoutConfirmModal

Component modal xác nhận đăng xuất theo tone xanh Hy Vọng.

## Cách dùng nhanh

```jsx
import { useState } from "react";
import LogoutConfirmModal from "./LogoutConfirmModal";

export default function HeaderUserBox() {
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = async () => {
    setShowLogout(false);
    // await signOut(auth);
  };

  return (
    <>
      <button onClick={() => setShowLogout(true)}>Đăng xuất</button>

      <LogoutConfirmModal
        open={showLogout}
        userName="Nguyễn Thị An"
        userRole="Giáo viên can thiệp"
        onCancel={() => setShowLogout(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}
```
