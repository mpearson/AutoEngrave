import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "./store/index";
import { MainPanel } from "./components/MainPanel";
import { getConnectionStatus, getPorts } from "./redux/connection/actions";
import { /* listMachineProfiles, */ listMaterialProfiles } from "./redux/settings/actions";
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
// store.dispatch(listMachineProfiles());
store.dispatch(listMaterialProfiles());
store.dispatch(listDesigns());

const defaultMachine1: Machine = {
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

const defaultMachine2: Machine = {
  name: "Diode Laser",
  description: "",
  leftRightAxis: "X",
  frontBackAxis: "Y",
  verticalAxis: "Z",
  rasterScanAxis: "X",
  offsetLeft: 0,
  offsetRight: 398,
  offsetBack: 0,
  offsetFront: 338,
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
  diff: defaultMachine1,
  results: { id: 1000 },
});

store.dispatch({
  type: MACHINES_PREFIX + "/" + CREATE_SUCCESS,
  diff: defaultMachine2,
  results: { id: 1001 },
});

const defaultTemplate1: Template = {
  name: "Coasters - 8x",
  notes: "",
  slots: [
    { index: 0, x: 20,  y: 35,  width: 102, height: 102 },
    { index: 1, x: 132, y: 35,  width: 102, height: 102 },
    { index: 2, x: 244, y: 35,  width: 102, height: 102 },
    { index: 3, x: 356, y: 35,  width: 102, height: 102 },
    { index: 4, x: 20,  y: 147, width: 102, height: 102 },
    { index: 5, x: 132, y: 147, width: 102, height: 102 },
    { index: 6, x: 244, y: 147, width: 102, height: 102 },
    { index: 7, x: 356, y: 147, width: 102, height: 102 },
  ],
};

// const defaultTemplate2: Template = {
//   name: "Coasters - 9x (old)",
//   notes: "",
//   slots: [
//     { index: 0, x: 9,     y: 9,   width: 102, height: 102 },
//     { index: 1, x: 119,   y: 9,   width: 102, height: 102 },
//     { index: 2, x: 229,   y: 9,   width: 102, height: 102 },
//     { index: 3, x: 9,     y: 119, width: 102, height: 102 },
//     { index: 4, x: 119,   y: 119, width: 102, height: 102 },
//     { index: 5, x: 229,   y: 119, width: 102, height: 102 },
//     { index: 6, x: 9,     y: 229, width: 102, height: 102 },
//     { index: 7, x: 119,   y: 229, width: 102, height: 102 },
//     { index: 8, x: 229,   y: 229, width: 102, height: 102 },
//   ],
// };

const defaultTemplate2: Template = {
  name: "Coasters - 9x",
  notes: "",
  slots: [
    { index: 0, x: 7,     y: 9,   width: 102, height: 102 },
    { index: 1, x: 117,   y: 9,   width: 102, height: 102 },
    { index: 2, x: 227,   y: 9,   width: 102, height: 102 },
    { index: 3, x: 7,     y: 119, width: 102, height: 102 },
    { index: 4, x: 117,   y: 119, width: 102, height: 102 },
    { index: 5, x: 227,   y: 119, width: 102, height: 102 },
    { index: 6, x: 7,     y: 229, width: 102, height: 102 },
    { index: 7, x: 117,   y: 229, width: 102, height: 102 },
    { index: 8, x: 227,   y: 229, width: 102, height: 102 },
  ],

};

store.dispatch({
  type: TEMPLATES_PREFIX + "/" + CREATE_SUCCESS,
  diff: defaultTemplate1,
  results: { id: 1000 },
});

store.dispatch({
  type: TEMPLATES_PREFIX + "/" + CREATE_SUCCESS,
  diff: defaultTemplate2,
  results: { id: 1001 },
});
store.dispatch({ type: SELECT_MACHINE, machineID: 1001 });
store.dispatch({ type: SELECT_TEMPLATE, templateID: 1001 });
