import { FieldValue } from "firebase/firestore";
import { TimeAtModel } from "./TimeAtModel";

export interface ChildrenModel {
  id: string;
  fullName: string;
  shortName: string;
  avatar: string;
  birth: string;
  gender: string;
  teacherIds: string[];
  managerIds: string[];
  status?: string;

  createAt: TimeAtModel | FieldValue | number;
  updateAt: TimeAtModel | FieldValue | number;
}
