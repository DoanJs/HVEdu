import { create } from "zustand";
import { ReportModel } from "../models/ReportModel";

type ReportUpdate = Partial<Omit<ReportModel, "id">>;

interface ReportState {
  reports: ReportModel[];
  loading: boolean;
  error: string | null;

  setReports: (reports: ReportModel[]) => void;
  addReport: (report: ReportModel) => void;
  editReport: (id: string, updates: ReportUpdate) => void;
  removeReport: (id: string) => void;

  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  getReportById: (id: string) => ReportModel | undefined;
  clearReports: () => void;
}

const useReportStore = create<ReportState>((set, get) => ({
  reports: [],
  loading: false,
  error: null,

  setReports: (reports) =>
    set({
      reports,
      error: null,
    }),

  addReport: (report) =>
    set((state) => {
      const isExisting = state.reports.some((item) => item.id === report.id);

      if (isExisting) {
        return {
          reports: state.reports.map((item) =>
            item.id === report.id ? report : item,
          ),
        };
      }

      return {
        reports: [...state.reports, report],
      };
    }),

  editReport: (id, updates) =>
    set((state) => ({
      reports: state.reports.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updates,
              id: item.id,
            }
          : item,
      ),
    })),

  removeReport: (id) =>
    set((state) => ({
      reports: state.reports.filter((item) => item.id !== id),
    })),

  setLoading: (loading) =>
    set({
      loading,
    }),

  setError: (error) =>
    set({
      error,
    }),

  getReportById: (id) => get().reports.find((item) => item.id === id),

  clearReports: () =>
    set({
      reports: [],
      loading: false,
      error: null,
    }),
}));

export default useReportStore;
