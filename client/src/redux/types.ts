import { ConsoleState } from "./console/reducer";
import { ThunkAction } from "redux-thunk";
import { Action } from "redux";
import { ConnectionState } from "./connection/reducer";

export type RootState = {
  connection: ConnectionState;
  console: ConsoleState;
};

export type AsyncAction<T = any> = ThunkAction<T, RootState, void>;
export type AsyncPromiseAction<T = any> = ThunkAction<Promise<T>, RootState, void>;

export interface APIAction extends Action {
  error?: string;
  response?: Response;
  results?: any;
}
