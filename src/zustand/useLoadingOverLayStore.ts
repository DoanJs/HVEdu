import { create } from "zustand";

interface LoadingOverLayState {
  loadingOverLay: boolean;
  loading: boolean;
  error: string | null;
  setLoadingOverLay: (loadingOverLay: boolean) => void;
  clearLoadingOverLay: () => void;
}

const useLoadingOverLayStore = create<LoadingOverLayState>((set) => ({
  loadingOverLay: false,
  loading: false,
  error: null,

  setLoadingOverLay: (loadingOverLay: boolean) => set({ loadingOverLay }),
  clearLoadingOverLay: () => set({ loadingOverLay: false }),
}));

export default useLoadingOverLayStore;
