import "./quick-add-dialog.less";

import * as React from "react";
import * as ReactDOM from "react-dom";

export interface QuickAddDialogProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  disabled?: boolean;
}

export class QuickAddDialog extends React.PureComponent<QuickAddDialogProps> {
  public componentDidMount() {
    window.addEventListener("keydown", this.onKeyDown);
  }

  public componentWillUnmount() {
    window.removeEventListener("keydown", this.onKeyDown);
  }

  private onKeyDown = (e: KeyboardEvent) => {
    const { disabled, onChange, onSubmit, onCancel, value } = this.props;

    if (disabled)
      return;

    // if something is focused, and it's not a button,
    // then it's probably a text field so we need to just chill
    const focused = document.activeElement;
    if (!(focused === null || focused.tagName === "BODY" || focused.tagName === "BUTTON"))
      return;

    let capture = true;
    if (e.key === "Enter") {
      onSubmit();
    } else if (e.key === "Escape") {
      onCancel();
    } else if (/^\d$/.test(e.key)) {
      onChange((value || "") + e.key);
    } else if (value && e.key === "Backspace") {
      if (value !== null && value.length < 2)
        onCancel();
      else
        onChange(value.slice(0, -1));
    } else {
      capture = false;
    }

    if (capture)
      e.preventDefault();
  }

  public render() {
    const { disabled, value } = this.props;
    if (disabled || value === null)
      return null;

    return ReactDOM.createPortal(
      <div className="modal-wrapper">
        <div className="catalog-quick-add">
          <label>Quick Add</label>
          <span className="value">{value}</span>
        </div>
      </div>,
      document.body,
      "quick-add-input"
    );
  }
}
