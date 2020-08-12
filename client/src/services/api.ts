import { AsyncAction, RootDispatch } from "../redux/types";

export type RequestAction = (actionParams?: any) => AsyncAction;
export type SuccessAction = (results: any, response?: Response, actionParams?: any) => AsyncAction;
export type ErrorAction = (error: any, response?: Response, actionParams?: any) => AsyncAction;

export interface APICallConfig {
  endpoint: string;
  method?: string;
  data?: any;
  onRequest?: string | RequestAction;
  onSuccess?: string | SuccessAction;
  onError?: string | ErrorAction;
  actionParams?: any;
}

const serverUrl = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000';

const jsonHeaders = {
  "Accept": "application/json",
  "Content-Type": "application/json",
};

/**
 * Fancy API wrapper which dispatches the specified request/sucess/error actions,
 * along with response data and optional action params.
 */
export const callAPI = (dispatch: RootDispatch, config: APICallConfig) => {
  const actionParams = config.actionParams || {};
  const { onRequest, onSuccess, onError } = config;

  if (onRequest) {
    if (typeof onRequest === "function")
      dispatch(onRequest(actionParams));
    else
      dispatch({ type: onRequest, ...actionParams });
  }

  const options: RequestInit = {
    method: config.method || "get",
    headers: jsonHeaders,
  };
  if (config.data)
    options.body = JSON.stringify(config.data);

  return fetch(`${serverUrl}/api/${config.endpoint}`, options).then(
    response => {
      if (response.status === 204) {
        // no content expected, ain't no JSON up in here
        return Promise.resolve(dispatch({
          type: onSuccess,
          response,
          ...actionParams,
        }));
      }
      return response.json().then(
        json => {
          if (response.ok) {
            // good response, valid JSON, so extract the results
            if (typeof onSuccess === "function") {
              return Promise.resolve(dispatch(onSuccess(json.results, response, actionParams)));
            } else {
              return Promise.resolve(dispatch({
                type: onSuccess,
                results: json.results,
                response,
                ...actionParams,
              }));
            }
          } else {
            // bad response, but valid JSON so extract the error message
            if (typeof onError === "function") {
              return Promise.reject(dispatch(onError(json.error, response, actionParams)));
            } else {
              return Promise.reject(
                dispatch({
                  type: onError,
                  error: json.error,
                  response,
                  ...actionParams,
                })
              );
            }
          }
        },
        error => {

          // response was not valid JSON
          if (typeof onError === "function") {
            return Promise.reject(dispatch(onError(error, response, actionParams)));
          } else {
            return Promise.reject(dispatch({
              type: onError,
              error,
              response,
              ...actionParams,
            }));
          }
        }
      );
    },
    error => {
      // request failed so hard we didn't even get a response
      if (typeof onError === "function") {
        return Promise.reject(dispatch(onError(error, actionParams)));
      } else {
        return Promise.reject(dispatch({
          type: onError,
          error,
          ...actionParams,
        }));
      }
    }
  );
};
