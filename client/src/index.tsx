import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "./store/index";
import { MainPanel } from "./components/MainPanel";
import { getConnectionStatus, getPorts } from "./redux/connection/actions";
import { listMachineProfiles, listMaterialProfiles } from "./redux/settings/actions";
import { listDesigns } from "./redux/catalog/actions";
import { DragDropContextProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

import "./index.less";
import "./normalize.css";

export const app = ReactDOM.render(
  <DragDropContextProvider backend={HTML5Backend}>
    <Provider store={store}>
      <MainPanel />
    </Provider>
  </DragDropContextProvider>,
  document.getElementById("root"),
);

store.dispatch(getPorts()).then(() => store.dispatch(getConnectionStatus()));
store.dispatch(listMachineProfiles());
store.dispatch(listMaterialProfiles());
store.dispatch(listDesigns());

store.dispatch({
  type: "templates/LIST_RECEIVE",
  results: [{
    id: 1,
    name: "Coasters - 8x",
    notes: "",
    slots: [{
      x: 0,
      y: 0,
      width: 102,
      height: 102,
    }]
  }]
});
