import * as React from "react";
import { ConnectionPanelProps } from ".";
import { LoadingSpinner } from "../LoadingSpinner";
import { PortState } from "../../redux/connection/types";

export const ConnectButton: React.SFC<ConnectionPanelProps> = props => {
  const { state, onConnect, onDisconnect, port, baudrate } = props;
  const disabled = !port || !baudrate;

  switch (state) {
    case PortState.Opening:
      return <button id="connect-button" onClick={onDisconnect} disabled={disabled}><LoadingSpinner /></button>;
    case PortState.Open:
      return <button id="connect-button" onClick={onDisconnect} disabled={disabled}>Disconnect</button>;
    case PortState.Closing:
      return <button id="connect-button" disabled><LoadingSpinner /></button>;
    case PortState.Closed:
      return <button id="connect-button" onClick={onConnect} disabled={disabled}>Connect</button>;
  }
};
