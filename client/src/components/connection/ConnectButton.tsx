import * as React from "react";
import { ConnectionPanelProps } from "./ConnectionPanel";
import { LoadingSpinner } from "../LoadingSpinner";
import { PortState } from "../../redux/connection/types";

export const ConnectButton: React.SFC<ConnectionPanelProps> = props => {
  const { state, onConnect, onDisconnect, port, baudrate } = props;
  const disabled = !port || !baudrate;
  const className = "connect-button blue";

  switch (state) {
    case PortState.Opening:
      return <button className={className} onClick={onDisconnect} disabled={disabled}><LoadingSpinner /></button>;
    case PortState.Open:
      return <button className={className} onClick={onDisconnect} disabled={disabled}>Disconnect</button>;
    case PortState.Closing:
      return <button className={className} disabled><LoadingSpinner /></button>;
    case PortState.Closed:
      return <button className={className} onClick={onConnect} disabled={disabled}>Connect</button>;
  }
};
