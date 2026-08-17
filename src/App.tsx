import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LoadingOverlay from "./components/LoadingOverLay";
import { auth, db } from "./firebase.config";
import AddReportPage from "./screens/addreport/AddReportPage";
import BankPage from "./screens/bank/BankPage";
import CartDemoPage from "./screens/cartDemo/CartDemoPage";
import ChangePasswordPage from "./screens/changepassword/ChangePasswordPage";
import ChildrenPage from "./screens/children/ChildrenPage";
import Dashboard from "./screens/dashboard/Dashboard";
import GeneralPage from "./screens/general/GeneralPage";
import LoginPage from "./screens/login/LoginPage";
import PendingPage from "./screens/pending/PendingPage";
import PlanPage from "./screens/plan/PlanPage";
import PlanDetailPage from "./screens/plandetail/PlanDetailPage";
import ReportPage from "./screens/report";
import ReportDetailPage from "./screens/reportdetail/ReportDetailPage";
import SplashPage from "./screens/splash/SplashPage";
import TargetPage from "./screens/target/TargetPage";
import UserDetailPage from "./screens/userdetail/UserDetailPage";
import { useLoadingOverLayStore, useUserStore } from "./zustand";
import { ToastContainer } from "react-toastify";
import { usePresence } from "./hooks/usePresence";
import ScrollButtons from "./scroll/ScrollButtons";
import RegisterPage from "./ex/register/RegisterPage";
import { ADMINIDS } from "./constants/info";
import ForgotPasswordPage from "./screens/forgotpassword/ForgotPasswordPage";

type AuthState = {
  user: User | null;
  isLoading: boolean;
};

