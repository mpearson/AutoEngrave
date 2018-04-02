import * as React from "react";
import { LoadingSpinner } from "./LoadingSpinner";
import { RootState } from "../redux/types";
import { Dispatch, connect } from "react-redux";
import { ConsoleState } from "../redux/console/reducer";
import * as actions from "../redux/console/actions";

import "./console.less";

export interface ConsoleProps extends ConsoleState {
  sendCommand: (command: string) => Promise<actions.ConsoleAction>;
}

export const Console: React.SFC<ConsoleProps> = props => {
  const { sendFetching, entries, sendCommand } = props;
  const logEntries = entries.map((entry, index) => <div className={entry.type} key={index}>{entry.text}</div>);

  return (
    <div id="console-panel">
      <div id="console-log">{logEntries.reverse()}</div>
      <ConsoleInput sendCommand={sendCommand} />
    </div>
  );
};

const mapStateToProps = (state: RootState) => state.console;

const mapDispatchToProps = (dispatch: Dispatch<RootState>) => ({
  sendCommand: (command: string) => dispatch(actions.sendCommand(command)),
});


export const ConsoleConnected = connect(mapStateToProps, mapDispatchToProps)(Console);

interface ConsoleInputProps {
  sendCommand: (command: string) => void;
}

interface ConsoleInputState {
  input: string;
}

export class ConsoleInput extends React.Component<ConsoleInputProps, ConsoleInputState> {
  constructor(props: ConsoleInputProps) {
    super(props);
    this.state = { input: "" };
    this.onChange = this.onChange.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.onSend = this.onSend.bind(this);
  }

  private inputElem: HTMLInputElement;

  private onChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ input: e.target.value.toUpperCase() });
  }

  private onKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter")
      this.onSend();
  }

  private onSend() {
    this.props.sendCommand(this.state.input);
    if (this.inputElem)
      this.inputElem.select();
  }

  public render() {
    return (
      <div id="console-input-box">
        <input
          id="console-input"
          type="text"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          value={this.state.input}
          onKeyDown={this.onKeyPress}
          onChange={this.onChange}
          ref={elem => this.inputElem = elem}
        />
        <button id="console-send-button" onClick={this.onSend}>Send</button>
      </div>
    );
  }
}
