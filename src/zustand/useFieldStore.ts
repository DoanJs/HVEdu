import { create } from "zustand";
import { FieldModel } from "../models/FieldModel";

type FieldUpdate = Partial<Omit<FieldModel, "id">>;

interface FieldState {
  fields: FieldModel[];
  loading: boolean;
  error: string | null;

  setFields: (fields: FieldModel[]) => void;
  addField: (field: FieldModel) => void;
  editField: (id: string, updates: FieldUpdate) => void;
  removeField: (id: string) => void;

  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  getFieldById: (id: string) => FieldModel | undefined;
  clearFields: () => void;
}

const useFieldStore = create<FieldState>((set, get) => ({
  fields: [],
  loading: false,
  error: null,

  setFields: (fields) =>
    set({
      fields,
      error: null,
    }),

  addField: (field) =>
    set((state) => {
      const isExisting = state.fields.some((item) => item.id === field.id);

      if (isExisting) {
        return {
          fields: state.fields.map((item) =>
            item.id === field.id ? field : item,
          ),
        };
      }

      return {
        fields: [...state.fields, field],
      };
    }),

  editField: (id, updates) =>
    set((state) => ({
      fields: state.fields.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updates,
              id: item.id,
            }
          : item,
      ),
    })),

  removeField: (id) =>
    set((state) => ({
      fields: state.fields.filter((item) => item.id !== id),
    })),

  setLoading: (loading) =>
    set({
      loading,
    }),

  setError: (error) =>
    set({
      error,
    }),

  getFieldById: (id) => get().fields.find((item) => item.id === id),

  clearFields: () =>
    set({
      fields: [],
      loading: false,
      error: null,
    }),
}));

export default useFieldStore;