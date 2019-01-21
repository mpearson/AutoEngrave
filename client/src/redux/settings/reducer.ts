import { combineReducers } from "redux";
import { Machine, Material, SettingsState, MACHINES_PREFIX, MATERIALS_PREFIX } from "./types";
import { makeReducer } from "../CRUD/reducer";
import { localSettingsReducer } from "./local/reducer";

export const settingsReducer = combineReducers<SettingsState>({
  machines: makeReducer<Machine>(MACHINES_PREFIX),
  materials: makeReducer<Material>(MATERIALS_PREFIX),
  local: localSettingsReducer,
});
