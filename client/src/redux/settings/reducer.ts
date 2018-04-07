import { combineReducers } from "redux";
import { Machine, Material } from "./types";
import { makeReducer } from "../CRUD/reducer";
import { CrudState } from "../CRUD/types";

export interface SettingsState {
  machines: CrudState<Machine>;
  materials: CrudState<Material>;
}

export const settingsReducer = combineReducers<SettingsState>({
  machines: makeReducer<Machine>("machines"),
  materials: makeReducer<Material>("materials"),
});
