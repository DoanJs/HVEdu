// import { create } from 'zustand';
// import { UserModel } from '../models/UserModel';

// interface TeacherState {
//     teachers: UserModel[];
//     loading: boolean;
//     error: string | null;
//     setTeachers: (teachers: UserModel[]) => void;
//     addTeacher: (teacher: UserModel) => void;
//     editTeacher: (id: string, teacher: UserModel) => void
//     removeTeacher: (id: string) => void;
//     clearTeachers: () => void;
// }

// const useTeacherStore = create<TeacherState>((set) => ({
//     teachers: [],
//     loading: false,
//     error: null,

//     setTeachers: (teachers: UserModel[]) => set({ teachers }),
//     addTeacher: (teacher: UserModel) =>
//         set((state: any) => ({ teachers: [...state.teachers, teacher] })),
//     editTeacher: (id: string, teacher: UserModel) =>
//         set((state: any) => {
//             const index = state.teachers.findIndex((item: any) => item.id === id)
//             state.teachers[index] = teacher
//             return ({ teachers: [...state.teachers] })
//         }),
//     removeTeacher: (id: string) =>
//         set((state: any) => ({
//             teachers: state.teachers.filter((item: UserModel) => item.id !== id),
//         })),
//     clearTeachers: () => set({ teachers: [] }),
// }));

// export default useTeacherStore;
import { create } from "zustand";
import { UserModel } from "../models/UserModel";

type TeacherUpdate = Partial<Omit<UserModel, "id">>;

interface TeacherState {
  teachers: UserModel[];
  loading: boolean;
  error: string | null;

  setTeachers: (teachers: UserModel[]) => void;
  addTeacher: (teacher: UserModel) => void;
  editTeacher: (id: string, updates: TeacherUpdate) => void;
  removeTeacher: (id: string) => void;

  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  getTeacherById: (id: string) => UserModel | undefined;
  clearTeachers: () => void;
}

const useTeacherStore = create<TeacherState>((set, get) => ({
  teachers: [],
  loading: false,
  error: null,

  setTeachers: (teachers) =>
    set({
      teachers,
      error: null,
    }),

  addTeacher: (teacher) =>
    set((state) => {
      const isExisting = state.teachers.some(
        (item) => item.id === teacher.id,
      );

      if (isExisting) {
        return {
          teachers: state.teachers.map((item) =>
            item.id === teacher.id ? teacher : item,
          ),
        };
      }

      return {
        teachers: [...state.teachers, teacher],
      };
    }),

  editTeacher: (id, updates) =>
    set((state) => ({
      teachers: state.teachers.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updates,
              id: item.id,
            }
          : item,
      ),
    })),

  removeTeacher: (id) =>
    set((state) => ({
      teachers: state.teachers.filter((item) => item.id !== id),
    })),

  setLoading: (loading) =>
    set({
      loading,
    }),

  setError: (error) =>
    set({
      error,
    }),

  getTeacherById: (id) =>
    get().teachers.find((item) => item.id === id),

  clearTeachers: () =>
    set({
      teachers: [],
      loading: false,
      error: null,
    }),
}));

export default useTeacherStore;