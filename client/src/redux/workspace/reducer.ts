import * as actions from "./actions";
import { Job, DesignTask } from "./types";

export type WorkspaceState = {
  readonly templateID: number;
  readonly machineID: number;
  readonly activeJob: Job;
  readonly globalDesignSettings: DesignTask;
  readonly hoverTaskIndex: number;
};

const defaultState: WorkspaceState = {
  templateID: null,
  machineID: null,
  activeJob: null,
  globalDesignSettings: null,
  hoverTaskIndex: null,
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
    case actions.HOVER_ACTIVE_JOB: {
      return { ...state, hoverTaskIndex: action.taskIndex };
    }
    default:
      return state;
  }
};
