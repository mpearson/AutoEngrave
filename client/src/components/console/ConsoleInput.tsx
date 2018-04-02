import * as React from "react";

export interface ConsoleInputProps {
  sendCommand: (command: string) => void;
}

export interface ConsoleInputState {
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
