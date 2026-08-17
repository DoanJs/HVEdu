# AnKhang UserDropdown

Component xổ xuống cho avatar/user ở header.

## Cách dùng

```jsx
import { useState } from "react";
import UserDropdown from "./components/UserDropdown";

export default function Header() {
  const [showUser, setShowUser] = useState(false);

  const user = {
    fullName: "Cô My Ny",
    role: "director",
    email: "ankhang.edu@gmail.com",
    avatar: "https://i.pravatar.cc/150?img=47",
    planCount: 12,
    reportCount: 28,
    childCount: 8,
  };

  return (
    <div className="header-user-wrap">
      <button onClick={() => setShowUser((prev) => !prev)}>
        <img src={user.avatar} alt={user.fullName} />
      </button>

      <UserDropdown
        show={showUser}
        onClose={() => setShowUser(false)}
        user={user}
        onProfile={() => console.log("Thông tin cá nhân")}
        onChangePassword={() => console.log("Đổi mật khẩu")}
        onSetting={() => console.log("Cài đặt")}
        onLogout={() => console.log("Đăng xuất")}
      />
    </div>
  );
}
```

## Props

| Prop | Ý nghĩa |
|---|---|
| show | Hiển thị dropdown |
| onClose | Đóng dropdown |
| user | Thông tin user |
| onProfile | Click thông tin cá nhân |
| onChangePassword | Click đổi mật khẩu |
| onSetting | Click cài đặt |
| onLogout | Click đăng xuất |

## Lưu ý

Cần có Bootstrap Icons trong project:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" />
```
