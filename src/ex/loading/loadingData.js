export const loadingTypes = [
  {
    title: "Đang xử lý...",
    desc: "Vui lòng chờ trong giây lát",
    note: "Trạng thái mặc định khi đang xử lý yêu cầu.",
    icon: "bi-arrow-clockwise",
    color: "blue",
  },
  {
    title: "Đang xác thực...",
    desc: "Kiểm tra thông tin đăng nhập",
    note: "Dùng cho thao tác đăng nhập, đăng ký hoặc xác thực.",
    icon: "bi-shield-check",
    color: "purple",
  },
  {
    title: "Đang kết nối...",
    desc: "Đang kết nối đến hệ thống",
    note: "Phù hợp khi gọi API, Firebase hoặc đồng bộ dữ liệu.",
    icon: "bi-cloud-arrow-up",
    color: "sky",
  },
];

export const uxNotes = [
  "Overlay phủ toàn màn hình để người dùng tập trung vào trạng thái xử lý.",
  "Spinner xoay nhẹ, không gây khó chịu.",
  "Nội dung ngắn gọn, rõ ràng và dễ hiểu.",
  "Ngăn người dùng bấm nhiều lần trong lúc hệ thống đang xử lý.",
];

export const principles = [
  { icon: "bi-rocket-takeoff", title: "Áp dụng cho các thao tác submit: đăng nhập, lưu dữ liệu, gửi duyệt." },
  { icon: "bi-clock", title: "Hiển thị tối thiểu khoảng 500ms để người dùng nhận biết hệ thống phản hồi." },
  { icon: "bi-exclamation-triangle", title: "Nếu xử lý quá lâu, nên chuyển sang thông báo lỗi hoặc hướng dẫn thử lại." },
];
