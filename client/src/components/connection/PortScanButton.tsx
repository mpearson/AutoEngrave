import * as React from "react";
import { LoadingSpinner } from "../LoadingSpinner";

export interface PortScanButtonProps {
  onClick: () => void;
  loading: boolean;
}

export const PortScanButton: React.SFC<PortScanButtonProps> = props => (
  <button id="port-scan-button" onClick={props.loading ? undefined : props.onClick}>
    {props.loading ? <LoadingSpinner /> : "Scan"}
  </button>
);
