export interface ConsoleState {
  readonly entries: ConsoleEntry[];
  readonly sendFetching: boolean;
}

export type ConsoleEntryType = "command" | "error" | "response";

export interface ConsoleEntry {
  text: string;
  type: ConsoleEntryType;
}
