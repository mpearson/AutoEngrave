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

