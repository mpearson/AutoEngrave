import { CrudItem } from "../CRUD/types";

export interface Template extends CrudItem {
  name: string;
  notes: string;
  created?: string;
  updated?: string;
  slots: TemplateSlot[];
}

export interface TemplateSlot {
  x: number;
  y: number;
  width: number;
  height: number;
}
