import * as actions from "./actions";
import { ComPort, ConsoleEntry, ConsoleEntryType } from "./types";

export type ConsoleState = {
  readonly ports: ComPort[];
  readonly portScanFetching: boolean;
  readonly entries: ConsoleEntry[];
  readonly sendFetching: boolean;
};

const defaultState: ConsoleState = {
  ports: [],
  portScanFetching: false,
  sendFetching: false,
  entries: [],
};

export const consoleReducer = (state = defaultState, action: actions.ConsoleAction) => {
  switch (action.type) {
    case actions.PORT_SCAN_REQUEST: {
      return {
        ...state,
        portScanFetching: true,
      };
    }
    case actions.PORT_SCAN_RECEIVE: {
      return {
        ...state,
        ports: action.results,
        portScanFetching: false,
      };
    }
    case actions.PORT_SCAN_ERROR: {
      return {
        ...state,
        ports: [],
        portScanFetching: false,
        entries: [...state.entries, { text: action.error, type: "error" }],
      };
    }
    case actions.SEND_REQUEST: {
      return {
        ...state,
        sendFetching: true,
        entries: [...state.entries, { text: action.command, type: "command" }],
      };
    }
    case actions.SEND_SUCCESS: {
      return {
        ...state,
        sendFetching: false,
      };
    }
    case actions.SEND_ERROR: {
      return {
        ...state,
        sendFetching: false,
        entries: [...state.entries, { text: action.error, type: "error" }],
      };
    }
    default:
      return state;
  }
};
