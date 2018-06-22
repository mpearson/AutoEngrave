import { APIAction, AsyncAction } from "./../types";
import { Template } from "../templates/types";
import { Job, RasterTask, MachineTask } from "./types";
import { pixelsToMillimeters } from "../catalog/utils";
import { getNewJob, findNextAvailableSlot } from "./utils";
import { Set } from "immutable";

export const SELECT_TEMPLATE = "workspace/SELECT_TEMPLATE";
export const SELECT_MACHINE = "workspace/SELECT_MACHINE";
export const SET_ACTIVE_JOB = "workspace/SET_ACTIVE_JOB";
export const HOVER_ACTIVE_JOB = "workspace/HOVER_ACTIVE_JOB";
export const SET_TASK_SELECTION = "workspace/SET_TASK_SELECTION";

export interface WorkspaceAction extends APIAction {
  template?: Template;
  templateID?: number;
  machineID?: number;
  job?: Job;
  taskIndex?: number;
  selectedTasks?: Set<number>;
}

export const addDesignToTemplate = (id: number, slotIndex?: number): AsyncAction<void> => {
  return (dispatch, getState) => {
    const state = getState();
    const { templateID, activeJob } = state.workspace;
    const design = state.catalog.items.get(id);
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

export const updateActiveJobTask = (index: number, task: MachineTask): AsyncAction<void> => {
  return (dispatch, getState) => {
    const job = getState().workspace.activeJob;
    const tasks = [...job.tasks];
    tasks[index] = task;

    dispatch({ type: SET_ACTIVE_JOB, job: { ...job, tasks } });
  };
};

export const removeActiveJobTask = (index: number): AsyncAction<void> => {
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

export const selectTasks = (taskIndex: number, ctrl: boolean, shift: boolean): AsyncAction<void> => {
  return (dispatch, getState) => {
    const state = getState().workspace;
    const { selectedTasks, lastSelectedTask } = state;

    let newSet: Set<number>;

    if (shift) {
      const start = lastSelectedTask === null ? taskIndex : Math.min(taskIndex, lastSelectedTask);
      const end = lastSelectedTask === null ? taskIndex : Math.max(taskIndex, lastSelectedTask);
      let indices: number[] = [];
      for (let i = start; i <= end; i++) {
        indices.push(i);
        newSet = Set(indices);
      }
      taskIndex = lastSelectedTask;
    } else if (ctrl) {
      if (selectedTasks.has(taskIndex)) {
        newSet = selectedTasks.remove(taskIndex);
        taskIndex = null;
      } else {
        newSet = selectedTasks.add(taskIndex);
      }
    } else {
      newSet = Set([taskIndex]);
    }

    dispatch({
      type: SET_TASK_SELECTION,
      selectedTasks: newSet,
      taskIndex,
    });
  };
};
