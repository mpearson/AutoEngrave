import { AsyncPromiseAction, APIAction } from "./../types";
import { callAPI } from "../../services/api";

export const GET_MACHINES_REQUEST = "settings/GET_MACHINES_REQUEST";
export const GET_MACHINES_SUCCESS = "settings/GET_MACHINES_SUCCESS";
export const GET_MACHINES_ERROR = "settings/GET_MACHISES_ERROR";

export const GET_MATERIALS_REQUEST = "settings/GET_MATERIALS_REQUEST";
export const GET_MATERIALS_SUCCESS = "settings/GET_MATERIALS_SUCCESS";
export const GET_MATERIALS_ERROR = "settings/GET_MATERIALS_ERROR";

export interface SettingsAction extends APIAction {
  // command?: string;
}

export const getMachineProfiles = (): AsyncPromiseAction<SettingsAction> => {
  return (dispatch, getState) => {
    return callAPI(dispatch, {
      endpoint: "settings/machines",
      method: "get",
      onRequest: GET_MACHINES_REQUEST,
      onSuccess: GET_MACHINES_SUCCESS,
      onError: GET_MACHINES_ERROR,
    });
  };
};

export const getMaterialProfiles = (): AsyncPromiseAction<SettingsAction> => {
  return (dispatch, getState) => {
    return callAPI(dispatch, {
      endpoint: "settings/materials",
      method: "get",
      onRequest: GET_MATERIALS_REQUEST,
      onSuccess: GET_MATERIALS_SUCCESS,
      onError: GET_MATERIALS_ERROR,
    });
  };
};
