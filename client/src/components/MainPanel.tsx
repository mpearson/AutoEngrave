import * as React from "react";
import { Dispatch, connect } from "react-redux";
import { RootState } from "../redux/types";
// import { callAPI } from "../services/api";
import { ConsoleConnected } from "./Console";
import { WorkspaceConnected } from "./Workspace";
// import { LoadingSpinner } from "./LoadingSpinner";


export interface MainPanelProps {

}

export const MainPanel: React.SFC<MainPanelProps> = props => {
  return (
    <div>
      <header>
      <h1>AutoEngrave 1.0</h1>
      </header>
      <div id="main-content">
        <ConsoleConnected />
        <WorkspaceConnected />
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => state.console;

const mapDispatchToProps = (dispatch: Dispatch<RootState>) => ({

});


export const MainPanelConnected = connect(mapStateToProps, mapDispatchToProps)(MainPanel);




/*

$(() => {

  portList.on("change", e => selectPort(e.target.value));
  portScanButton.click(scanComPorts);

  consoleSendButton.click(() => {
    consoleSend(consoleInput.val());
    consoleInput.select();
  });

  consoleInput.keydown(e => {
    if(e.which == 13) {
      consoleSend(e.target.value);
      e.target.select();
    }
  }).on("input", e => {
    e.target.value = e.target.value.toUpperCase();
  });

});

 */
