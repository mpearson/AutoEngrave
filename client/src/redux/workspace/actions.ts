import { RestApiAction, AsyncAction } from "./../types";
import { Template } from "../templates/types";
import { Job, MachineTask, DesignTask } from "./types";
import { createTemplateRasterTask, getOccupiedSlots } from "./utils";
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

export interface WorkspaceAction extends RestApiAction {
  template?: Template;
  templateID?: number;
  machineID?: number;
  job?: Job;
  diff?: Partial<MachineTask>;
  taskIndex?: number;
  selectedTasks?: Set<number>;
}

/**
 * Add the specified design to the active job at @param slotIndex.
 * If the slot is already occupied, and replace the existing task.
 */
export const updateTemplateSlot = (id: number, slotIndex: number): AsyncAction<void> => {
  return (dispatch, getState) => {
    const state = getState();
    const { templateID, activeJob } = state.workspace;
    const design = state.catalog.items.get(id);
    const template = state.templates.items.get(templateID);
    if (template === undefined)
      return;

    const newTask = createTemplateRasterTask(template.slots[slotIndex], design);

    const existingSlot = activeJob.tasks.findIndex(task => (task as DesignTask).slotIndex === slotIndex);
    if (existingSlot !== -1)
      dispatch(updateTask(existingSlot, newTask));
    else
      dispatch(appendTask(newTask));
  };
};

/**
 * Adds @param count copies of the design to the first empty slots found in the active job.
 * If there are not enough slots, add as many as we can.
 */
export const addDesignToTemplate = (id: number, count = 1): AsyncAction<void> => {
  return (dispatch, getState) => {
    const state = getState();
    const { templateID, activeJob } = state.workspace;
    const design = state.catalog.items.get(id);
    const template = state.templates.items.get(templateID);
    if (template === undefined)
      return;

    const occupiedSlots = getOccupiedSlots(activeJob);
    const slotCount = template.slots.length;
    for (let index = 0; count > 0 && index < slotCount; index++) {
      if (!occupiedSlots.has(index)) {
        count--;
        const newTask = createTemplateRasterTask(template.slots[index], design);
        dispatch(appendTask(newTask));
      }
    }
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
