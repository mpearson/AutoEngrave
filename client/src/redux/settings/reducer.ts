import * as actions from "./actions";
import { Machine, Material } from "./types";

export type SettingsState = {
  readonly isFetchingMachines: boolean;
  readonly isFetchingMaterials: boolean;
  machines: Machine[];
  materials: Material[];
};

const defaultState: SettingsState = {
  isFetchingMachines: false,
  isFetchingMaterials: false,
  machines: [],
  materials: [],
};

export const consoleReducer = (state = defaultState, action: actions.SettingsAction) => {
  switch (action.type) {
    case actions.GET_MACHINES_REQUEST: {
      return { ...state, isFetchingMachines: true };
    }
    case actions.GET_MACHINES_SUCCESS: {
      return { ...state, isFetchingMachines: false, machines: action.response };
    }
    case actions.GET_MACHINES_ERROR: {
      return { ...state, isFetchingMachines: false };
    }





    case actions.GET_MATERIALS_REQUEST: {
      return { ...state, isFetchingMaterials: true };
    }
    case actions.GET_MATERIALS_SUCCESS: {
      return { ...state, isFetchingMaterials: false, materials: action.response };
    }
    case actions.GET_MATERIALS_ERROR: {
      return { ...state, isFetchingMaterials: false };
    }
    default:
      return state;
  }
};
