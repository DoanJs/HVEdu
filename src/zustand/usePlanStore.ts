import { create } from "zustand";
import { PlanModel } from "../models/PlanModel";

type PlanUpdate = Partial<Omit<PlanModel, "id">>;

interface PlanState {
  plans: PlanModel[];
  loading: boolean;
  error: string | null;

  setPlans: (plans: PlanModel[]) => void;
  addPlan: (plan: PlanModel) => void;
  editPlan: (id: string, updates: PlanUpdate) => void;
  removePlan: (id: string) => void;

  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  getPlanById: (id: string) => PlanModel | undefined;
  clearPlans: () => void;
}

const usePlanStore = create<PlanState>((set, get) => ({
  plans: [],
  loading: false,
  error: null,

  setPlans: (plans) =>
    set({
      plans,
      error: null,
    }),

  addPlan: (plan) =>
    set((state) => {
      const isExisting = state.plans.some((item) => item.id === plan.id);

      if (isExisting) {
        return {
          plans: state.plans.map((item) => (item.id === plan.id ? plan : item)),
        };
      }

      return {
        plans: [...state.plans, plan],
      };
    }),

  editPlan: (id, updates) =>
    set((state) => ({
      plans: state.plans.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updates,
              id: item.id,
            }
          : item,
      ),
    })),

  removePlan: (id) =>
    set((state) => ({
      plans: state.plans.filter((item) => item.id !== id),
    })),

  setLoading: (loading) =>
    set({
      loading,
    }),

  setError: (error) =>
    set({
      error,
    }),

  getPlanById: (id) => get().plans.find((item) => item.id === id),

  clearPlans: () =>
    set({
      plans: [],
      loading: false,
      error: null,
    }),
}));

export default usePlanStore;
