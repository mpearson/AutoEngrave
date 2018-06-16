import * as React from "react";
import { MachineTask, GCodeTask, RasterTask } from "../../redux/workspace/types";
// import { RootState } from "../../redux/types";
// import { OrderedMap } from "immutable";
// import { Design } from "../../redux/catalog/types";
// import { connect, Dispatch } from "react-redux";
// import { SET_ACTIVE_JOB } from "../../redux/workspace/actions";

import "./job.less";

export interface TaskCardProps<T extends MachineTask = MachineTask> {
  model: T;
  // onUpdate: (model: T) => void;
  onDelete: () => void;
  onUpdate: (model: T) => void;
  onMouseOver?: () => void;
  onMouseOut?: () => void;
  highlight?: boolean;
}

export const DeleteButton: React.SFC<{onClick: () => void}> = props => (
  <button
    key="delete"
    onClick={props.onClick}
    className="delete-button red fas fa-trash-alt"
    title="Delete, duh"
  />
);

export const TaskCard: React.SFC<TaskCardProps> = props => {
  const { model } = props;
  if (model.type === "gcode") {
    return <GCodeTaskCard {...props as any} />;
  } else if (model.type === "raster") {
    return <RasterTaskCard {...props as any} />;
  } else {
    return null;
  }
};

export class RasterTaskCard extends React.Component<TaskCardProps<RasterTask>> {
  private onChange = (field: keyof RasterTask, value: number) => {
    const {model, onUpdate} = this.props;
    onUpdate({...model, [field]: value});
  }

  public render() {
    const {model, onDelete, onMouseOver, onMouseOut, highlight} = this.props;
    const {readonly} = model;
    const classList = ["task-card"];
    if (highlight)
      classList.push("highlight");

    return (
      <div className={classList.join(" ")} onMouseOver={onMouseOver} onMouseOut={onMouseOut}>
        <div title="Power" className="power parameter">
          <i className="fas fa-bolt" />
          <NumericInput
            value={model.power}
            onChange={x => this.onChange("power", x)}
            disabled={readonly}
            min={0}
            max={100}
            increment={5}
          />
        </div>
        <div title="Speed" className="speed parameter">
          <i className="fas fa-angle-double-right" />
          <NumericInput
            value={model.speed}
            onChange={x => this.onChange("speed", x)}
            disabled={readonly}
            min={0}
            max={100}
            increment={0.1}
          />
        </div>
        <div title="DPI" className="dpi parameter">
          <small>DPI</small>
          <NumericInput
            value={model.dpi}
            onChange={x => this.onChange("dpi", x)}
            disabled={readonly}
            min={1}
            increment={100}
          />
        </div>
        {readonly ? null : <DeleteButton onClick={onDelete} />}
      </div>
    );
  }
}

export const GCodeTaskCard: React.SFC<TaskCardProps<GCodeTask>> = props => {
  const {onDelete, onMouseOver, onMouseOut, highlight} = props;
  const {commands, readonly} = props.model;
  const classList = ["task-card"];
  if (highlight)
    classList.push("highlight");
  return (
    <div className={classList.join(" ")} onMouseOver={onMouseOver} onMouseOut={onMouseOut}>
      <span>{commands[0]}</span>
      {readonly ? null : <DeleteButton onClick={onDelete} />}
    </div>
  );
};

export interface NumericInputProps<T = any> {
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
    return {
      stagedValue: String(props.value),
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
