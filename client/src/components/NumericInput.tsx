import * as React from "react";

export interface NumericInputProps {
  value: number;
  onChange: (value: number) => void;
  increment?: number;
  disabled?: boolean;
  className?: string;
  min?: number;
  max?: number;
}

interface NumericInputState {
  stagedValue: string;
  isValid: boolean;
}

export class NumericInput extends React.Component<NumericInputProps, NumericInputState> {
  constructor(props: NumericInputProps) {
    super(props);
    this.state = NumericInput.getDerivedStateFromProps(props);
  }

  public static defaultProps = {
    min: Number.MIN_SAFE_INTEGER,
    max: Number.MAX_SAFE_INTEGER,
    increment: 1,
  };

  public static getDerivedStateFromProps(props: NumericInputProps): NumericInputState {
    const {value} = props;
    return {
      stagedValue: value === null ? "" : String(value),
      isValid: true,
    };
  }

  private validate = (value: number) => {
    const {min, max} = this.props;
    return !(isNaN(value) || value < min || value > max);
  }

  private onChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    const value = e.target.value;
    if (!/[^\d.-]/.test(value)) {
      const numericValue = parseFloat(value);
      // TODO: convince myself I actually need these 2 regexes
      if (this.validate(numericValue) && /^-?\d+(\.\d+)?$/.test(value))
        this.props.onChange(numericValue);
      else
        this.setState({ stagedValue: value, isValid: false });
    }
  }

  private onFocus: React.FocusEventHandler<HTMLInputElement> = e => e.currentTarget.select();

  private onWheel: React.WheelEventHandler<HTMLInputElement> = e => {
    const {value, onChange, min, max, increment} = this.props;
    if (e.deltaY < 0 && value + increment <= max)
      onChange(value + increment);
    else if (e.deltaY > 0 && value - increment >= min)
      onChange(value - increment);
  }

  public render() {
    const { disabled, className } = this.props;
    const { stagedValue } = this.state;
    const classList = [this.state.isValid ? "valid" : "invalid"];
    if (className)
      classList.push(className);
    return (
      <input
        type="text"
        className={classList.join(" ")}
        value={stagedValue}
        disabled={disabled}
        onChange={this.onChange}
        onFocus={this.onFocus}
        onWheel={this.onWheel}
      />
    );
  }
}
