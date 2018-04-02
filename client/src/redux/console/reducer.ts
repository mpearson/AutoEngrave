import * as actions from "./actions";
import { ConsoleEntry } from "./types";

export type ConsoleState = {
  readonly entries: ConsoleEntry[];
  readonly sendFetching: boolean;
};

const defaultState: ConsoleState = {
  sendFetching: false,
  entries: [],
};

export const consoleReducer = (state = defaultState, action: actions.ConsoleAction) => {
  switch (action.type) {
    case actions.SEND_REQUEST: {
      return {
        ...state,
        sendFetching: true,
        entries: [...state.entries, { text: action.command, type: "command" }],
      };
    }
    case actions.SEND_SUCCESS: {
      let entries = state.entries;
      if (action.results)
        entries = [...state.entries, { text: action.results, type: "response" }];
      return {
        ...state,
        sendFetching: false,
        entries,
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
