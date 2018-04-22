import { combineReducers } from "redux";
import { Machine, Material, MACHINES_PREFIX, MATERIALS_PREFIX } from "./types";
import { makeReducer } from "../CRUD/reducer";
import { CrudState } from "../CRUD/types";

export interface SettingsState {
  machines: CrudState<Machine>;
  materials: CrudState<Material>;
}

export const settingsReducer = combineReducers<SettingsState>({
  machines: makeReducer<Machine>(MACHINES_PREFIX),
  materials: makeReducer<Material>(MATERIALS_PREFIX),
});
