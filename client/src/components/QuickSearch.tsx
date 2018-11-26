import * as React from "react";

export interface QuickSearchProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export class QuickSearch extends React.PureComponent<QuickSearchProps> {
  private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onChange(e.currentTarget.value);
  }

  private onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      this.props.onChange("");
      e.preventDefault();
    }
  }

  public render() {
    const { className, value, disabled } = this.props;
    const classList = ["simple-input"];
    if (className)
      classList.push(className);
    return (
      <input
        className={classList.join(" ")}
        value={value}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
        disabled={disabled}
        placeholder="Search"
      />
    );
  }
}
