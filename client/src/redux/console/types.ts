export type ConsoleEntryType = "command" | "error" | "response";

export interface ConsoleEntry {
  text: string;
  type: ConsoleEntryType;
}
