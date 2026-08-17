export const menuItems = [
  { label: 'Tổng quan', icon: 'bi-house-door' },
  { label: 'Thông tin trẻ', icon: 'bi-person-badge' },
  { label: 'Ngân hàng mục tiêu', icon: 'bi-bullseye' },
  { label: 'Kế hoạch can thiệp', icon: 'bi-calendar2-check' },
  { label: 'Báo cáo can thiệp', icon: 'bi-clipboard2-data' },
  { label: 'Chờ duyệt', icon: 'bi-clock', active: true },
  { label: 'Giỏ mục tiêu', icon: 'bi-cart3' },
];

export const pendingItems = [
  {
    id: 1,
    type: 'plan',
    label: 'KẾ HOẠCH CAN THIỆP',
    title: 'Kế hoạch tháng mới',
    month: '06/2026',
    totalGoals: 24,
    createdAt: '27/05/2026',
    teacher: 'Cô An',
    dueDate: '02/06/2026',
  },
  {
    id: 2,
    type: 'report',
    label: 'BÁO CÁO CAN THIỆP',
    title: 'Báo cáo tháng hiện tại',
    month: '05/2026',
    totalGoals: 22,
    createdAt: '26/05/2026',
    teacher: 'Cô An',
    dueDate: '31/05/2026',
  },
];
