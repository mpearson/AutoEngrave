import { Template } from "../templates/types";
import { Job, DesignTask, MachineTask, RasterTask } from "./types";
import { Seq } from "immutable";
import { createSelector } from "reselect";
import { RootState } from "../types";
import { clone } from "lodash";

/**
 * Deep clones the provided job, or creates a new one if it is null.
 * @param activeJob
 */
export const getNewJob = (): Job => ({
  name: "Untitled Job",
  tasks: [],
    // groups: [{
    //   name: "Group 1",
    //   globalSettings: {
    //     power: 100,
    //     speed: 100,
    //     dpi: 400,
    //   },
    //   tasks: [],
    // }],
});

export const findNextAvailableSlot = (template: Template, job: Job): number => {
  // const occupiedSlots = Seq(job.groups)
  //   .flatMap(group => group.tasks)
  const occupiedSlots = Seq(job.tasks)
    .map(task => (task as DesignTask).slotIndex)
    .toSet();

  for (let i = 0; i < template.slots.length; i++)
    if (!occupiedSlots.has(i))
      return i;
  return null;
};

const vectorTaskFields: Array<keyof RasterTask> = ["speed", "power"];
const rasterTaskFields: Array<keyof RasterTask> = ["speed", "power", "dpi"];

export const getSharedTaskSettings = createSelector(
  (state: RootState) => state.workspace.activeJob,
  (state: RootState) => state.workspace.selectedTasks,
  (job, selectedTasks) => {
    if (job === null || selectedTasks.isEmpty())
      return null;

    const tasks = selectedTasks.toArray().map(index => job.tasks[index]);
    let sharedTask: MachineTask = clone(tasks[0]);
    let keys;
    switch (sharedTask.type) {
      case "gcode":
        // editing multiple gcode tasks is unsupported
        return tasks.length === 1 ? tasks[0] : null;
      case "vector":
        keys = vectorTaskFields;
        break;
      case "raster":
        keys = rasterTaskFields;
        break;
    }

    for (const task of tasks) {
      if (task.type === sharedTask.type) {
        for (const key of keys) {
          if (sharedTask[key] !== task[key])
            sharedTask[key] = null;
        }
      } else {
        return null;
      }
    }

    return sharedTask;
  }
);
