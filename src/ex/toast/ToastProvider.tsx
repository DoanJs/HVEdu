// ToastProvider.tsx
import React, { createContext, useContext, useState } from "react";
import Toast from "./Toast";
import "./Toast.css";

type ToastType = "success" | "warning" | "error" | "info";

type ToastApi = {
  success: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{
    id: number;
    type: ToastType;
    title: string;
    message?: string;
  } | null>(null);

  const showToast = (type: ToastType, title: string, message?: string) => {
    setToast({
      id: Date.now(),
      type,
      title,
      message,
    });
  };

  const value: ToastApi = {
    success: (title, message) => showToast("success", title, message),
    warning: (title, message) => showToast("warning", title, message),
    error: (title, message) => showToast("error", title, message),
    info: (title, message) => showToast("info", title, message),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && <Toast toast={toast} onClose={() => setToast(null)} />}
    </ToastContext.Provider>
  );
}
