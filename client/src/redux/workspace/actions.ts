import { APIAction, AsyncAction } from "./../types";
import { Template } from "../templates/types";
import { Job, DesignTask } from "./types";
import { Design } from "../catalog/types";
import { cloneDeep } from "lodash";
import { pixelsToMillimeters } from "../catalog/utils";

export const SELECT_TEMPLATE = "workspace/SELECT_TEMPLATE";
export const SELECT_MACHINE = "workspace/SELECT_MACHINE";
export const SET_ACTIVE_JOB = "workspace/SET_ACTIVE_JOB";

export interface WorkspaceAction extends APIAction {
  template?: Template;
  templateID?: number;
  machineID?: number;
  job?: Job;
}

/**
 * Deep clones the provided job, or creates a new one if it is null.
 * @param activeJob
 */
const getNewJob = (activeJob: Job) => {
  if (activeJob)
    return cloneDeep(activeJob);

  return {
    name: "Untitled Job",
    tasks: [],
  };
};

export const addDesignToTemplate = (design: Design, slotIndex: number): AsyncAction => {
  return (dispatch, getState) => {
    const state = getState();
    const { templateID, activeJob } = state.workspace;
    const template = state.templates.items.get(templateID);
    const newJob = getNewJob(activeJob);

    const slot = template.slots[slotIndex];

    const width = pixelsToMillimeters(design.width, design.dpi);
    const height = pixelsToMillimeters(design.height, design.dpi);

    let newTask: DesignTask = {
      type: design.filetype === "image/svg+xml" ? "vector-raster" : "bitmap-raster",
      designID: design.id,
      slotIndex,
      x: slot.x + 0.5 * (slot.width - width),
      y: slot.y + 0.5 * (slot.height - height),
      width,
      height,
      dpi: 400,
    };

    const existingTaskIndex = newJob.tasks.findIndex(task => task.slotIndex === slotIndex);
    if (existingTaskIndex !== -1)
      newJob.tasks[existingTaskIndex] = newTask;
    else
      newJob.tasks.push(newTask);

    dispatch({ type: SET_ACTIVE_JOB, job: newJob });
  };
};
