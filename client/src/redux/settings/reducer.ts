import { combineReducers } from "redux";
import {
  Machine, Material, UserPreferences, SettingsState,
  MACHINES_PREFIX, MATERIALS_PREFIX, PREFERENCES_PREFIX
} from "./types";
import { makeReducer } from "../CRUD/reducer";

export const settingsReducer = combineReducers<SettingsState>({
  machines: makeReducer<Machine>(MACHINES_PREFIX),
  materials: makeReducer<Material>(MATERIALS_PREFIX),
  preferences: makeReducer<UserPreferences>(PREFERENCES_PREFIX),
});
