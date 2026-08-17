export const menuItems = [
  { label: 'Tổng quan', icon: 'bi-house-door-fill' },
  { label: 'Thông tin trẻ', icon: 'bi-person-bounding-box', active: true },
  { label: 'Ngân hàng mục tiêu', icon: 'bi-bullseye' },
  { label: 'Kế hoạch can thiệp', icon: 'bi-calendar2-check' },
  { label: 'Báo cáo can thiệp', icon: 'bi-clipboard2-data' },
  { label: 'Chờ duyệt', icon: 'bi-clock' },
  { label: 'Giỏ mục tiêu', icon: 'bi-cart3' },
];

export const childProfile = {
  fullName: 'Nguyễn Minh Khang',
  shortName: 'Khang',
  gender: 'Nam',
  birthDate: '12/05/2020',
  age: '4 tuổi 1 tháng',
  code: 'AK-2026-018',
  status: 'Đang can thiệp',
  teacher: 'Cô An',
  startDate: '15/03/2026',
  avatar: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=320&q=80',
  parent: 'Mẹ Minh Anh',
  phone: '0901 234 567',
  address: 'Liên Chiểu, Đà Nẵng',
};

export const quickStats = [
  { label: 'Kế hoạch', value: '12', icon: 'bi-calendar2-check', tone: 'blue' },
  { label: 'Báo cáo', value: '18', icon: 'bi-clipboard2-data', tone: 'yellow' },
  { label: 'Mục tiêu', value: '128', icon: 'bi-bullseye', tone: 'green' },
  { label: 'Chờ duyệt', value: '05', icon: 'bi-clock', tone: 'pink' },
];

export const childNotes = [
  { title: 'Điểm mạnh', icon: 'bi-stars', content: 'Con vui vẻ, thích tương tác với cô, hứng thú với đồ chơi có màu sắc và âm thanh.' },
  { title: 'Khó khăn hiện tại', icon: 'bi-exclamation-circle', content: 'Khả năng duy trì chú ý còn ngắn, cần hỗ trợ khi thực hiện chuỗi yêu cầu 2 bước.' },
  { title: 'Định hướng can thiệp', icon: 'bi-compass', content: 'Tăng giao tiếp chủ động, mở rộng câu 3–4 từ và rèn kỹ năng chờ lượt trong hoạt động nhóm.' },
];

export const developmentAreas = [
  { field: 'Ngôn ngữ hiểu', progress: 72, color: 'blue', icon: 'bi-lightbulb' },
  { field: 'Ngôn ngữ diễn đạt', progress: 58, color: 'green', icon: 'bi-chat-dots' },
  { field: 'Nhận thức', progress: 66, color: 'yellow', icon: 'bi-puzzle' },
  { field: 'Vận động tinh', progress: 80, color: 'purple', icon: 'bi-scissors' },
  { field: 'Cá nhân xã hội', progress: 61, color: 'pink', icon: 'bi-people' },
];

export const timeline = [
  { time: '06/2026', title: 'Hoàn thành 12 mục tiêu', desc: 'Con duy trì tốt các mục tiêu ngôn ngữ hiểu và vận động tinh.', type: 'done' },
  { time: '05/2026', title: 'Báo cáo can thiệp', desc: 'Tăng khả năng làm theo yêu cầu 2 bước khi có hỗ trợ.', type: 'report' },
  { time: '04/2026', title: 'Tạo kế hoạch mới', desc: 'Bổ sung mục tiêu diễn đạt nhu cầu bằng câu 3–4 từ.', type: 'plan' },
];
