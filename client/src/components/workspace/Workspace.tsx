import * as React from "react";
import { RootState } from "../../redux/types";
import { Dispatch, connect } from "react-redux";
import { TemplateMenuConnected } from "./TemplateMenu";

import "./workspace.less";

export interface WorkspaceProps {
  // scanComPorts: () => Promise<actions.ConsoleAction>;
  // sendCommand: (command: string) => Promise<actions.ConsoleAction>;
}

export const Workspace: React.SFC<WorkspaceProps> = props => {
  // const { ports, portScanFetching, sendFetching, entries, scanComPorts, sendCommand } = props;

  return (
    <div className="workspace-panel">
      <TemplateMenuConnected />
      <div className="machine-bed">

      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => state.console;

const mapDispatchToProps = (dispatch: Dispatch<RootState>) => ({
  // scanComPorts: () => dispatch(actions.scanComPorts()).catch(() => null),
  // sendCommand: (command: string) => dispatch(actions.sendCommand(command)),
});


export const WorkspaceConnected = connect(mapStateToProps, mapDispatchToProps)(Workspace);
