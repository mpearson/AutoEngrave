import { AsyncPromiseAction } from "./../types";
import { Action } from "redux";
import { ComPort } from "./types";
import { callAPI } from "../../services/api";

export const PORT_SCAN_REQUEST = "console/PORT_SCAN_REQUEST";
export const PORT_SCAN_RECEIVE = "console/PORT_SCAN_RECEIVE";
export const PORT_SCAN_ERROR = "console/PORT_SCAN_ERROR";

export const SELECT_PORT = "console/SELECT_PORT";

export const CONNECT_REQUEST = "console/CONNECT_REQUEST";
export const CONNECT_SUCCESS = "console/CONNECT_SUCCESS";
export const CONNECT_ERROR = "console/CONNECT_ERROR";

export const SEND_REQUEST = "console/SEND_REQUEST";
export const SEND_SUCCESS = "console/SEND_SUCCESS";
export const SEND_ERROR = "console/SEND_ERROR";

export interface ConsoleAction extends Action {
  error?: string;
  command?: string;
  response?: Response;
  results?: any;
}

export const scanComPorts = (): AsyncPromiseAction<ConsoleAction> => {
  return (dispatch, getState) => {
    return callAPI(dispatch, {
      endpoint: "connection/scan",
      method: "get",
      actions: [PORT_SCAN_REQUEST, PORT_SCAN_RECEIVE, PORT_SCAN_ERROR],
    });
  };
};

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
