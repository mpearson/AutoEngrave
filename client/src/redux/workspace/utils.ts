import { Template } from "../templates/types";
import { Job, DesignTask } from "./types";
import { cloneDeep } from "lodash";
import { Seq } from "immutable";
/**
 * Deep clones the provided job, or creates a new one if it is null.
 * @param activeJob
 */
export const getNewJob = (activeJob: Job): Job => {
  if (activeJob)
    return cloneDeep(activeJob);

  return {
    name: "Untitled Job",
    groups: [{
      name: "Group 1",
      globalSettings: {
        power: 100,
        speed: 100,
        dpi: 400,
      },
      tasks: [],
    }],
  };
};

export const findNextAvailableSlot = (template: Template, job: Job): number => {
  const occupiedSlots = Seq(job.groups)
    .flatMap(group => group.tasks)
    .map(task => (task as DesignTask).slotIndex)
    .toSet();

  for (let i = 0; i < template.slots.length; i++)
    if (!occupiedSlots.has(i))
      return i;
  return null;
};
