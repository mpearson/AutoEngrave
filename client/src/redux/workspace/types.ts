export interface Job {
  id?: number;
  name: string;
  templateID?: number;
  tasks: MachineTask[];
}

export type MachineTaskType = "gcode" | "vector" | "raster";

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
  power: number;
  speed: number;
}

export interface VectorTask extends DesignTask {
  type: "vector";
  // groups: string[];
}

export interface RasterTask extends DesignTask {
  type: "raster";
  // groups: string[];
  dpi: number;
}


export type MachineTask = GCodeTask | DesignTask;
