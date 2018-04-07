import { CrudItem } from "../CRUD/types";

export interface Design extends CrudItem {
  name: string;
  description: string;
  filetype: string;
  file: string;
  created: string;
  updated: string;
}
