export const menuItems = [
  { label: 'Tổng quan', icon: 'bi-house-door-fill', active: true },
  { label: 'Thông tin trẻ', icon: 'bi-person-bounding-box' },
  { label: 'Ngân hàng mục tiêu', icon: 'bi-bullseye' },
  { label: 'Kế hoạch can thiệp', icon: 'bi-calendar2-check' },
  { label: 'Báo cáo can thiệp', icon: 'bi-clipboard2-data' },
  { label: 'Chờ duyệt', icon: 'bi-clock' },
  { label: 'Giỏ mục tiêu', icon: 'bi-cart3' },
];

export const dashboardCards = [
  {
    id: 1,
    title: 'Ngân hàng mục tiêu',
    desc: 'Kho mục tiêu theo từng lĩnh vực phát triển.',
    value: '128',
    icon: 'bi-bullseye',
    type: 'blue',
  },
  {
    id: 2,
    title: 'Kế hoạch can thiệp',
    desc: 'Danh sách kế hoạch can thiệp đã tạo.',
    value: '12',
    icon: 'bi-calendar3',
    type: 'yellow',
  },
  {
    id: 3,
    title: 'Báo cáo can thiệp',
    desc: 'Danh sách báo cáo đã thực hiện.',
    value: '18',
    icon: 'bi-file-earmark-bar-graph-fill',
    type: 'blue',
  },
  {
    id: 4,
    title: 'Chờ duyệt',
    desc: 'Kế hoạch và báo cáo đang chờ duyệt.',
    value: '5',
    icon: 'bi-clock',
    type: 'yellow',
  },
  {
    id: 5,
    title: 'Giỏ mục tiêu',
    desc: 'Các mục tiêu đã chọn chờ tạo kế hoạch.',
    value: '7',
    icon: 'bi-cart3',
    type: 'blue',
  },
];
