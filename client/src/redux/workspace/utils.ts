import { Template } from "../templates/types";
import { Job, DesignTask } from "./types";
import { cloneDeep } from "lodash";
import { Seq } from "immutable";
/**
 * Deep clones the provided job, or creates a new one if it is null.
 * @param activeJob
 */
export const getNewJob = (activeJob: Job) => {
  if (activeJob)
    return cloneDeep(activeJob);

  return {
    name: "Untitled Job",
    tasks: [],
  };
};

export const findNextAvailableSlot = (template: Template, job: Job): number => {
  const occupiedSlots = Seq(job.tasks).map(task => (task as DesignTask).slotIndex).toSet();

  for (let i = 0; i < template.slots.length; i++)
    if (!occupiedSlots.has(i))
      return i;
  return null;
};
