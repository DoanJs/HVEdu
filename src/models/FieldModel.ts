import { TimeAtModel } from "./TimeAtModel";

export interface FieldModel {
  id: string;
  name: string
  desc?: string

  createAt: TimeAtModel | number;
  updateAt: TimeAtModel | number;
}
