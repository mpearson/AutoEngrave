import { combineReducers } from "redux";
import { connectionReducer } from "../redux/connection/reducer";
import { consoleReducer } from "../redux/console/reducer";
import { RootState } from "../redux/types";
import { settingsReducer } from "./settings/reducer";
import { catalogReducer } from "./catalog/reducer";

export const rootReducer = combineReducers<RootState>({
  catalog: catalogReducer,
  connection: connectionReducer,
  console: consoleReducer,
  settings: settingsReducer,
});
