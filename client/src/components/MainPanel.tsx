import * as React from "react";
import { ConsoleConnected } from "./console";
import { WorkspaceConnected } from "./workspace";
import { ConnectionPanelConnected } from "./connection";
import { CatalogPanelConnected } from "./catalog";

export class MainPanel extends React.Component {
  private onDragStart = (e: DragEvent) => {
    e.preventDefault();
    document.querySelector("body").classList.add("drag-active");
  }
  private onDragEnd = (e: DragEvent) => {
    e.preventDefault();
    document.querySelector("body").classList.remove("drag-active");
  }

  public componentDidMount() {
    const body = document.querySelector("body");
    document.addEventListener("dragover", this.onDragStart);
    document.addEventListener("dragleave", this.onDragEnd);
    document.addEventListener("drop", this.onDragEnd);
  }

  public render() {
    return (
      <div id="main-wrapper">
        <header>
        <h1>AutoEngrave 1.0</h1>
        <ConnectionPanelConnected />
        </header>
        <div id="main-content">
          <CatalogPanelConnected />
          <WorkspaceConnected />
          <ConsoleConnected />
        </div>
      </div>
    );
  };
}
