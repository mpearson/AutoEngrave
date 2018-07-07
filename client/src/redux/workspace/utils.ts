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
  tasks: [
    {
      type: "gcode",
      commands: ["; startup", "G21", "G90", "M106.1", "M106.2", "M106.3", "M106.4", "G4 P2000", "M3"],
      pin: "start",
    },
    {
      type: "gcode",
      commands: ["; shutdown", "G0", "M5", "M107.2", "M107.3", "M107.4", "G0 X0 Y0", "G4 P2000", "M107.1"],
      pin: "end",
    },
  ],
});

export const findNextTemplateSlot = (template: Template, job: Job): number => {
  const occupiedSlots = Seq(job.tasks)
    .map(task => (task as DesignTask).slotIndex)
    .toSet();

  for (let i = 0; i < template.slots.length; i++)
    if (!occupiedSlots.has(i))
      return i;
  return null;
};

/**
 * @returns index closest to the end where a new task can be inserted.
 * Loops backwards through @param tasks until we find one that isn't pinned to the end.
 */
export const findNextTaskSlot = (tasks: MachineTask[]) => {
  for (let i = tasks.length - 1; i >= 0; i--) {
    if (tasks[i].pin !== "end")
      return i + 1;
  }
  return 0;
};

export const appendNewTask = (tasks: MachineTask[], newTask: MachineTask) => {
  const index = findNextTaskSlot(tasks);
  return [...tasks.slice(0, index), newTask, ...tasks.slice(index)];
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
