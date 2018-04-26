import * as actions from "./actions";
import { Job } from "./types";

export type WorkspaceState = {
  readonly templateID: number;
  readonly machineID: number;
  readonly activeJob: Job;
};

const defaultState: WorkspaceState = {
  templateID: null,
  machineID: null,
  activeJob: null,
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
    default:
      return state;
  }
};
