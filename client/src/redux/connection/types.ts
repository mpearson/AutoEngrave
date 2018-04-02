export type ComPort = string;
// export type ConsoleEntryType = "command" | "error" | "response";

// export interface ConsoleEntry {
//   text: string;
//   type: ConsoleEntryType;
// }

export interface ConnectionStatus {
  connected: boolean;
  port: string;
  baudrate: string;
  connectedTime: string;
}
