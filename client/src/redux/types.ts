import { ConsoleState } from "./console/reducer";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { Action, AnyAction, Store } from "redux";
import { ConnectionState } from "./connection/reducer";
import { SettingsState } from "./settings/reducer";
import { CrudState } from "./CRUD/types";
import { Template } from "./templates/types";
import { WorkspaceState } from "./workspace/reducer";
import { CatalogState } from "./catalog/reducer";

export interface RootState {
  catalog: CatalogState;
  connection: ConnectionState;
  console: ConsoleState;
  settings: SettingsState;
  templates: CrudState<Template>;
  workspace: WorkspaceState;
}

export type AsyncAction<T = any> = ThunkAction<T, RootState, void, AnyAction>;
export type AsyncPromiseAction<T = any> = ThunkAction<Promise<T>, RootState, void, AnyAction>;

export interface APIAction extends Action {
  error?: string;
  response?: Response;
  results?: any;
}

export type RootDispatch = ThunkDispatch<RootState, void, AnyAction>;

export interface RootStore extends Store<RootState, AnyAction> {
  dispatch: RootDispatch;
}
