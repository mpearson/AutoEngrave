export interface Job {
  id?: number;
  name: string;
  templateID?: number;
  tasks: MachineTask[];
}

export type MachineTaskType = "gcode" | "vector-cut" | "vector-raster" | "bitmap-raster";

export interface MachineTaskBase {
  type: MachineTaskType;
}

export interface GCodeTask extends MachineTaskBase {
  type: "gcode";
  commands: string[];
}

export interface DesignTask extends MachineTaskBase {
  type: Exclude<MachineTaskType, "gcode">;
  designID: number;
  slotIndex?: number;
  x: number;
  y: number;
  width: number;
  height: number;
  dpi: number;
}

export interface VectorCutTask extends DesignTask {
  type: "vector-cut";
  // groups: string[];
}

export interface VectorRasterTask extends DesignTask {
  type: "vector-raster";
  // groups: string[];
}

export interface BitmapRasterTask extends DesignTask {
  type: "bitmap-raster";
}

export type MachineTask = GCodeTask | DesignTask;
