import { combineReducers } from "redux";
import { Machine, Material } from "./types";
import { createCrudReducer } from "../CRUD/reducer";
import { CrudState } from "../CRUD/types";

export interface SettingsState {
  machines: CrudState<Machine>;
  materials: CrudState<Material>;
}

export const settingsReducer = combineReducers<SettingsState>({
  machines: createCrudReducer<Machine>("machines"),
  materials: createCrudReducer<Material>("materials"),
});
