import { FieldValue } from "firebase/firestore";
import { TimeAtModel } from "./TimeAtModel";

export interface TargetModel {
  id: string;
  fieldId: string;
  name: string;
  level: number | string;
  levelString: string;
  content?: string;
  order: number;
  title?: string

  createAt: TimeAtModel | FieldValue | number;
  updateAt: TimeAtModel | FieldValue | number;
}
