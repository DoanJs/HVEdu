export const loadingSteps = [
  { id: 1, title: 'Kết nối máy chủ', desc: 'Đang kết nối...', icon: 'bi-cloud-arrow-up', tone: 'blue', status: 'done' },
  { id: 2, title: 'Đồng bộ dữ liệu', desc: 'Đang tải... 65%', icon: 'bi-database', tone: 'green', status: 'done' },
  { id: 3, title: 'Kiểm tra thông báo', desc: 'Đang kiểm tra...', icon: 'bi-bell', tone: 'purple', status: 'done' },
  { id: 4, title: 'Hoàn tất', desc: 'Chờ một chút...', icon: 'bi-check2-circle', tone: 'yellow', status: 'active' },
];

export const statusCards = [
  { title: 'Đang kết nối...', desc: 'Đang thiết lập kết nối đến máy chủ', icon: 'bi-wifi', tone: 'blue' },
  { title: 'Đang đồng bộ dữ liệu...', desc: 'Đang tải dữ liệu từ máy chủ về thiết bị', icon: 'bi-database', tone: 'green' },
  { title: 'Đang kiểm tra thông báo...', desc: 'Đang kết nối với dịch vụ thông báo (FCM)', icon: 'bi-bell', tone: 'purple' },
  { title: 'Hoàn tất!', desc: 'Dữ liệu đã sẵn sàng để sử dụng', icon: 'bi-check2-circle', tone: 'green' },
];

export const notificationNotes = [
  'Kiểm tra kết nối FCM để đảm bảo nhận thông báo',
  'Hiển thị trạng thái kết nối mạng',
  'Đồng bộ thông báo và dữ liệu mới nhất',
  'Đảm bảo người dùng không bỏ lỡ thông tin quan trọng',
];
