# AnKhang DeleteModal

Component xác nhận xoá dữ liệu dùng chung cho ReactJS.

## Cài đặt

Copy thư mục `DeleteModal` vào:

```txt
src/components/DeleteModal/
```

Cần Bootstrap Icons trong project:

```bash
npm i bootstrap-icons
```

Import CSS Bootstrap Icons ở `main.jsx` nếu chưa có:

```jsx
import "bootstrap-icons/font/bootstrap-icons.css";
```

## Cách dùng

```jsx
import { useState } from "react";
import DeleteModal from "../../components/DeleteModal";

export default function ReportPage() {
  const [showDelete, setShowDelete] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const report = {
    id: "r1",
    title: "Kế hoạch can thiệp cá nhân - 01/05/2024",
    childName: "Nguyễn Minh Khang",
    teacherName: "Cô Lê Thị Minh",
    date: "01/05/2024 - 09:15",
    status: "Đã duyệt",
  };

  const handleOpenDelete = () => {
    setSelectedReport(report);
    setShowDelete(true);
  };

  const handleConfirmDelete = (data) => {
    console.log("Xoá dữ liệu:", data);
    setShowDelete(false);
  };

  return (
    <>
      <button onClick={handleOpenDelete}>Xoá</button>

      <DeleteModal
        show={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleConfirmDelete}
        type="report"
        data={selectedReport || {}}
      />
    </>
  );
}
```

## Props

| Prop | Kiểu | Mặc định | Mô tả |
|---|---|---|---|
| show | boolean | false | Hiển thị modal |
| onClose | function | () => {} | Đóng modal |
| onConfirm | function | () => {} | Xác nhận xoá |
| type | string | report | `report`, `plan`, `child`, `teacher` |
| title | string | tự động | Tiêu đề modal |
| description | string | tự động | Mô tả xác nhận |
| warning | string | Hành động này không thể hoàn tác. | Cảnh báo màu đỏ |
| data | object | {} | Dữ liệu hiển thị trong card |
| requireConfirm | boolean | true | Bắt buộc tick checkbox |
| confirmText | string | Xoá dữ liệu | Text nút xoá |
| cancelText | string | Hủy bỏ | Text nút hủy |
| loading | boolean | false | Trạng thái đang xoá |

## Data object

```js
{
  title: "Kế hoạch can thiệp cá nhân - 01/05/2024",
  childName: "Nguyễn Minh Khang",
  teacherName: "Cô Lê Thị Minh",
  date: "01/05/2024 - 09:15",
  group: "Nhóm 1",
  status: "Đã duyệt"
}
```

## Gợi ý dùng

- Xoá báo cáo: `type="report"`
- Xoá kế hoạch: `type="plan"`
- Xoá trẻ: `type="child"`
- Xoá giáo viên: `type="teacher"`
