import * as React from "react";
import { LoadingSpinner } from "./LoadingSpinner";
import { RootState } from "../redux/types";
import { Dispatch, connect } from "react-redux";
import { ConsoleState } from "../redux/console/reducer";
import * as actions from "../redux/console/actions";

import "./console.less";

const baudRates = [
  "115200",
  "57600",
  "38400",
  "19200",
  "9600",
  "2400",
];

export interface ConsoleProps extends ConsoleState {
  scanComPorts: () => Promise<actions.ConsoleAction>;
  sendCommand: (command: string) => Promise<actions.ConsoleAction>;
}

export const Console: React.SFC<ConsoleProps> = props => {
  const { ports, portScanFetching, sendFetching, entries, scanComPorts, sendCommand } = props;

  const portList = ports.map(port => <option value={port} key={port}>{port}</option>);
  if (portList.length === 0)
    portList.push(<option value="" key="">No results</option>);

  const baudrateList = baudRates.map(b => <option value={b} key={b}>{b}</option>);

  const logEntries = entries.map((entry, index) => <div className={entry.type} key={index}>{entry.text}</div>);

  return (
    <div id="console-panel">
      <div id="comms-panel">
        <PortScanButton onClick={props.scanComPorts} loading={portScanFetching} />
        <select id="port-list">{portList}</select>
        <select id="baudrate-list" defaultValue={baudRates[0]}>{baudrateList}</select>
      </div>
      <div id="console-log">{logEntries}</div>
      <div id="console-input-box">
        <input type="text" id="console-input" autoCorrect="off" autoCapitalize="off" spellCheck={false} />
        <button id="console-send-button" onClick={() => sendCommand("DING!")}>Send</button>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => state.console;

const mapDispatchToProps = (dispatch: Dispatch<RootState>) => ({
  scanComPorts: () => dispatch(actions.scanComPorts()).catch(() => null),
  sendCommand: (command: string) => dispatch(actions.sendCommand(command)),
});


export const ConsoleConnected = connect(mapStateToProps, mapDispatchToProps)(Console);

export const PortScanButton: React.SFC<{onClick: () => void, loading: boolean}> = props => (
  <button id="port-scan-button" onClick={props.loading ? undefined : props.onClick}>
    {props.loading ? <LoadingSpinner /> : "Scan"}
  </button>
);
