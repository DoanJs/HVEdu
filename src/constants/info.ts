import { FieldValue } from "firebase/firestore";
// :root {
//   --blue: #0058B0;
//   --yellow: #F8B800;
// }
// types:
export interface PlanCardTheme {
  bg: string;
  color: string;
  icon: string;
}

// variables:
export const CENTER_NAME =
  "TRUNG TÂM HỖ TRỢ VÀ PHÁT TRIỂN GIÁO DỤC HOÀ NHẬP HY VỌNG";
export const FIRST_NAME = "TRUNG TÂM HỖ TRỢ VÀ PHÁT TRIỂN GIÁO DỤC HOÀ NHẬP";
export const LAST_NAME = "HY VỌNG";
export const activeCategoryDefault = "Jx8XkpdlcZXrrzFH6bQX"; //HVEdu
export const indexedDBName = "HVEdu";
export const ADMINID = "L0F0hg9mPLcgAcEyUueM9exlv1g1"; //HVEdu

export const icon512 = "/icons/HVEdu-icon-512x512.png";
export const icon192 = "/icons/HVEdu-icon-192x192.png";
export const icon192web = "/icons/HVEdu-icon-192x192-web.png";
export const bank_nnh = "/images/ngonnguhieu.png";
export const bank_nndd = "/images/ngonngudiendat.png";
export const bank_vdt = "/images/vandongtinh.png";
export const bank_vdtho = "/images/vandongtho.png";
export const bank_tnn = "/images/tienngonngu.png";
export const bank_gt = "/images/giaotiep.png";
export const bank_knc = "/images/kynangchoi.png";
export const bank_tpv = "/images/tuphucvu.png";
export const bank_thd = "/images/tienhocduong.png";
export const bank_hn = "/images/hocnhom.png";
export const bank_qs = "/images/quansat.png";
export const bank_ca = "/images/chinham.png";
export const bank_gq = "/images/giacquan.png";
export const bank_ctnn = "/images/canthiepnhomnho.png";
export const bank_ctty = "/images/ttcy.png";
export const bank_nt = "/images/nhanthuc.png";
export const bank_knbc = "/images/kynangbatchuoc.png";
export const bank_knxh = "/images/kynangxahoi.png";

export const dashboardMenu = "/images/dashboard-menu.png";
export const splash = "/images/splash.png";
export const pendingPlan = "/images/pending-plan.png";
export const pendingReport = "/images/pending-report.png";
export const loginImg = "/images/login-img.png";

