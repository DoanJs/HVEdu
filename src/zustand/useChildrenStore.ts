import { create } from "zustand";
import { ChildrenModel } from "../models/ChildrenModel";

type ChildUpdate = Partial<Omit<ChildrenModel, "id">>;

interface ChildrenState {
  children: ChildrenModel[];
  loading: boolean;
  error: string | null;

  setChildren: (children: ChildrenModel[]) => void;
  addChild: (child: ChildrenModel) => void;
  editChild: (id: string, updates: ChildUpdate) => void;
  removeChild: (id: string) => void;

  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  getChildById: (id: string) => ChildrenModel | undefined;
  clearChildren: () => void;
}

const sortChildrenByName = (children: ChildrenModel[]): ChildrenModel[] => {
  return [...children].sort((a, b) =>
    (a.fullName || "").localeCompare(b.fullName || "", "vi", {
      sensitivity: "base",
    }),
  );
};

const useChildrenStore = create<ChildrenState>((set, get) => ({
  children: [],
  loading: false,
  error: null,

  setChildren: (children) =>
    set({
      children: sortChildrenByName(children),
      error: null,
    }),

  addChild: (child) =>
    set((state) => {
      const isExisting = state.children.some((item) => item.id === child.id);

      if (isExisting) {
        return {
          children: sortChildrenByName(
            state.children.map((item) => (item.id === child.id ? child : item)),
          ),
        };
      }

      return {
        children: sortChildrenByName([...state.children, child]),
      };
    }),

  editChild: (id, updates) =>
    set((state) => ({
      children: sortChildrenByName(
        state.children.map((item) =>
          item.id === id
            ? {
                ...item,
                ...updates,
                id: item.id,
              }
            : item,
        ),
      ),
    })),

  removeChild: (id) =>
    set((state) => ({
      children: state.children.filter((item) => item.id !== id),
    })),

  setLoading: (loading) =>
    set({
      loading,
    }),

  setError: (error) =>
    set({
      error,
    }),

  getChildById: (id) => get().children.find((item) => item.id === id),

  clearChildren: () =>
    set({
      children: [],
      loading: false,
      error: null,
    }),
}));

export default useChildrenStore;
