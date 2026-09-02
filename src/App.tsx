import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import LoadingOverlay from "./components/LoadingOverLay";
import { auth, db } from "./firebase.config";
import { usePresence } from "./hooks/usePresence";
import AddReportPage from "./screens/addreport/AddReportPage";
import BankPage from "./screens/bank/BankPage";
import CartDemoPage from "./screens/cartDemo/CartDemoPage";
import ChangePasswordPage from "./screens/changepassword/ChangePasswordPage";
import ChildrenPage from "./screens/children/ChildrenPage";
import Dashboard from "./screens/dashboard/Dashboard";
import ForgotPasswordPage from "./screens/forgotpassword/ForgotPasswordPage";
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
import RegisterPage from "./screens/register/RegisterPage";

type AuthState = {
  user: User | null;
  isLoading: boolean;
};

export default function App() {
  usePresence();
  const { setUser, user } = useUserStore();
  const isAdmin = user && user.role === 'admin'
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
            isAdmin ? (
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