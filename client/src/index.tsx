import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Route, Switch } from "react-router";
import { ConnectedRouter } from "react-router-redux";

import { store } from "./store/index";
import { MainPanelConnected } from "./components/MainPanel";

import "./index.less";
import "./normalize.css";

export const app = ReactDOM.render(
  <Provider store={store}>
    <MainPanelConnected />
  </Provider>,
  document.getElementById("root"),
);
