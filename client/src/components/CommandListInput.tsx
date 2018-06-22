import * as React from "react";

export interface CommandListInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  className?: string;
}

export class CommandListInput extends React.Component<CommandListInputProps> {
  private onChange: React.ChangeEventHandler<HTMLTextAreaElement> = e => {
    const value = e.target.value.trim().replace("\r", "").split("\n");
    this.props.onChange(value);
  }

  public render() {
    const { value, disabled, className } = this.props;
    const classList = [];
    if (className)
      classList.push(className);
    return (
      <textarea
        className={classList.join(" ")}
        value={value.join("\n")}
        disabled={disabled}
        onChange={this.onChange}
      />
    );
  }
}
