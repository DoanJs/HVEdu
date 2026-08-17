export const userProfile = {
  name: "Nguyễn Minh Khang",
  code: "AK-2026-018",
  avatar:
    "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=240&q=80",
  gender: "Nam",
  birthday: "18/03/2021",
  age: "5 tuổi 4 tháng",
  status: "Đang can thiệp",
  teacher: "Cô An",
  parent: "Mẹ Minh Khang",
  phone: "0901 234 567",
  address: "Liên Chiểu, Đà Nẵng",
  joinDate: "05/01/2026",
  mainNeed: "Tăng giao tiếp chủ động, giảm né tránh nhiệm vụ và tăng tập trung chú ý.",
};

export const overviewCards = [
  { id: 1, icon: "bi-calendar2-check", label: "Buổi học tháng này", value: "18", desc: "Đã hoàn thành 15 buổi" },
  { id: 2, icon: "bi-bullseye", label: "Mục tiêu đang học", value: "24", desc: "6 lĩnh vực can thiệp" },
  { id: 3, icon: "bi-graph-up-arrow", label: "Tiến độ chung", value: "72%", desc: "Tăng 8% so với tháng trước" },
  { id: 4, icon: "bi-file-earmark-check", label: "Hồ sơ đã duyệt", value: "09", desc: "Kế hoạch và báo cáo" },
];

export const interventionAreas = [
  { id: 1, name: "Ngôn ngữ hiểu", progress: 78, tone: "blue" },
  { id: 2, name: "Ngôn ngữ diễn đạt", progress: 64, tone: "yellow" },
  { id: 3, name: "Tập trung chú ý", progress: 58, tone: "orange" },
  { id: 4, name: "Cá nhân xã hội", progress: 70, tone: "mint" },
];

export const weeklySchedule = [
  { id: 1, day: "Thứ 2", time: "15:00 - 16:00", title: "Can thiệp 1:1", teacher: "Cô An" },
  { id: 2, day: "Thứ 4", time: "15:00 - 16:00", title: "Can thiệp 1:1", teacher: "Cô An" },
  { id: 3, day: "Thứ 6", time: "16:00 - 17:00", title: "Nhóm kỹ năng xã hội", teacher: "Cô Hương" },
];

export const recentDocuments = [
  { id: 1, title: "Kế hoạch can thiệp cá nhân - 07/2026", status: "Đã duyệt", date: "01/07/2026", icon: "bi-clipboard2-check" },
  { id: 2, title: "Báo cáo can thiệp - 06/2026", status: "Đã duyệt", date: "29/06/2026", icon: "bi-file-earmark-text" },
  { id: 3, title: "Phiếu đánh giá đầu vào", status: "Hoàn thành", date: "05/01/2026", icon: "bi-journal-medical" },
];