export const getRandomAvatar = () => {
  const array = [
    { icon: bank_tnn },
    { icon: bank_gt },
    { icon: bank_knc },
    { icon: bank_tpv },
    { icon: bank_thd },
    { icon: bank_vdtho },
    { icon: bank_vdt },
    { icon: bank_hn },
    { icon: bank_nnh },
    { icon: bank_nndd },
    { icon: bank_qs },
    { icon: bank_ca },
    { icon: bank_gq },
  ];

  return array[Math.floor(Math.random() * array.length)];
};
export function dateInputToString(value: string): string {
  if (!value) return "";

  const [year, month, day] = value.split("-");

  return `${day}/${month}/${year}`;
}
export function stringToDateInput(value: string): string {
  if (!value) return "";

  const [day, month, year] = value.split("/");

  if (!day || !month || !year) return "";

  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

const toneThemes = [
  {
    name: "purple",
    tone: "#8e5ce2",
  },
  {
    name: "blue",
    tone: "#1f74df",
  },
  {
    name: "green",
    tone: "#20a85b",
  },
  {
    name: "pink",
    tone: "#e85088",
  },
  {
    name: "orange",
    tone: "#f29818",
  },
  {
    name: "cyan",
    tone: "#f29818",
  },
  {
    name: "sky",
    tone: "#f29818",
  },
];
export const getToneTheme = () => {
  const randomIndex = Math.floor(Math.random() * toneThemes.length);
  return toneThemes[randomIndex];
};
const planCardThemes = [
  {
    bg: "#fdecef",
    color: "#e84c7f",
    icon: "/icons/gim_red.png",
  },
  {
    bg: "#fff8e5",
    color: "#d9a300",
    icon: "/icons/gim_yellow.png",
  },
  {
    bg: "#eef8df",
    color: "#4caf50",
    icon: "/icons/gim_green.png",
  },
  {
    bg: "#edf7ff",
    color: "#2196f3",
    icon: "/icons/gim_blue.png",
  },
  {
    bg: "#f5efff",
    color: "#9c27b0",
    icon: "/icons/gim_violet.png",
  },
  {
    bg: "#fff1ea",
    color: "#ff6f00",
    icon: "/icons/gim_orange.png",
  },
  {
    bg: "#ebfbf8",
    color: "#009688",
    icon: "/icons/gim_cyan.png",
  },
  {
    bg: "#ebfbf8",
    color: "#064617",
    icon: "/icons/gim_white.png",
  },
];
//HVEdu
export const fieldOrder = [
  "wP9FYxPtWil2Ss3Mm06S", // Ngôn ngữ hiểu
  "sWobMN7VAWLtgDdxKP2n", // Ngôn ngữ diễn đạt
  "3tKv2Duu2LNUaLRkttsD", // Kỷ năng xã hội
  "sJJmAZJIrVSfJBcE1p3k", // Kỷ năng bắt chước
  "fe2XJg4GiKu4CQWz19Wp", // Nhận thức
  "TM6PVKuFYIlbUkfOeiM0", // Kỷ năng chơi
  "rPZHRivhLCsJ6bECFC0O", // Vận động tinh
  "8ftbSbuOgqf66XENkw2j", // Vận động thô
  "R0P9By4XA63tO3QIJTMT", // Tập trung chú ý
  "yByjUVCWniqVshiWLn8r", // Can thiệp nhóm nhỏ 2–3 trẻ

  "Jx8XkpdlcZXrrzFH6bQX", // Tiền ngôn ngữ
  "Yi5J6gNI13S9zWfQZw8e", // Giao tiếp
  "2tWH3H8idQC9WytyqZld", // Tự phục vụ
  "jRtks7uZ5jKw1QNLbqhu", // Tiền học đường
  "mamyqwbjpOPb3jbnYCPN", // Học nhóm
  "Sb7af2lVreWXapcOa8yu", // Quan sát, chú ý, lắng nghe
  "hvY1X9m5VlJQpdlkwfOc", // Chỉnh âm
  "1pTeKHmQVYVZt2UjfCc3", // Giác quan
];

// functions:
export const calculateAgeText = (dateString: string | undefined): string => {
  if (!dateString) return "";
  const [day, month, year] = dateString.split("/").map(Number);

  const birth = new Date(year, month - 1, day);
  const today = new Date();

  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();

  if (today.getDate() < birth.getDate()) {
    months--;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return `${years} tuổi ${months} tháng`;
};
export const getUIForBank = (fieldName: string) => {
  let icon = "";
  let desc = "";
  let color = "";

  switch (fieldName) {
    case "Ngôn ngữ hiểu":
      icon = bank_nnh;
      color = "blue";
      break;
    case "Ngôn ngữ diễn đạt":
      icon = bank_nndd;
      color = "yellow";
      break;
    case "Học nhóm":
      icon = bank_hn;
      color = "orange";
      break;
    case "Chỉnh âm":
      icon = bank_ca;
      color = "pink";
      break;
    case "Tiền học đường":
      icon = bank_thd;
      color = "green";
      break;
    case "Tự phục vụ":
      icon = bank_tpv;
      color = "blue";
      break;
      break;
    case "Tiền ngôn ngữ":
      icon = bank_tnn;
      color = "pink";
      break;
    case "Giao tiếp":
      icon = bank_gt;
      color = "green";
      break;
    case "Vận động thô":
      icon = bank_vdtho;
      color = "orange";
      break;
    case "Vận động tinh":
      icon = bank_vdt;
      color = "blue";
      break;
    case "Kỷ năng chơi":
      icon = bank_knc;
      color = "pink";
      break;
    case "Quan sát, chú ý, lắng nghe":
      icon = bank_qs;
      color = "blue";
      break;
    case "Giác quan":
      icon = bank_gq;
      color = "blue";
      break;
    case "Can thiệp nhóm nhỏ 2–3 trẻ":
      icon = bank_ctnn;
      color = "orange";
      break;
    case "Tập trung chú ý":
      icon = bank_ctty;
      color = "green";
      break;
    case "Nhận thức":
      icon = bank_nt;
      color = "pink";
      break;
    case "Kỷ năng bắt chước":
      icon = bank_knbc;
      color = "orange";
      break;
    case "Kỷ năng xã hội":
      icon = bank_knxh;
      color = "green";
      break;

    default:
      icon = bank_gq;
      color = "blue";
      break;
  }

  return { icon, desc, color };
};
export const getChildAge = (timestamp: any) => {
  if (!timestamp) return "";

  let birth: Date;

  if (timestamp instanceof Date) {
    birth = timestamp;
  } else if (typeof timestamp?.toDate === "function") {
    birth = timestamp.toDate();
  } else if (typeof timestamp?.seconds === "number") {
    birth = new Date(timestamp.seconds * 1000);
  } else {
    birth = new Date(timestamp);
  }

  if (Number.isNaN(birth.getTime())) return "";

  const today = new Date();

  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();

  if (today.getDate() < birth.getDate()) {
    months--;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const totalMonths = years * 12 + months;

  return totalMonths >= 0 ? `${totalMonths} tháng` : "";
};
export const getPreviousMonth = () => {
  const now = new Date();
  const previous = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const month = String(previous.getMonth() + 1).padStart(2, "0");
  const year = previous.getFullYear();

  return `${month}/${year}`;
};
export const getCurrentMonth = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();

  return `${month}/${year}`;
};
export const getNextMonth = () => {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const month = String(next.getMonth() + 1).padStart(2, "0");
  const year = next.getFullYear();

  return `${month}/${year}`;
};
// ---------------------------
export const formatDateSearch = (time: any) => {
  const timeMs = getTimeMs(time);

  if (!timeMs) return "";

  const date = new Date(timeMs);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year} ${month}/${year} ${year}`;
};

export const handleCommentTotal = (array: any[]) => {
  // eslint-disable-next-line
  let isComment: boolean = false;
  array.map((_: any) => {
    if (_.comment && _.status === "pending") {
      isComment = true;
    }
  });

  return isComment;
};
export const parseVNDate = (dateStr: string) => {
  const [day, month, year] = dateStr.split("/").map(Number);
  return new Date(year, month - 1, day); // month - 1 vì JS đếm từ 0
};
export const calculateAgeDetail = (birthStr: string) => {
  const birth = parseVNDate(birthStr);
  const now = new Date();

  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  let days = now.getDate() - birth.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
};
export const getCardTheme = (id: string): PlanCardTheme => {
  const hash = id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);

  return planCardThemes[hash % planCardThemes.length];
};
type TimeAtModel = {
  seconds: number;
  nanoseconds: number;
};

export const getTimeValue = (time: number | TimeAtModel | FieldValue) => {
  if (typeof time === "number") {
    return time;
  }

  if (time && typeof time === "object" && "seconds" in time) {
    return time.seconds * 1000 + time.nanoseconds / 1_000_000;
  }

  return 0;
};

export const getTimeMs = (time: any): number => {
  if (!time) return 0;

  // Firestore Timestamp instance
  if (typeof time.toMillis === "function") {
    return time.toMillis();
  }

  // Firestore Timestamp có toDate()
  if (typeof time.toDate === "function") {
    return time.toDate().getTime();
  }

  // Dạng { seconds, nanoseconds }
  if (
    typeof time === "object" &&
    "seconds" in time &&
    typeof time.seconds === "number"
  ) {
    return time.seconds * 1000 + (time.nanoseconds ?? 0) / 1_000_000;
  }

  // Date.now() hoặc timestamp number
  if (typeof time === "number") {
    return time;
  }

  // string date nếu có
  const parsed = new Date(time).getTime();

  return Number.isNaN(parsed) ? 0 : parsed;
};

export const getOnlineStatus = (status: any) => {
  if (!status) return "Chưa xác định";

  if (status.online === true) return "🟢 Đang online";

  if (!status.lastSeen) return "Chưa xác định";

  const lastSeen =
    typeof status.lastSeen === "number"
      ? status.lastSeen
      : status.lastSeen?.toDate
        ? status.lastSeen.toDate().getTime()
        : null;

  if (!lastSeen) return "Chưa xác định";

  const diff = Date.now() - lastSeen;
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "⚪ Vừa offline";
  if (minutes < 60) return `⚪ Offline ${minutes} phút trước`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `⚪ Offline ${hours} giờ trước`;

  const days = Math.floor(hours / 24);
  return `⚪ Offline ${days} ngày trước`;
};

export const getOnlineTitleByRole = (
  status: any,
  teacherRole?: string,
  currentUserRole?: string,
) => {
  if (teacherRole === "admin" && currentUserRole !== "admin") {
    return status?.online ? "Đang online" : "Offline";
  }

  return getOnlineStatus(status);
};
