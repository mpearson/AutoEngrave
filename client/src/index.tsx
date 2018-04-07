import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { store } from "./store/index";
import { MainPanel } from "./components/MainPanel";
import { getConnectionStatus, getPorts } from "./redux/connection/actions";

import "./index.less";
import "./normalize.css";
import { getMachineProfiles, getMaterialProfiles } from './redux/settings/actions';

export const app = ReactDOM.render(
  <Provider store={store}>
    <MainPanel />
  </Provider>,
  document.getElementById("root"),
);

store.dispatch(getPorts()).then(() => store.dispatch(getConnectionStatus()));

store.dispatch(getMachineProfiles());
store.dispatch(getMaterialProfiles());
