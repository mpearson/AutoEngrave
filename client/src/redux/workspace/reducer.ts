import * as actions from "./actions";
import { MachineTask, WorkspaceState } from "./types";
import { Set } from "immutable";
import { getNewJob, appendNewTask } from "./utils";

const defaultState: WorkspaceState = {
  templateID: null,
  machineID: null,
  activeJob: getNewJob(),
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
      const tasks = appendNewTask(activeJob.tasks, action.diff as MachineTask);
      return { ...state, activeJob: { ...activeJob, tasks } };
    }
    case actions.UPDATE_TASK: {
      const { activeJob } = state;
      const { taskIndex, diff } = action;
      const tasks = [...activeJob.tasks];
      const newTask = { ...tasks[taskIndex], ...diff } as MachineTask;
      tasks[taskIndex] = newTask;
      return { ...state, activeJob: { ...activeJob, tasks } };
    }
    case actions.UPDATE_SELECTED_TASKS: {
      const { activeJob, selectedTasks } = state;
      const tasks = activeJob.tasks.map((task, index) => {
        if (selectedTasks.has(index))
          return { ...task, ...action.diff } as MachineTask;
        else
          return task;
      });
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
