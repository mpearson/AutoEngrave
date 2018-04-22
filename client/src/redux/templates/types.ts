import { CrudItem } from "../CRUD/types";

export const TEMPLATES_PREFIX = "templates";

export interface Template extends CrudItem {
  name: string;
  notes: string;
  slots: TemplateSlot[];
}

export interface TemplateSlot {
  x: number;
  y: number;
  width: number;
  height: number;
}
