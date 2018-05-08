import * as React from "react";
import { ConsoleConnected } from "./console/Console";
import { WorkspaceConnected } from "./workspace/Workspace";
import { ConnectionPanelConnected } from "./connection/ConnectionPanel";
import { MachinePanelConnected } from "./machine/MachinePanel";
import { CatalogPanelConnected } from "./catalog/CatalogPanel";

import "./main-panel.less";

export const MainPanel: React.SFC = props => (
  <div className="main-wrapper">
    <header className="main-header">
      <h1>AutoEngrave 1.0</h1>
      <ConnectionPanelConnected />
      <MachinePanelConnected />
    </header>
    <div className="main-content">
      <section className="left-column">
        <CatalogPanelConnected />
      </section>
      <section className="center-column">
        <WorkspaceConnected />
      </section>
      <section className="right-column">
        <ConsoleConnected />
      </section>
    </div>
  </div>
);
