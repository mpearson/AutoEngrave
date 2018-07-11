import * as React from "react";
import { connect } from "react-redux";
import { RootState, RootDispatch } from "../../redux/types";
import { ConnectionState } from "../../redux/connection/reducer";
import * as actions from "../../redux/connection/actions";
import { ComPort, baudrates, PortState } from "../../redux/connection/types";
import { ConnectButton } from "./ConnectButton";
import { PortScanButton } from "./PortScanButton";

import "./connection.less";

interface DispatchProps {
  scanComPorts: () => void;
  onConnect: () => void;
  onDisconnect: () => void;
  onSelectPort: (port: ComPort) => void;
  onSelectBaudrate: (baudrate: string) => void;
}

export interface ConnectionPanelProps extends ConnectionState, DispatchProps { }

export const ConnectionPanel: React.SFC<ConnectionPanelProps> = props => {
  const {
    ports, port, baudrate, state, isFetchingPorts,
    scanComPorts, onSelectPort, onSelectBaudrate
  } = props;

  const portList = ports.map(p => <option value={p} key={p}>{p}</option>);
  if (portList.length === 0)
    portList.push(<option value="" key="">No results</option>);

  const disableConfig = state !== PortState.Closed;

  return (
    <div className="connection-panel">
      <PortScanButton onClick={scanComPorts} loading={isFetchingPorts} />
      <select value={port || ""} onChange={e => onSelectPort(e.target.value)} disabled={disableConfig}>
        {portList}
      </select>
      <select value={baudrate || ""} onChange={e => onSelectBaudrate(e.target.value)} disabled={disableConfig}>
        {baudrates.map(b => <option value={b} key={b}>{b}</option>)}
      </select>
      <ConnectButton {...props} />
    </div>
  );
};

const mapStateToProps = (state: RootState) => state.connection;

const mapDispatchToProps = (dispatch: RootDispatch): DispatchProps => ({
  scanComPorts: () => dispatch(actions.getPorts()).catch(() => null),
  onConnect: () => dispatch(actions.openConnection()).catch(() => null),
  onDisconnect: () => dispatch(actions.closeConnection()).catch(() => null),
  onSelectPort: (port: ComPort) => dispatch({ type: actions.SELECT_PORT, port }),
  onSelectBaudrate: (baudrate: string) => dispatch({ type: actions.SELECT_BAUDRATE, baudrate }),
});

export const ConnectionPanelConnected = connect(mapStateToProps, mapDispatchToProps)(ConnectionPanel);
