import { APIAction, AsyncAction } from "./../types";
import { Template } from "../templates/types";
import { Job, RasterTask, MachineTask } from "./types";
import { Design } from "../catalog/types";
import { pixelsToMillimeters } from "../catalog/utils";
import { getNewJob, findNextAvailableSlot } from "./utils";

export const SELECT_TEMPLATE = "workspace/SELECT_TEMPLATE";
export const SELECT_MACHINE = "workspace/SELECT_MACHINE";
export const SET_ACTIVE_JOB = "workspace/SET_ACTIVE_JOB";
export const HOVER_ACTIVE_JOB = "workspace/HOVER_ACTIVE_JOB";

export interface WorkspaceAction extends APIAction {
  template?: Template;
  templateID?: number;
  machineID?: number;
  job?: Job;
  taskIndex?: number;
}

export const addDesignToTemplate = (design: Design, slotIndex?: number): AsyncAction => {
  return (dispatch, getState) => {
    const state = getState();
    const { templateID, activeJob } = state.workspace;
    const template = state.templates.items.get(templateID);
    const newJob = getNewJob(activeJob);

    if (slotIndex === undefined) {
      slotIndex = findNextAvailableSlot(template, newJob);
      if (slotIndex === null)
        return;
    }

    const slot = template.slots[slotIndex];

    const width = pixelsToMillimeters(design.width, design.dpi);
    const height = pixelsToMillimeters(design.height, design.dpi);

    let newTask: RasterTask = {
      type: "raster",
      designID: design.id,
      slotIndex,
      x: slot.x + 0.5 * (slot.width - width),
      y: slot.y + 0.5 * (slot.height - height),
      width,
      height,
      dpi: 400,
      power: 100,
      speed: 100,
    };

    const existingSlot = newJob.tasks.findIndex(task => task.type !== "gcode" && task.slotIndex === slotIndex);
    if (existingSlot !== -1)
      newJob.tasks[existingSlot] = newTask;
    else
      newJob.tasks.push(newTask);

    // let existingTask = false;
    // for (const group of newJob.groups) {
    //   const taskIndex = group.tasks.findIndex(task => task.type !== "gcode" && task.slotIndex === slotIndex);
    //   if (taskIndex !== -1) {
    //     existingTask = true;
    //     group.tasks[taskIndex] = newTask;
    //     break;
    //   }
    // }
    // if (!existingTask)
    //   newJob.groups[0].tasks.push(newTask);

    dispatch({ type: SET_ACTIVE_JOB, job: newJob });
  };
};


export const generateGCode = (): AsyncAction => {
  return (dispatch, getState) => {
    const job = getState().workspace.activeJob;
    window.location.href = "/api/job/export?job=" + encodeURIComponent(JSON.stringify(job));
  };
};

// export const generateGCode = (): AsyncPromiseAction => {
//   return (dispatch, getState) => callAPI(dispatch, {
//     endpoint: "job/export",
//     method: "post",
//     data: getState().workspace.activeJob,
//     actionParams: { },
//     onRequest: null,
//     onSuccess: null,
//     onError: null,
//   });
// };

export const updateActiveJobTask = (index: number, task: MachineTask): AsyncAction => {
  return (dispatch, getState) => {
    const job = getState().workspace.activeJob;
    const tasks = [...job.tasks];
    tasks[index] = task;

    dispatch({ type: SET_ACTIVE_JOB, job: { ...job, tasks } });
  };
};

export const removeActiveJobTask = (index: number): AsyncAction => {
  return (dispatch, getState) => {
    const job = getState().workspace.activeJob;
    const tasks = job.tasks.filter((task, i) => i !== index);

    dispatch({ type: SET_ACTIVE_JOB, job: { ...job, tasks } });
  };
};

export const hoverActiveJobTask = (taskIndex: number): WorkspaceAction => ({
  type: HOVER_ACTIVE_JOB,
  taskIndex,
});
