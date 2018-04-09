import { CrudItem } from "../CRUD/types";

export interface Design extends CrudItem {
  name: string;
  description: string;
  width: number;
  height: number;
  dpi: number;
  filetype: string;
  imageData?: string;
  // thumbnail?: string;
  created?: string;
  updated?: string;
}

