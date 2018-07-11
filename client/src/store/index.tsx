import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { RootStore } from "../redux/types";
import { rootReducer } from "../redux/reducer";

declare var window: Window & { devToolsExtension: any, __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any };
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store: RootStore = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(thunk),
  ),
);
