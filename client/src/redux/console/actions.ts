import { AsyncPromiseAction, APIAction } from "./../types";
import { callAPI } from "../../services/api";

export const ADD_CONSOLE_ENTRY = "console/ADD_CONSOLE_ENTRY";

export const SEND_REQUEST = "console/SEND_REQUEST";
export const SEND_SUCCESS = "console/SEND_SUCCESS";
export const SEND_ERROR = "console/SEND_ERROR";

export interface ConsoleAction extends APIAction {
  command?: string;
}

export const sendCommand = (command: string): AsyncPromiseAction<ConsoleAction> => {
  return (dispatch, getState) => {
    return callAPI(dispatch, {
      endpoint: "console/send",
      method: "post",
      data: { command },
      actionParams: { command },
      actions: [SEND_REQUEST, SEND_SUCCESS, SEND_ERROR],
    });
  };
};
