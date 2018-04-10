import { CrudItem } from "../CRUD/types";

export interface Design extends CrudItem, ImageMetadata {
  name: string;
  description: string;
  // thumbnail?: string;
  created?: string;
  updated?: string;
}

export interface ImageMetadata {
  width: number;
  height: number;
  dpi: number;
  filetype: string;
  imageData?: string;
}
