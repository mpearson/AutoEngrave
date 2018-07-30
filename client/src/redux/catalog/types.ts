import { CrudItem, CrudState } from "../CRUD/types";

export const CATALOG_PREFIX = "catalog";

export interface CatalogState extends CrudState<Design> {
  selectedID: number;
}

export interface Design extends CrudItem, ImageMetadata {
  name: string;
  description: string;
  // thumbnail?: string;
}

export interface ImageMetadata {
  width: number;
  height: number;
  dpi: number;
  filetype: string;
  imageData?: string;
}
