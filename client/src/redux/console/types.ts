export type ComPort = string;
export enum ConsoleEntryType {
  Command,
  Error,
  Response,
}

export interface ConsoleEntry {
  text: string;
  type: ConsoleEntryType;
}
