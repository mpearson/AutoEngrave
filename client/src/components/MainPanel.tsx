import * as React from "react";
import { Dispatch, connect } from "react-redux";
import { RootState } from "../redux/types";
import { ConsoleConnected } from "./Console";
import { WorkspaceConnected } from "./Workspace";


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
