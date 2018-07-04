import { Template } from "../templates/types";
import { Job, DesignTask, MachineTask } from "./types";
import { Seq } from "immutable";
import { createSelector } from "reselect";
import { RootState } from "../types";
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

export const getSharedTaskSettings = createSelector(
  (state: RootState) => state.workspace.activeJob,
  (state: RootState) => state.workspace.selectedTasks,
  (job, selectedTasks) => {
    if (job === null || selectedTasks.isEmpty())
      return null;

    const tasks = selectedTasks.toArray().map(index => job.tasks[index]);
    const type = tasks[0].type;

    // editing multiple gcode tasks is unsupported
    if (type === "gcode") {
      if (tasks.length === 1)
        return tasks[0];
      else
        return null;
    }

    let sharedTask: MachineTask = null;

    for (const task of tasks) {
      if (task.type !== type)
        return null;

      if (sharedTask === null || sharedTask.type === task.type) {

      }
      // if (task.type === "gcode") {
      // }


    }

    return sharedTask;
  }
);
