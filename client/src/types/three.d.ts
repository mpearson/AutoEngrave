import * as THREEJS from "three";

// for some magical reason, friggin @types/three decided
// they were too good for ol' LineLoopy here
declare module "three" {
  export class LineLoop extends THREEJS.Line { }
}
