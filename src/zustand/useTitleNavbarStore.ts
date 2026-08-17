import { create } from "zustand";
import { TitleNavbarModel } from "../models";

interface TitleNavbarState {
  titleNavbar: TitleNavbarModel;
  loading: boolean;
  error: string | null;
  setTitleNavbar: (titleNavbar: TitleNavbarModel) => void;
  clearTitleNavbar: () => void;
}

const useTitleNavbarStore = create<TitleNavbarState>((set) => ({
  titleNavbar: {
    title: "Xin chào, Giáo viên An Khang",
    subTitle: "Chào mừng bạn trở lại hệ thống quản lý can thiệp.",
  },
  loading: false,
  error: null,

  setTitleNavbar: (titleNavbar: TitleNavbarModel) => set({ titleNavbar }),
  clearTitleNavbar: () =>
    set({
      titleNavbar: {
        title: "Xin chào, Giáo viên An Khang",
        subTitle: "Chào mừng bạn trở lại hệ thống quản lý can thiệp.",
      },
    }),
}));

export default useTitleNavbarStore;
