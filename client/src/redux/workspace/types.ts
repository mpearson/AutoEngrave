import { Design } from "../catalog/types";

export interface Job {
  id?: number;
  name: string;
  tasks: MachineTask[];
}

export type MachineTaskType = "gcode" | "vector-cut" | "vector-raster" | "bitmap-raster";

interface MachineTaskBase {
  type: MachineTaskType;
}

interface GCodeTask extends MachineTaskBase {
  type: "gcode";
  commands: string[];
}

interface VectorCutTask extends MachineTaskBase {
  type: "vector-cut";
  design: Design;
  // groups: string[];
}

interface VectorRasterTask extends MachineTaskBase {
  type: "vector-raster";
  design: Design;
  // groups: string[];
}

interface BitmapRasterTask extends MachineTaskBase {
  type: "bitmap-raster";
  design: Design;
}

export type MachineTask = GCodeTask | VectorCutTask | VectorRasterTask | BitmapRasterTask;
