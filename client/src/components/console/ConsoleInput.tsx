import * as React from "react";

export interface ConsoleInputProps {
  sendCommand: (command: string) => void;
  disabled?: boolean;
}

export interface ConsoleInputState {
  input: string;
}

export class ConsoleInput extends React.Component<ConsoleInputProps, ConsoleInputState> {
  constructor(props: ConsoleInputProps) {
    super(props);
    this.state = { input: "" };
  }

  private inputElem: HTMLInputElement;

  private sendEnabled = () => this.state.input.length > 0 && !this.props.disabled;

  private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ input: e.target.value.toUpperCase() });
  }

  private onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && this.sendEnabled())
      this.onSend();
  }

  private onSend = () => {
    this.props.sendCommand(this.state.input);
    if (this.inputElem)
      this.inputElem.select();
  }

  public render() {
    const disableSend = !this.sendEnabled();
    return (
      <div className="console-input-box">
        <input
          className="console-input simple-input"
          type="text"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          value={this.state.input}
          onKeyDown={this.onKeyPress}
          onChange={this.onChange}
          ref={elem => this.inputElem = elem}
        />
        <button className="console-send-button blue" onClick={this.onSend} disabled={disableSend}>
          Send
        </button>
      </div>
    );
  }
}