export default function App() {
  usePresence();
  const { setUser } = useUserStore();
  const { loadingOverLay } = useLoadingOverLayStore();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
  });

  const [progress, setProgress] = useState(0);
  const [authReady, setAuthReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  // Progress 0 -> 90% trong 3 giây
  useEffect(() => {
    if (authReady) return;

    const duration = 1200;
    const maxProgress = 99;
    const intervalTime = 16;

    const step = maxProgress / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= maxProgress) return maxProgress;
        return Math.min(prev + step, maxProgress);
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [authReady]);

  // Check auth + load user profile
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          const userRef = doc(db, "users", currentUser.uid);

          const result = await getDoc(userRef);

          if (!result.exists()) {
            await signOut(auth);

            // handleToastWarn(
            //   "Tài khoản chưa được cấp quyền, vui lòng liên hệ admin!",
            // );

            setUser(null);

            setAuthState({
              user: null,
              isLoading: false,
            });

            return;
          }

          setUser({
            ...result.data(),
            id: currentUser.uid,
          } as any);

          setAuthState({
            user: currentUser,
            isLoading: false,
          });
        } else {
          setUser(null);

          setAuthState({
            user: null,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error("Auth error:", error);

        setUser(null);

        setAuthState({
          user: null,
          isLoading: false,
        });
      } finally {
        setAuthReady(true);
      }
    });

    return () => unsub();
  }, [setUser]);

  // Khi auth xong => lên 100% rồi vào app
  useEffect(() => {
    if (!authReady) return;

    setProgress(100);

    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [authReady]);

  if (showSplash || authState.isLoading) {
    return <SplashPage progress={Math.round(progress)} />;
  }

  return (
    <div>
      
      <Routes>
        <Route
          path="/login"
          element={authState.user ? <Navigate to="/" replace /> : <LoginPage />}
        />
        <Route
          path="register"
          element={
            authState.user && ADMINIDS.includes(authState.user.uid) ? (
              <RegisterPage />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/"
          element={
            authState.user ? <ChildrenPage /> : <Navigate to="/login" replace />
          }
        />

        <Route path="forgotpassword" element={<ForgotPasswordPage />} />

        <Route path="home/:childId" element={<Dashboard />}>
          <Route path="general" element={<GeneralPage />} />
          <Route path="bank" element={<BankPage />} />
          <Route path="bank/:bankId" element={<TargetPage />} />
          <Route path="plan" element={<PlanPage />} />
          <Route path="plan/:id" element={<PlanDetailPage />} />
          <Route path="report" element={<ReportPage />} />
          <Route path="report/:id" element={<ReportDetailPage />} />
          <Route path="pending" element={<PendingPage />} />
          <Route path="cart" element={<CartDemoPage />} />
          <Route path="addreport" element={<AddReportPage />} />

          <Route path="profile" element={<UserDetailPage />} />
          <Route path="changepassword" element={<ChangePasswordPage />} />

          {/* <Route path="media" element={<MediaLibraryBootstrapGreen />} /> */}
        </Route>
      </Routes>

      <ToastContainer />
      <LoadingOverlay show={loadingOverLay} />
    </div>
  );
}

// <div>
//   {/* <ReportPage /> */}
//   {/* <PlanPage /> */}
//   {/* <PendingPage /> */}
//   {/* <CartPage /> */}

//   {/* lấy Dashboard từ trang BankPage này */}
//   {/* <BankPage /> */}
//   <Dashboard />

//   {/* <GeneralPage /> */}
//   {/* <ChildDetailPage /> */}
//   {/* <PlanDetailPage /> */}
//   {/* <ReportDetailPage /> */}
//   {/* <AddReportPage /> */}
//   {/* <ChildrenPage /> */}
//   {/* <SplashPage /> */}
//   {/* <LoadingPage /> */}
//   {/* <LoginPage /> */}
//   {/* <RegisterPage /> */}
//   {/* <ForgotPasswordPage /> */}

//   {/* <ToastPage /> chưa làm được - đang lỗi */}

//   {/* <CartDemoPage /> */}
//   {/* <CommentModal
//     show={showComment}
//     onClose={() => setShowComment(false)}
//     plan="Kế hoạch tháng 07/2026"
//     report="Báo cáo tháng 07/2026"
//     comments={comments}
//     title="title"
//   /> */}

//   {/* <DeleteModal
//     show={showDelete}
//     onClose={() => setShowDelete(false)}
//     item={deleteItem}
//     type="report"
//     onConfirm={() => {
//       console.log("Đã xóa");
//       setShowDelete(false);
//     }}
//   /> */}

//   {/* <NotificationDropdown
//     show={showNotification}
//     onClose={() => setShowNotification(false)}
//     notifications={notifications}
//   /> */}
//   {/* <UserDropdown
//     show={showUserMenu}
//     onClose={() => setShowUserMenu(false)}
//     user={user}
//     onProfile={() => navigate("/profile")}
//     onChangePassword={() => navigate("/account")}
//     onSetting={() => navigate("/setting")}
//     onHelp={() => navigate("/help")}
//     onLogout={handleLogout}
//   /> */}
// </div>

//   const navigate = useNavigate();
// const [showComment, setShowComment] = useState(true);
// type CommentStatus = "approved" | "edit" | "pending";
// const [showDelete, setShowDelete] = useState(true);
// const [deleteItem, setDeleteItem] = useState(null);
// const [showUserMenu, setShowUserMenu] = useState(true);
// const user = {
//   id: "teacher01",
//   avatar: "./avatar.png",
//   fullName: "Trần Thị My Ny",
//   position: "Giám đốc",
//   email: "myny@gmail.com",
// };

// const report = {
//   icon: "/icons/report.png",

//   title: "Kế hoạch can thiệp cá nhân - 01/05/2024",

//   child: "Nguyễn Minh Khang",

//   teacher: "Cô Lê Thị Minh",

//   createdAt: "01/05/2024 - 09:15",

//   status: "approved",
// };
// type NotificationItem = {
//   id: number;
//   type: "report" | "plan" | "comment" | "calendar" | "upload";
//   title: string;
//   description: string;
//   time: string;
//   unread: boolean;
// };

// const [showNotification, setShowNotification] = useState(true);
// const notifications: NotificationItem[] = [
//   {
//     id: 1,
//     type: "report",
//     title: "Báo cáo can thiệp đã được duyệt",
//     description:
//       'Báo cáo "Kế hoạch cá nhân - 01/05/2024" đã được duyệt bởi Cô Lê Thị Minh.',
//     time: "5 phút trước",
//     unread: true,
//   },

//   {
//     id: 2,
//     type: "plan",
//     title: "Kế hoạch can thiệp đã được duyệt",
//     description: 'Kế hoạch "Kế hoạch cá nhân - 01/05/2024" đã được duyệt.',
//     time: "15 phút trước",
//     unread: true,
//   },

//   {
//     id: 3,
//     type: "comment",
//     title: "Có góp ý mới cho báo cáo",
//     description: "Cô Nguyễn Thị An đã gửi góp ý cho báo cáo ngày 07/05/2024.",
//     time: "1 giờ trước",
//     unread: true,
//   },

//   {
//     id: 4,
//     type: "calendar",
//     title: "Lịch hẹn sắp tới",
//     description:
//       "Bạn có lịch hẹn với phụ huynh của Trần Bảo Châu vào 09:00 ngày mai.",
//     time: "2 giờ trước",
//     unread: false,
//   },

//   {
//     id: 5,
//     type: "upload",
//     title: "Tải file báo cáo thành công",
//     description:
//       'File "Báo cáo tháng 04/2024.pdf" đã được tải lên thành công.',
//     time: "3 giờ trước",
//     unread: false,
//   },
// ];

// type CommentItemType = {
//   id: number;
//   avatar: string;
//   name: string;
//   role: string;
//   date: string;
//   status: CommentStatus;
//   content: string;
// };
// const comments: CommentItemType[] = [
//   {
//     id: 1,
//     avatar: "https://i.pravatar.cc/150?img=1",
//     name: "Cô My Ny",
//     role: "Giám đốc",
//     date: "05/07/2026 09:20",
//     status: "approved",
//     content:
//       "Kế hoạch khá đầy đủ. Tuy nhiên cần bổ sung thêm chiến lược hỗ trợ ở mục tiêu số 4.",
//   },
//   {
//     id: 2,
//     avatar: "https://i.pravatar.cc/150?img=2",
//     name: "Cô Thu Phương",
//     role: "Trưởng chuyên môn",
//     date: "05/07/2026 10:15",
//     status: "edit",
//     content: "Báo cáo cần mô tả rõ hành vi của trẻ ở hoạt động cuối.",
//   },
// ];

// const handleLogout = () => {};
