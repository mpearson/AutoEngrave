import { CrudItem } from "../CRUD/types";

export const MACHINES_PREFIX = "machines";
export const MATERIALS_PREFIX = "materials";

export type Axis = "X" | "Y" | "Z";

export interface Machine extends CrudItem {
  name: string;
  description: string;

  leftRightAxis: Axis;
  frontBackAxis: Axis;
  verticalAxis: Axis;
  rasterScanAxis: Axis;

  offsetLeft: number;
  offsetRight: number;
  offsetBack: number;
  offsetFront: number;
  offsetBottom: number;
  offsetTop: number;

  maxVelocityX: number;
  maxVelocityY: number;
  maxVelocityZ: number;

  accelerationX: number;
  accelerationY: number;
  accelerationZ: number;
}

export interface Material extends CrudItem {


}
