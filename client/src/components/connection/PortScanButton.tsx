import * as React from "react";
import { LoadingSpinner } from "../LoadingSpinner";

export interface PortScanButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export const PortScanButton: React.SFC<PortScanButtonProps> = props => {
  const onClick = props.loading ? undefined : props.onClick;
  return (
    <button id="port-scan-button" onClick={onClick} disabled={props.disabled}>
      {props.loading ? <LoadingSpinner /> : "Scan"}
    </button>
  );
};
