import { AsyncPromiseAction, APIAction } from "./../types";
import { ComPort, ConnectionStatus } from "./types";
import { callAPI } from "../../services/api";

export const GET_PORTS_REQUEST = "connection/GET_PORTS_REQUEST";
export const GET_PORTS_RECEIVE = "connection/GET_PORTS_RECEIVE";
export const GET_PORTS_ERROR = "connection/GET_PORTS_ERROR";

export const SELECT_PORT = "connection/SELECT_PORT";
export const SELECT_BAUDRATE = "connection/SELECT_BAUDRATE";

export const CONNECT_REQUEST = "connection/CONNECT_REQUEST";
export const CONNECT_SUCCESS = "connection/CONNECT_SUCCESS";
export const CONNECT_ERROR = "connection/CONNECT_ERROR";

export const DISCONNECT_REQUEST = "connection/DISCONNECT_REQUEST";
export const DISCONNECT_SUCCESS = "connection/DISCONNECT_SUCCESS";
export const DISCONNECT_ERROR = "connection/DISCONNECT_ERROR";

export const GET_STATUS_REQUEST = "connection/GET_STATUS_REQUEST";
export const GET_STATUS_SUCCESS = "connection/GET_STATUS_SUCCESS";
export const GET_STATUS_ERROR = "connection/GET_STATUS_ERROR";

export interface ConnectionAction extends APIAction {
  port?: ComPort;
  baudrate?: string;
  status?: ConnectionStatus;
}

export const getPorts = (): AsyncPromiseAction<ConnectionAction> => {
  return (dispatch, getState) => {
    return callAPI(dispatch, {
      endpoint: "connection/scan",
      method: "get",
      actions: [GET_PORTS_REQUEST, GET_PORTS_RECEIVE, GET_PORTS_ERROR],
    });
  };
};

export const openConnection = (): AsyncPromiseAction<ConnectionAction> => {
  return (dispatch, getState) => {
    const { port, baudrate } = getState().connection;

    return callAPI(dispatch, {
      endpoint: "connection/open",
      method: "post",
      data: { port, baudrate },
      actions: [CONNECT_REQUEST, CONNECT_SUCCESS, CONNECT_ERROR],
    });
  };
};

export const closeConnection = (): AsyncPromiseAction<ConnectionAction> => {
  return (dispatch, getState) => {
    return callAPI(dispatch, {
      endpoint: "connection/close",
      method: "post",
      actions: [DISCONNECT_REQUEST, DISCONNECT_SUCCESS, DISCONNECT_ERROR],
    });
  };
};
