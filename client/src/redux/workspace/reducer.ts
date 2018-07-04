import * as actions from "./actions";
import { Job, DesignTask } from "./types";
import { Set } from "immutable";

export type WorkspaceState = {
  readonly templateID: number;
  readonly machineID: number;
  readonly activeJob: Job;
  readonly globalDesignSettings: DesignTask;
  readonly hoverTaskIndex: number;
  readonly selectedTasks: Set<number>;
};

const defaultState: WorkspaceState = {
  templateID: null,
  machineID: null,
  activeJob: null,
  globalDesignSettings: null,
  hoverTaskIndex: null,
  selectedTasks: Set(),
};

export const workspaceReducer = (state = defaultState, action: actions.WorkspaceAction): WorkspaceState => {
  switch (action.type) {
    case actions.SELECT_TEMPLATE: {
      return { ...state, templateID: action.templateID };
    }
    case actions.SELECT_MACHINE: {
      return { ...state, machineID: action.machineID };
    }
    case actions.SET_ACTIVE_JOB: {
      return { ...state, activeJob: action.job };
    }
    case actions.HOVER_TASK: {
      return { ...state, hoverTaskIndex: action.taskIndex };
    }
    case actions.SET_TASK_SELECTION: {
      return { ...state, selectedTasks: action.selectedTasks };
    }
    case actions.APPEND_NEW_TASK: {
      const { activeJob } = state;
      const { task } = action;
      return { ...state, activeJob: { ...activeJob, tasks: [...activeJob.tasks, task] } };
    }
    case actions.UPDATE_TASK: {
      const { activeJob } = state;
      const { taskIndex, task } = action;
      const tasks = [...activeJob.tasks];
      tasks[taskIndex] = task;
      return { ...state, activeJob: { ...activeJob, tasks } };
    }
    case actions.DELETE_TASK: {
      const { activeJob, selectedTasks } = state;
      const { taskIndex } = action;
      const tasks = [...activeJob.tasks.slice(0, taskIndex), ...activeJob.tasks.slice(taskIndex + 1)];
      return {
        ...state,
        activeJob: { ...activeJob, tasks },
        selectedTasks: selectedTasks.delete(taskIndex),
      };
    }
    default: {
      return state;
    }
  }
};
