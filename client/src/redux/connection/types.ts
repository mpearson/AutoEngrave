import * as moment from "moment";

export interface ConnectionState {
  readonly ports: ComPort[];
  readonly port: ComPort;
  readonly baudrate: string;
  readonly isFetchingPorts: boolean;
  readonly state: PortState;
  readonly connectedTime: moment.Moment;
  readonly isConnecting: boolean;
  readonly isDisconnecting: boolean;
  readonly isFetchingStatus: boolean;
}

export type ComPort = string;
// export type ConsoleEntryType = "command" | "error" | "response";

// export interface ConsoleEntry {
//   text: string;
//   type: ConsoleEntryType;
// }

export enum PortState {
  Opening,
  Open,
  Closing,
  Closed,
}

export interface ConnectionStatus {
  connected: boolean;
  port: string;
  baudrate: string;
  connectedTime: string;
}

export const baudrates = [
  "115200",
  "57600",
  "38400",
  "19200",
  "9600",
  "2400",
];

