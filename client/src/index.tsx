import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "./store/index";
import { MainPanel } from "./components/MainPanel";
import { getConnectionStatus, getPorts } from "./redux/connection/actions";
import { listMachineProfiles, listMaterialProfiles } from "./redux/settings/actions";
import { TEMPLATES_PREFIX, Template } from "./redux/templates/types";
import { MACHINES_PREFIX, Machine } from "./redux/settings/types";
import { SELECT_MACHINE, SELECT_TEMPLATE } from "./redux/workspace/actions";
import { CREATE_SUCCESS } from "./redux/CRUD/actions";
import { listDesigns } from "./redux/catalog/actions";
import { DragDropContextProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

import "./index.less";
import "./normalize.css";

export const app = ReactDOM.render(
  <Provider store={store}>
    <DragDropContextProvider backend={HTML5Backend}>
      <MainPanel />
    </DragDropContextProvider>
  </Provider>,
  document.getElementById("root"),
);

store.dispatch(getPorts()).then(() => store.dispatch(getConnectionStatus()));
store.dispatch(listMachineProfiles());
store.dispatch(listMaterialProfiles());
store.dispatch(listDesigns());

const defaultMachine: Machine = {
  name: "Full Spectrum",
  description: "",
  leftRightAxis: "X",
  frontBackAxis: "Y",
  verticalAxis: "Z",
  rasterScanAxis: "X",
  offsetLeft: 0,
  offsetRight: 510,
  offsetBack: 0,
  offsetFront: 300,
  offsetBottom: 20,
  offsetTop: 0,
  maxVelocityX: 0,
  maxVelocityY: 0,
  maxVelocityZ: 0,
  accelerationX: 0,
  accelerationY: 0,
  accelerationZ: 0,
};

store.dispatch({
  type: MACHINES_PREFIX + "/" + CREATE_SUCCESS,
  item: defaultMachine,
  results: { id: 1000 },
});

const defaultTemplate: Template = {
  name: "Coasters - 8x",
  notes: "",
  slots: [
    { x: 20,  y: 35,  width: 102, height: 102 },
    { x: 132, y: 35,  width: 102, height: 102 },
    { x: 244, y: 35,  width: 102, height: 102 },
    { x: 356, y: 35,  width: 102, height: 102 },
    { x: 20,  y: 147, width: 102, height: 102 },
    { x: 132, y: 147, width: 102, height: 102 },
    { x: 244, y: 147, width: 102, height: 102 },
    { x: 356, y: 147, width: 102, height: 102 },
  ],

};

store.dispatch({
  type: TEMPLATES_PREFIX + "/" + CREATE_SUCCESS,
  item: defaultTemplate,
  results: { id: 1000 },
});
store.dispatch({ type: SELECT_MACHINE, machineID: 1000 });
store.dispatch({ type: SELECT_TEMPLATE, templateID: 1000 });
