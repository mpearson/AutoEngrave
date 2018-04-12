import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "./store/index";
import { MainPanel } from "./components/MainPanel";
import { getConnectionStatus, getPorts } from "./redux/connection/actions";
import { listMachineProfiles, listMaterialProfiles } from "./redux/settings/actions";
import { listDesigns } from "./redux/catalog/actions";

import "./index.less";
import "./normalize.css";

export const app = ReactDOM.render(
  <Provider store={store}>
    <MainPanel />
  </Provider>,
  document.getElementById("root"),
);

store.dispatch(getPorts()).then(() => store.dispatch(getConnectionStatus()));
store.dispatch(listMachineProfiles());
store.dispatch(listMaterialProfiles());
store.dispatch(listDesigns());
