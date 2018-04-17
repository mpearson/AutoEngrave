import { combineReducers } from "redux";
import { RootState } from "../redux/types";
import { catalogReducer } from "./catalog/reducer";
import { connectionReducer } from "../redux/connection/reducer";
import { consoleReducer } from "../redux/console/reducer";
import { settingsReducer } from "./settings/reducer";
import { templatesReducer } from "./templates/reducer";
import { workspaceReducer } from "./workspace/reducer";

export const rootReducer = combineReducers<RootState>({
  catalog: catalogReducer,
  connection: connectionReducer,
  console: consoleReducer,
  settings: settingsReducer,
  templates: templatesReducer,
  workspace: workspaceReducer,
});
