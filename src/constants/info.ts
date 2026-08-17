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
export const CENTER_NAME = "TRUNG TÂM HỖ TRỢ VÀ PHÁT TRIỂN GIÁO DỤC HOÀ NHẬP HY VỌNG";
export const FIRST_NAME = "TRUNG TÂM HỖ TRỢ VÀ PHÁT TRIỂN GIÁO DỤC HOÀ NHẬP";
export const LAST_NAME = "HY VỌNG";
export const activeCategoryDefault = "7KJpGSKXe7Xv0dxmMKgl"; //AKEdu
export const indexedDBName = "HVEdu";
export const ADMINID = "L0F0hg9mPLcgAcEyUueM9exlv1g1"; //HVEdu
// export const ADMINIDS = ["L0F0hg9mPLcgAcEyUueM9exlv1g1"]; //HVEdu

export const icon512 = "/icons/HVEdu-icon-512x512.png";
export const icon192 = "/icons/HVEdu-icon-192x192.png";
export const icon192web = "/icons/HVEdu-icon-192x192-web.png";
export const dashboardMenu = "/images/dashboard-menu.png";
export const splash = "/images/splash.png";
export const pendingPlan = "/images/pending-plan.png";
export const pendingReport = "/images/pending-report.png";
export const loginImg = "/images/login-img.png";
export const bank_nnh = "/images/nnh.png";
export const bank_nndd = "/images/nndd.png";
export const bank_nt = "/images/nt.png";
export const bank_knbc = "/images/knbc.png";
export const bank_knc = "/images/knc.png";
export const bank_vdt = "/images/vdt.png";
export const bank_vdtho = "/images/vdtho.png";
export const bank_cnxh = "/images/cnxh.png";
export const bank_hv = "/images/hv.png";
export const bank_ttcy = "/images/ttcy.png";
export const bank_knnt = "/images/knnt.png";
export const bank_knxh = "/images/knxh.png";
export const bank_abills = "/images/abills.png";

