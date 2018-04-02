import * as React from "react";
import { ConsoleConnected } from "./console";
import { WorkspaceConnected } from "./Workspace";
import { ConnectionPanelConnected } from "./connection";

export const MainPanel: React.SFC = props => {
  return (
    <div id="main-wrapper">
      <header>
      <h1>AutoEngrave 1.0</h1>
      <ConnectionPanelConnected />
      </header>
      <div id="main-content">
        <WorkspaceConnected />
        <ConsoleConnected />
      </div>
    </div>
  );
};
