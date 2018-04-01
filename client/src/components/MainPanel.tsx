import * as React from "react";
import "./console.less";
import { Dispatch, connect } from "react-redux";
import { RootState } from "../redux/types";
import { callAPI } from "../services/api";
import * as actions from "../redux/console/actions";
import { ConsoleState } from "../redux/console/reducer";
import { LoadingSpinner } from "./LoadingSpinner";

export interface MainPanelProps extends ConsoleState {
  scanComPorts: () => Promise<actions.ConsoleAction>;
  sendCommand: (command: string) => Promise<actions.ConsoleAction>;
}

const baudRates = [
  "115200",
  "57600",
  "38400",
  "19200",
  "9600",
  "2400",
];

export const MainPanel: React.SFC<MainPanelProps> = props => {
  const { ports, portScanFetching, sendFetching, entries, scanComPorts, sendCommand } = props;

  const portList = ports.map(port => <option value={port} key={port}>{port}</option>);
  if (portList.length === 0)
    portList.push(<option value="" key="">No results</option>);

  const baudrateList = baudRates.map(b => <option value={b} key={b}>{b}</option>);

  const logEntries = entries.map((entry, index) => <div className={entry.type} key={index}>{entry.text}</div>);

  return (
    <div>
      <header>
      <h1>AutoEngrave 1.0</h1>
      </header>
      <div id="console-pane">
        <div id="comms-panel">
          <PortScanButton onClick={scanComPorts} loading={portScanFetching} />
          <select id="port-list">{portList}</select>
          <select id="baudrate-list" defaultValue={baudRates[0]}>{baudrateList}</select>
        </div>
        <div id="console-log">{logEntries}</div>
        <div id="console-input-box">
          <input type="text" id="console-input" autoCorrect="off" autoCapitalize="off" spellCheck={false} />
          <button id="console-send-button" onClick={scanComPorts}>Send</button>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => state.console;

const mapDispatchToProps = (dispatch: Dispatch<RootState>) => ({
  scanComPorts: () => dispatch(actions.scanComPorts()).catch(() => null),
  sendCommand: (command: string) => dispatch(actions.sendCommand(command)),
});


export const MainPanelConnected = connect(mapStateToProps, mapDispatchToProps)(MainPanel);



export const PortScanButton: React.SFC<{onClick: () => void, loading: boolean}> = props => (
  <button id="port-scan-button" onClick={props.loading ? undefined : props.onClick}>
    {props.loading ? <LoadingSpinner /> : "Scan"}
  </button>
);


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
