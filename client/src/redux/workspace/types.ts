export interface Job {
  id?: number;
  name: string;
  templateID?: number;
  groups: MachineTaskGroup[];
  tasks: MachineTask[]; // TODO: DELETE! DELETE! DELETE!
}

export interface MachineTaskGroup {
  name: string;
  tasks: MachineTask[];
  globalSettings: DesignSettings;
}

export type MachineTaskType = "gcode" | "vector" | "raster";

export interface MachineTaskBase {
  type: MachineTaskType;
  readonly?: boolean;
}

export interface GCodeTask extends MachineTaskBase {
  type: "gcode";
  commands: string[];
}

export interface DesignSettings {
  power: number;
  speed: number;
  dpi?: number;
}

export interface DesignTask extends MachineTaskBase, DesignSettings {
  type: Exclude<MachineTaskType, "gcode">;
  designID: number;
  slotIndex?: number;
  x: number;
  y: number;
  width: number;
  height: number;
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
