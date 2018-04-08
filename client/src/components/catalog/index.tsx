import * as React from "react";
import { RootState } from "../../redux/types";
import { Dispatch, connect } from "react-redux";

import "./index.less";

export interface CatalogPanelProps {
  // dispatch: Dispatch<RootState>;
  // scanComPorts: () => Promise<actions.ConsoleAction>;
  // sendCommand: (command: string) => Promise<actions.ConsoleAction>;
}

export interface CatalogPanelState {
  dragHover: boolean;
}

export class CatalogPanel extends React.Component<CatalogPanelProps, CatalogPanelState> {
  constructor(props: CatalogPanelProps) {
    super(props);
    this.state = {
      dragHover: false,
    };
  }

  private onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    this.setState({ dragHover: false });
    // e.dataTransfer
    console.log(e.dataTransfer);
  }

  private onDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    this.setState({ dragHover: true });
  }
  private onDragLeave: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    this.setState({ dragHover: false });
  }


  public render() {
    const { dragHover } = this.state;
    const classList: string[] = [];
    if (dragHover)
      classList.push("drag-hover");

    return (
      <div
        id="catalog-panel"
        className={classList.join(" ")}
        onDrop={this.onDrop}
        onDragOver={this.onDragOver}
        onDragLeave={this.onDragLeave}
      >
        <div className="drop-message">Drop filez here, yo</div>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ( { } ); // state.console;

const mapDispatchToProps = (dispatch: Dispatch<RootState>) => ({
  // scanComPorts: () => dispatch(actions.scanComPorts()).catch(() => null),
  // sendCommand: (command: string) => dispatch(actions.sendCommand(command)),
});


export const CatalogPanelConnected = connect(mapStateToProps, mapDispatchToProps)(CatalogPanel);
