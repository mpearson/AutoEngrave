import * as React from "react";
import { Dispatch, connect } from "react-redux";
import { RootState } from "../../redux/types";
import { ConsoleState } from "../../redux/console/reducer";
import * as actions from "../../redux/console/actions";
import { ConsoleInput } from "./ConsoleInput";

import "./index.less";

export interface ConsoleProps extends ConsoleState {
  sendCommand: (command: string) => Promise<actions.ConsoleAction>;
}

export const Console: React.SFC<ConsoleProps> = props => {
  const { entries, sendCommand } = props;
  const logEntries = entries.map((entry, index) => <div className={entry.type} key={index}>{entry.text}</div>);

  const scrollToBottom = (elem: HTMLDivElement) => {
    if (elem !== null)
      elem.scrollTop = elem.scrollHeight;
  };

  return (
    <div id="console-panel">
      <div id="console-log" ref={scrollToBottom}>{logEntries.reverse()}</div>
      <ConsoleInput sendCommand={sendCommand} />
    </div>
  );
};

const mapStateToProps = (state: RootState) => state.console;

const mapDispatchToProps = (dispatch: Dispatch<RootState>) => ({
  sendCommand: (command: string) => dispatch(actions.sendCommand(command)),
});


export const ConsoleConnected = connect(mapStateToProps, mapDispatchToProps)(Console);