export const getRandomAvatar = () => {
  const array = [
    { icon: bank_knxh },
    { icon: bank_knnt },
    { icon: bank_hv },
    { icon: bank_ttcy },
    { icon: bank_cnxh },
    { icon: bank_vdtho },
    { icon: bank_vdt },
    { icon: bank_knbc },
    { icon: bank_nnh },
    { icon: bank_nndd },
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
//HoaBanMaiEdu
export const fieldOrder = [
  "gGNJ5mQZRSxkSW4qAu6F", // Ngôn ngữ hiểu
  "3EUhuJoxzHauQpx1pPxq", // Ngôn ngữ diễn đạt
  "zfnX1X3wvP46rRF3k4gB", // Chỉnh âm
  "j6fFXTUD1D6rym4UmKkV", // Nhận thức
  "cyg1PnZ4snHm583dFBzp", // Vận động tinh
  "qw6gesBxUmEgEDow153O", // Cá nhân xã hội
  "Nji6cMUy0TcZ1Tw8B2iG", // Tập trung chú ý
  "48UQhGWIQECsi8lAd7Sc", // Hành vi
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
      desc = "Hiểu và thực hiện các yêu cầu, chỉ dẫn trong giao tiếp.";
      color = "blue";
      break;
    case "Ngôn ngữ diễn đạt":
      icon = bank_nndd;
      desc = "Diễn đạt nhu cầu, ý tưởng bằng lời nói, cử chỉ, hình ảnh.";
      color = "yellow";
      break;
    case "Kỹ năng bắt chước":
      icon = bank_knbc;
      desc =
        "Bắt chước hành động, âm thanh và lời nói để hỗ trợ học tập và giao tiếp.";
      color = "orange";
      break;
    case "Kỹ năng chơi":
      icon = bank_knc;
      desc =
        "Tham gia các hoạt động chơi phù hợp, biết chơi độc lập và chơi cùng người khác.";
      color = "pink";
      break;
    case "Cá nhân xã hội":
      icon = bank_cnxh;
      desc = "Kỹ năng tự chăm sóc, tương tác xã hội và ứng xử phù hợp.";
      color = "green";
      break;
    case "Tập trung chú ý":
      icon = bank_ttcy;
      desc = "Duy trì sự chú ý vào nhiệm vụ trong một khoảng thời gian.";
      color = "blue";
      break;
    case "Kỹ năng nhận thức":
      icon = bank_knnt;
      desc =
        "Phát triển khả năng quan sát, ghi nhớ, tư duy và giải quyết các nhiệm vụ học tập.";
      color = "yellow";
      break;
    case "Nhận thức":
      icon = bank_nt;
      desc = "Nhận biết, phân loại, so sánh, ghi nhớ và giải quyết vấn đề.";
      color = "pink";
      break;
    case "Kỹ năng xã hội":
      icon = bank_knxh;
      desc =
        "Tương tác, hợp tác và xây dựng các mối quan hệ phù hợp trong các tình huống xã hội.";
      color = "green";
      break;
    case "Vận động thô":
      icon = bank_vdtho;
      desc = "Sử dụng các cơ lớn của cơ thể để di chuyển và giữ thăng bằng.";
      color = "orange";
      break;
    case "Vận động tinh":
      icon = bank_vdt;
      desc = "Sử dụng các cơ nhỏ của bàn tay, ngón tay một cách khéo léo.";
      color = "blue";
      break;
    case "Hợp tác và khen thưởng":
      icon = bank_knc;
      // desc = "Bộ công cụ đánh giá các kỹ năng nền tảng, hỗ trợ xây dựng mục tiêu và theo dõi tiến trình can thiệp.";
      color = "pink";
      break;
    case "Quan sát":
      icon = bank_vdtho;
      // desc = "Bộ công cụ đánh giá các kỹ năng nền tảng, hỗ trợ xây dựng mục tiêu và theo dõi tiến trình can thiệp.";
      color = "blue";
      break;
    case "Nhận biết":
      icon = bank_cnxh;
      // desc = "Bộ công cụ đánh giá các kỹ năng nền tảng, hỗ trợ xây dựng mục tiêu và theo dõi tiến trình can thiệp.";
      color = "orange";
      break;
    case "Bắt chước":
      icon = bank_ttcy;
      // desc = "Bộ công cụ đánh giá các kỹ năng nền tảng, hỗ trợ xây dựng mục tiêu và theo dõi tiến trình can thiệp.";
      color = "green";
      break;
    case "Nói theo":
      icon = bank_knc;
      // desc = "Bộ công cụ đánh giá các kỹ năng nền tảng, hỗ trợ xây dựng mục tiêu và theo dõi tiến trình can thiệp.";
      color = "yellow";
      break;
    case "Yêu cầu":
      icon = bank_vdtho;
      // desc = "Bộ công cụ đánh giá các kỹ năng nền tảng, hỗ trợ xây dựng mục tiêu và theo dõi tiến trình can thiệp.";
      color = "pink";
      break;
    case "Gọi tên":
      icon = bank_cnxh;
      // desc = "Bộ công cụ đánh giá các kỹ năng nền tảng, hỗ trợ xây dựng mục tiêu và theo dõi tiến trình can thiệp.";
      color = "yellow";
      break;
    case "Hội thoại liên tưởng":
      icon = bank_ttcy;
      // desc = "Bộ công cụ đánh giá các kỹ năng nền tảng, hỗ trợ xây dựng mục tiêu và theo dõi tiến trình can thiệp.";
      color = "blue";
      break;
    case "Cú pháp ngữ pháp":
      icon = bank_vdtho;
      // desc = "Bộ công cụ đánh giá các kỹ năng nền tảng, hỗ trợ xây dựng mục tiêu và theo dõi tiến trình can thiệp.";
      color = "green";
      break;
    case "Vui chơi":
      icon = bank_cnxh;
      // desc = "Bộ công cụ đánh giá các kỹ năng nền tảng, hỗ trợ xây dựng mục tiêu và theo dõi tiến trình can thiệp.";
      color = "orange";
      break;
    case "Ngôn ngữ tự phát":
      icon = bank_ttcy;
      // desc = "Bộ công cụ đánh giá các kỹ năng nền tảng, hỗ trợ xây dựng mục tiêu và theo dõi tiến trình can thiệp.";
      color = "blue";
      break;
    case "Học nhóm":
      icon = bank_vdtho;
      // desc = "Bộ công cụ đánh giá các kỹ năng nền tảng, hỗ trợ xây dựng mục tiêu và theo dõi tiến trình can thiệp.";
      color = "pink";
      break;
    case "Tuân theo nề nếp":
      icon = bank_cnxh;
      // desc = "Bộ công cụ đánh giá các kỹ năng nền tảng, hỗ trợ xây dựng mục tiêu và theo dõi tiến trình can thiệp.";
      color = "green";
      break;
    case "Tổng hợp khái quát":
      icon = bank_ttcy;
      // desc = "Bộ công cụ đánh giá các kỹ năng nền tảng, hỗ trợ xây dựng mục tiêu và theo dõi tiến trình can thiệp.";
      color = "yellow";
      break;
    case "Đọc":
      icon = bank_vdtho;
      // desc = "Bộ công cụ đánh giá các kỹ năng nền tảng, hỗ trợ xây dựng mục tiêu và theo dõi tiến trình can thiệp.";
      color = "orange";
      break;
    case "Toán":
      icon = bank_cnxh;
      // desc = "Bộ công cụ đánh giá các kỹ năng nền tảng, hỗ trợ xây dựng mục tiêu và theo dõi tiến trình can thiệp.";
      color = "pink";
      break;
    case "Viết":
      icon = bank_knnt;
      // desc = "Bộ công cụ đánh giá các kỹ năng nền tảng, hỗ trợ xây dựng mục tiêu và theo dõi tiến trình can thiệp.";
      color = "green";
      break;
    case "Ghép vần":
      icon = bank_knc;
      // desc = "Bộ công cụ đánh giá các kỹ năng nền tảng, hỗ trợ xây dựng mục tiêu và theo dõi tiến trình can thiệp.";
      color = "blue";
      break;
    case "Tự mặc quần áo":
      icon = bank_cnxh;
      // desc = "Bộ công cụ đánh giá các kỹ năng nền tảng, hỗ trợ xây dựng mục tiêu và theo dõi tiến trình can thiệp.";
      color = "yellow";
      break;
    case "Ăn":
      icon = bank_vdtho;
      // desc = "Bộ công cụ đánh giá các kỹ năng nền tảng, hỗ trợ xây dựng mục tiêu và theo dõi tiến trình can thiệp.";
      color = "orange";
      break;
    case "Tự chăm sóc":
      icon = bank_knc;
      // desc = "Bộ công cụ đánh giá các kỹ năng nền tảng, hỗ trợ xây dựng mục tiêu và theo dõi tiến trình can thiệp.";
      color = "pink";
      break;
    case "Đi vệ sinh":
      icon = bank_cnxh;
      // desc = "Bộ công cụ đánh giá các kỹ năng nền tảng, hỗ trợ xây dựng mục tiêu và theo dõi tiến trình can thiệp.";
      color = "green";
      break;
    case "Giác quan":
      icon = bank_knxh;
      // desc =
      //   "Tương tác, hợp tác và xây dựng các mối quan hệ phù hợp trong các tình huống xã hội.";
      color = "green";
      break;

    default:
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
