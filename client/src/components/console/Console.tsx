import * as React from "react";
import { Dispatch, connect } from "react-redux";
import { RootState } from "../../redux/types";
import { ConsoleState } from "../../redux/console/reducer";
import * as actions from "../../redux/console/actions";
import { ConsoleInput } from "./ConsoleInput";
import { PortState } from "../../redux/connection/types";

import "./console.less";

export interface ConsoleProps extends ConsoleState {
  connectionState: PortState;
  sendCommand: (command: string) => Promise<actions.ConsoleAction>;
}

export const Console: React.SFC<ConsoleProps> = props => {
  const { entries, connectionState, sendCommand } = props;
  const logEntries = entries.map((entry, index) => {
    const classList: string[] = [entry.type];
    if (entry.text === "ok")
      classList.push("ok");
    return (
      <div className={classList.join(" ")} key={index}>{entry.text}</div>
    );
  });

  const scrollToBottom = (elem: HTMLDivElement) => {
    if (elem !== null)
      elem.scrollTop = elem.scrollHeight;
  };

  return (
    <div className="console-panel">
      <div className="console-log scrollable" ref={scrollToBottom}>{logEntries.reverse()}</div>
      <ConsoleInput sendCommand={sendCommand} disabled={connectionState !== PortState.Open} />
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  ...state.console,
  connectionState: state.connection.state,
});

const mapDispatchToProps = (dispatch: Dispatch<RootState>) => ({
  sendCommand: (command: string) => dispatch(actions.sendCommand(command)),
});


export const ConsoleConnected = connect(mapStateToProps, mapDispatchToProps)(Console);
