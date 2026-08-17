import { create } from "zustand";
import { TargetModel } from "../models/TargetModel";

type TargetUpdate = Partial<Omit<TargetModel, "id">>;

interface TargetState {
  targets: TargetModel[];
  loading: boolean;
  error: string | null;

  setTargets: (targets: TargetModel[]) => void;
  addTarget: (target: TargetModel) => void;
  editTarget: (id: string, updates: TargetUpdate) => void;
  removeTarget: (id: string) => void;

  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  getTargetById: (id: string) => TargetModel | undefined;
  clearTargets: () => void;
}

const useTargetStore = create<TargetState>((set, get) => ({
  targets: [],
  loading: false,
  error: null,

  setTargets: (targets) =>
    set({
      targets,
      error: null,
    }),

  addTarget: (target) =>
    set((state) => {
      const isExisting = state.targets.some(
        (item) => item.id === target.id,
      );

      if (isExisting) {
        return {
          targets: state.targets.map((item) =>
            item.id === target.id ? target : item,
          ),
        };
      }

      return {
        targets: [...state.targets, target],
      };
    }),

  editTarget: (id, updates) =>
    set((state) => ({
      targets: state.targets.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updates,
              id: item.id,
            }
          : item,
      ),
    })),

  removeTarget: (id) =>
    set((state) => ({
      targets: state.targets.filter((item) => item.id !== id),
    })),

  setLoading: (loading) =>
    set({
      loading,
    }),

  setError: (error) =>
    set({
      error,
    }),

  getTargetById: (id) =>
    get().targets.find((item) => item.id === id),

  clearTargets: () =>
    set({
      targets: [],
      loading: false,
      error: null,
    }),
}));

export default useTargetStore;