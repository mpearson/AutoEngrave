import { AsyncPromiseAction, APIAction } from "./../types";
import { ComPort, ConnectionStatus } from "./types";
import { callAPI } from "../../services/api";

import { ADD_CONSOLE_ENTRY } from "../console/actions";

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

export const getConnectionStatus = (): AsyncPromiseAction<ConnectionAction> => (dispatch, getState) => {
  return callAPI(dispatch, {
    endpoint: "connection/status",
    method: "get",
    onRequest: GET_STATUS_REQUEST,
    onSuccess: GET_STATUS_SUCCESS,
    onError: GET_STATUS_ERROR,
  });
};

export const getPorts = (): AsyncPromiseAction<ConnectionAction> => (dispatch, getState) => {
  return callAPI(dispatch, {
    endpoint: "connection/scan",
    method: "get",
    onRequest: GET_PORTS_REQUEST,
    onSuccess: GET_PORTS_RECEIVE,
    onError: GET_PORTS_ERROR,
  });
};

export const openConnection = (): AsyncPromiseAction<ConnectionAction> => (dispatch, getState) => {
  const { port, baudrate } = getState().connection;

  return callAPI(dispatch, {
    endpoint: "connection/open",
    method: "post",
    data: { port, baudrate },
    onRequest: CONNECT_REQUEST,
    onSuccess: (actionParams: any) => {
      return () => {
        dispatch({ type: CONNECT_SUCCESS });
        dispatch({ type: ADD_CONSOLE_ENTRY, command: `Connected to ${port}.`, entryClass: "response"});
        return Promise.resolve();
      };
    },
    onError: CONNECT_ERROR,
  });
};

export const closeConnection = (): AsyncPromiseAction<ConnectionAction> => (dispatch, getState) => {
    return callAPI(dispatch, {
    endpoint: "connection/close",
    method: "post",
    onRequest: DISCONNECT_REQUEST,
    onSuccess: () => {
      return () => {
        dispatch({ type: DISCONNECT_SUCCESS });
        dispatch({ type: ADD_CONSOLE_ENTRY, command: "Disconnected.", entryClass: "response"});
        return Promise.resolve();
      };
    },
    onError: DISCONNECT_ERROR,
  });
};
