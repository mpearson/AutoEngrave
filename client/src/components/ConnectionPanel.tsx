import * as React from "react";
import { LoadingSpinner } from "./LoadingSpinner";
import { RootState } from "../redux/types";
import { Dispatch, connect } from "react-redux";
import { ConnectionState } from "../redux/connection/reducer";
import * as actions from "../redux/connection/actions";

import "./console.less";

const baudRates = [
  "115200",
  "57600",
  "38400",
  "19200",
  "9600",
  "2400",
];

interface DispatchProps {
  scanComPorts: () => void;
  onConnect: () => void;
  onCancel: () => void;
  onDisconnect: () => void;
}

export interface ConnectionPanelProps extends ConnectionState, DispatchProps { }

export const ConnectionPanel: React.SFC<ConnectionPanelProps> = props => {
  const { ports, isFetchingPorts, scanComPorts } = props;

  const portList = ports.map(port => <option value={port} key={port}>{port}</option>);
  if (portList.length === 0)
    portList.push(<option value="" key="">No results</option>);

  const baudrateList = baudRates.map(b => <option value={b} key={b}>{b}</option>);

  return (
    <div id="comms-panel">
      <PortScanButton onClick={props.scanComPorts} loading={isFetchingPorts} />
      <select id="port-list">{portList}</select>
      <select id="baudrate-list" defaultValue={baudRates[0]}>{baudrateList}</select>
      <ConnectButton {...props} />
    </div>
  );
};

const mapStateToProps = (state: RootState) => state.connection;

const mapDispatchToProps = (dispatch: Dispatch<RootState>): DispatchProps => ({
  scanComPorts: () => dispatch(actions.getPorts()).catch(() => null),
  onConnect: () => dispatch(actions.openConnection()).catch(() => null),
  onCancel: () => dispatch(actions.cancelConnection()).catch(() => null),
  onDisconnect: () => dispatch(actions.closeConnection()).catch(() => null),
});

export const ConnectionPanelConnected = connect(mapStateToProps, mapDispatchToProps)(ConnectionPanel);

export interface PortScanButtonProps {
  onClick: () => void;
  loading: boolean;
}

export const PortScanButton: React.SFC<PortScanButtonProps> = props => (
  <button id="port-scan-button" onClick={props.loading ? undefined : props.onClick}>
    {props.loading ? <LoadingSpinner /> : "Scan"}
  </button>
);

export const ConnectButton: React.SFC<ConnectionPanelProps> = props => {
  let action;
  if (props.connected)
    action = props.onDisconnect;
  else if(props.isConnecting)
    action = props.onCancel

  return (
    <button id="port-scan-button" onClick={props.isConnecting ? undefined : props.onConnect}>
      {props.isFetchingPorts ? <LoadingSpinner /> : "Scan"}
    </button>
  );
}
