# AnKhang NotificationDropdown

Component dropdown thông báo dùng chung cho hệ thống An Khang Education.

## Cài đặt

Copy thư mục `NotificationDropdown` vào:

```txt
src/components/NotificationDropdown
```

Cần Bootstrap Icons trong `index.html` hoặc `main.jsx`.

## Sử dụng

```jsx
import { useState } from 'react';
import NotificationDropdown, { notificationData } from '../../components/NotificationDropdown';

export default function Header() {
  const [openNoti, setOpenNoti] = useState(false);

  return (
    <>
      <button onClick={() => setOpenNoti((v) => !v)}>
        <i className="bi bi-bell" />
      </button>

      <NotificationDropdown
        open={openNoti}
        onClose={() => setOpenNoti(false)}
        notifications={notificationData}
        onReadAll={() => console.log('mark all read')}
        onViewAll={() => console.log('view all')}
        onClickItem={(item) => console.log(item)}
      />
    </>
  );
}
```

## Props

| Prop | Mô tả |
|---|---|
| open | boolean hiển thị dropdown |
| onClose | đóng dropdown |
| notifications | danh sách thông báo |
| onReadAll | đánh dấu đã đọc |
| onViewAll | xem tất cả |
| onClickItem | click từng thông báo |

## Notification item

```js
{
  id: 1,
  type: 'report', // report | plan | comment | calendar | upload
  title: 'Báo cáo đã được duyệt',
  description: '...',
  time: '5 phút trước',
  unread: true,
}
```
