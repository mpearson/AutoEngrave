import { CrudItem, CreateActionCreator, ReadActionCreator, UpdateActionCreator, DeleteActionCreator } from "./types";
import { callAPI } from "../../services/api";

export const CREATE_REQUEST = "CREATE_REQUEST";
export const CREATE_SUCCESS = "CREATE_SUCCESS";
export const CREATE_ERROR   = "CREATE_ERROR";

export const LIST_REQUEST   = "LIST_REQUEST";
export const LIST_RECEIVE   = "LIST_RECEIVE";
export const LIST_ERROR     = "LIST_ERROR";

export const UPDATE_REQUEST = "UPDATE_REQUEST";
export const UPDATE_SUCCESS = "UPDATE_SUCCESS";
export const UPDATE_ERROR   = "UPDATE_ERROR";

export const DELETE_REQUEST = "DELETE_REQUEST";
export const DELETE_SUCCESS = "DELETE_SUCCESS";
export const DELETE_ERROR   = "DELETE_ERROR";

let tempID = -1;
export const getTempID = () => tempID--;

export const makeCreate = <T extends CrudItem>(prefix: string, endpoint?: string): CreateActionCreator<T> => {
  endpoint = endpoint || prefix;
  prefix += "/";
  return (diff: Partial<T>) => {
    return (dispatch, getState) => {
      return callAPI(dispatch, {
        endpoint,
        method: "post",
        data: diff,
        actionParams: { diff, tempID: getTempID() },
        onRequest:  prefix + CREATE_REQUEST,
        onSuccess:  prefix + CREATE_SUCCESS,
        onError:    prefix + CREATE_ERROR,
      });
    };
  };
};

export const makeList = <T extends CrudItem>(prefix: string, endpoint?: string): ReadActionCreator<T> => {
  endpoint = endpoint || prefix;
  prefix += "/";
  return () => {
    return (dispatch, getState) => {
      return callAPI(dispatch, {
        endpoint,
        method: "get",
        onRequest:  prefix + LIST_REQUEST,
        onSuccess:  prefix + LIST_RECEIVE,
        onError:    prefix + LIST_ERROR,
      });
    };
  };
};

export const makeUpdate = <T extends CrudItem>(prefix: string, endpoint?: string): UpdateActionCreator<T> => {
  endpoint = endpoint || prefix;
  prefix += "/";
  return (id: number, diff: Partial<T>) => {
    return (dispatch, getState) => {
      return callAPI(dispatch, {
        endpoint: `${endpoint}/${id}`,
        method: "put",
        data: diff,
        actionParams: { id, diff },
        onRequest:  prefix + UPDATE_REQUEST,
        onSuccess:  prefix + UPDATE_SUCCESS,
        onError:    prefix + UPDATE_ERROR,
      });
    };
  };
};

export const makeDelete = <T extends CrudItem>(prefix: string, endpoint?: string): DeleteActionCreator<T> => {
  endpoint = endpoint || prefix;
  prefix += "/";
  return (id: number) => {
    return (dispatch, getState) => {
      return callAPI(dispatch, {
        endpoint: `${endpoint}/${id}`,
        method: "delete",
        actionParams: { id },
        onRequest:  prefix + DELETE_REQUEST,
        onSuccess:  prefix + DELETE_SUCCESS,
        onError:    prefix + DELETE_ERROR,
      });
    };
  };
};
