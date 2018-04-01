declare var window: Window & { devToolsExtension: any, __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any };
import { combineReducers, createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { ConsoleState, consoleReducer } from "../redux/console/reducer";

export type RootState = {
  console: ConsoleState;
};

const rootReducer = combineReducers<RootState>({
  console: consoleReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore<RootState>(
  rootReducer,
  composeEnhancers(
    applyMiddleware(thunk),
  ),
);
