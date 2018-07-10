import { APIAction, AsyncAction } from "./../types";
import { Template } from "../templates/types";
import { Job, RasterTask, MachineTask } from "./types";
import { pixelsToMillimeters } from "../catalog/utils";
import { findNextTemplateSlot } from "./utils";
import { Set } from "immutable";

export const SELECT_TEMPLATE = "workspace/SELECT_TEMPLATE";
export const SELECT_MACHINE = "workspace/SELECT_MACHINE";
export const SET_ACTIVE_JOB = "workspace/SET_ACTIVE_JOB";
export const HOVER_TASK = "workspace/HOVER_TASK";
export const SET_TASK_SELECTION = "workspace/SET_TASK_SELECTION";
export const APPEND_NEW_TASK = "workspace/APPEND_NEW_TASK";
export const UPDATE_TASK = "workspace/UPDATE_TASK";
export const UPDATE_SELECTED_TASKS = "workspace/UPDATE_SELECTED_TASKS";
export const DELETE_TASK = "workspace/DELETE_TASK";

export interface WorkspaceAction extends APIAction {
  template?: Template;
  templateID?: number;
  machineID?: number;
  job?: Job;
  diff?: Partial<MachineTask>;
  taskIndex?: number;
  selectedTasks?: Set<number>;
}

export const addDesignToTemplate = (id: number, slotIndex?: number): AsyncAction<void> => {
  return (dispatch, getState) => {
    const state = getState();
    const { templateID, activeJob } = state.workspace;
    const design = state.catalog.items.get(id);
    const template = state.templates.items.get(templateID);
    if (template === undefined)
      return;

    if (slotIndex === undefined) {
      slotIndex = findNextTemplateSlot(template, activeJob);
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
      dpi: 300,
      power: 100,
      speed: 14,
    };

    const existingSlot = activeJob.tasks.findIndex(task => task.type !== "gcode" && task.slotIndex === slotIndex);
    if (existingSlot !== -1)
      dispatch(updateTask(existingSlot, newTask));
    else
      dispatch(appendTask(newTask));
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

export const appendTask = (diff: MachineTask): WorkspaceAction => ({
  type: APPEND_NEW_TASK,
  diff,
});

export const updateTask = (taskIndex: number, diff: Partial<MachineTask>): WorkspaceAction => ({
  type: UPDATE_TASK,
  taskIndex,
  diff,
});

export const updateSelectedTasks = (diff: Partial<MachineTask>): WorkspaceAction => ({
  type: UPDATE_SELECTED_TASKS,
  diff,
});

export const deleteTask = (taskIndex: number): WorkspaceAction => ({
  type: DELETE_TASK,
  taskIndex,
});

export const hoverTask = (taskIndex: number): WorkspaceAction => ({
  type: HOVER_TASK,
  taskIndex,
});

export const setTaskSelection = (selectedTasks: Set<number>): WorkspaceAction => ({
    type: SET_TASK_SELECTION,
    selectedTasks,
});

export const moveTasks = (sourceIndices: number[], destIndex: number): AsyncAction<void> => {
  return (dispatch, getState) => {
    const job = getState().workspace.activeJob;
    const tasks = [...job.tasks];
    // TODO: all the things

    dispatch({ type: SET_ACTIVE_JOB, job: { ...job, tasks } });
  };
};
