import { ConsoleState } from "./console/reducer";
import { ThunkAction } from "redux-thunk";
import { Action } from "redux";
import { ConnectionState } from "./connection/reducer";
import { SettingsState } from "./settings/reducer";
import { CrudState } from "./CRUD/types";
import { Design } from "./catalog/types";
import { Template } from "./templates/types";
import { WorkspaceState } from "./workspace/reducer";

export type RootState = {
  catalog: CrudState<Design>;
  connection: ConnectionState;
  console: ConsoleState;
  settings: SettingsState;
  templates: CrudState<Template>;
  workspace: WorkspaceState;
};

export type AsyncAction<T = any> = ThunkAction<T, RootState, void>;
export type AsyncPromiseAction<T = any> = ThunkAction<Promise<T>, RootState, void>;

export interface APIAction extends Action {
  error?: string;
  response?: Response;
  results?: any;
}
