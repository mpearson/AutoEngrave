import * as actions from "./actions";

export type WorkspaceState = {
  readonly templateID: number;
  readonly machineID: number;
};

const defaultState: WorkspaceState = {
  templateID: null,
  machineID: null,
};

export const workspaceReducer = (state = defaultState, action: actions.WorkspaceAction): WorkspaceState => {
  switch (action.type) {
    case actions.SELECT_TEMPLATE: {
      return { ...state, templateID: action.templateID };
    }
    default:
      return state;
  }
};
