import { AsyncPromiseAction, APIAction } from "./../types";
import { callAPI } from "../../services/api";
import { ConsoleEntryType } from "./types";

export const ADD_CONSOLE_ENTRY = "console/ADD_CONSOLE_ENTRY";

export const SEND_REQUEST = "console/SEND_REQUEST";
export const SEND_SUCCESS = "console/SEND_SUCCESS";
export const SEND_ERROR = "console/SEND_ERROR";

export interface ConsoleAction extends APIAction {
  command?: string;
  entryType?: ConsoleEntryType;
}

export const sendCommand = (command: string): AsyncPromiseAction<ConsoleAction> => {
  return (dispatch, getState) => callAPI(dispatch, {
    endpoint: "console/send",
    method: "post",
    data: { command },
    actionParams: { command },
    onRequest: SEND_REQUEST,
    onSuccess: SEND_SUCCESS,
    onError: SEND_ERROR,
  });
};
