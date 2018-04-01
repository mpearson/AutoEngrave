import { Dispatch } from "react-redux";
import { RootState } from "../redux/types";
import { Dictionary } from "lodash";

export interface APICallConfig {
  endpoint: string;
  method?: string;
  data?: any;
  actions: string[];
  actionParams?: Dictionary<any>;
}

const jsonHeaders = {
  "Accept": "application/json",
  "Content-Type": "application/json",
};

/**
 * Fancy API wrapper which dispatches the specified request/sucess/error actions,
 * along with response data and optional action params.
 */
export const callAPI = (dispatch: Dispatch<RootState>, config: APICallConfig) => {
  const actionParams = config.actionParams || {};
  const [requestAction, successAction, errorAction] = config.actions;

  if (requestAction)
    dispatch({ type: requestAction, ...actionParams });

  const options: RequestInit = {
    method: config.method || "get",
    headers: jsonHeaders,
  };
  if (config.data)
    options.body = JSON.stringify(config.data);

  return fetch(`/api/${config.endpoint}`, options).then(
    response => response.json().then(
      json => {
        if (response.ok) {
          // good response, valid JSON, so extract the results
          return Promise.resolve(
            dispatch({
              type: successAction,
              results: json.results,
              response,
              ...actionParams,
            })
          );
        } else {
          // bad response, but valid JSON so extract the error message
          return Promise.reject(
            dispatch({
              type: errorAction,
              error: String(json.error),
              response,
              ...actionParams,
            })
          );
        }
      },
      error => response.text().then(
        // response was not valid JSON, so assume the body is an error message
        text => Promise.reject(
          dispatch({
            type: errorAction,
            error: text,
            response,
            ...actionParams,
          })
        )
      )
    ),
    error => Promise.reject(
      // request failed so hard we didn't even get a response
      dispatch({
        type: errorAction,
        error: String(error),
        response: null,
        ...actionParams,
      })
    )
  );
};
