import { Action } from "redux";
import { ComPort } from "../../connection/types";

export interface LocalSettingsAction extends Action {
  settings?: LocalSettingsState;
  key?: keyof LocalSettingsState;
  value?: any;
}


export interface WorkspaceSettings {
  lastMachine?: number;
  lastMaterial?: number;
  lastTemplate?: number;
  lastPower?: number;
  lastSpeed?: number;
  lastDpi?: number;
  invertZoom?: boolean;
}

export interface ConnectionSettings {
  port?: ComPort;
  baudrate?: string;
}

export interface LocalSettingsState {
  workspace: WorkspaceSettings;
  connection: ConnectionSettings;
}
