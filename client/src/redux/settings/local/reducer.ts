import { Reducer } from "redux";
import * as _ from "lodash";

import {LocalSettingsState, LocalSettingsAction} from "./types";
import * as actions from "./actions";
import { SELECT_MACHINE, WorkspaceAction, SELECT_TEMPLATE } from "../../workspace/actions";
import { SELECT_PORT, SELECT_BAUDRATE, ConnectionAction } from "../../connection/actions";



export const getInitialState = (): LocalSettingsState => ({
  connection: {},
  workspace: {},
});

const update = (state: LocalSettingsState, path: string[], value: any) => _.set(_.clone(state), path, value);

export const localSettingsReducer: Reducer<LocalSettingsState, LocalSettingsAction> = (
  state = getInitialState(),
  action
) => {
  switch (action.type) {
    case actions.LOCAL_SETTINGS_LOAD: {
      return action.settings;
    }
    // case actions.LOCAL_SETTINGS_UPDATE_KEY: {
    //   return {
    //     ...state,
    //     [action.key]: action.value,
    //   };
    // }
    case SELECT_MACHINE: {
      return update(state, ["workspace", "lastMachine"], (action as WorkspaceAction).machineID);
    }
    case SELECT_TEMPLATE: {
      return update(state, ["workspace", "lastTemplate"], (action as WorkspaceAction).templateID);
    }
    case SELECT_PORT: {
      return update(state, ["connection", "lastPort"], (action as ConnectionAction).port);
    }
    case SELECT_BAUDRATE: {
      return update(state, ["connection", "lastBaudrate"], (action as ConnectionAction).baudrate);
    }
    default:
      return state;
  }
};
