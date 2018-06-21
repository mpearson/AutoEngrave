import * as React from "react";
import { MachineTask, GCodeTask, RasterTask } from "../../redux/workspace/types";
import { NumericInput } from "../NumericInput";
// import { RootState } from "../../redux/types";
// import { OrderedMap } from "immutable";
// import { Design } from "../../redux/catalog/types";
// import { connect, Dispatch } from "react-redux";
// import { SET_ACTIVE_JOB } from "../../redux/workspace/actions";

import "./job.less";

export interface TaskEditorProps<T extends MachineTask = MachineTask> {
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

export const TaskEditor: React.SFC<TaskEditorProps> = props => {
  const { model } = props;
  if (model.type === "gcode") {
    return <GCodeTaskEditor {...props as any} />;
  } else if (model.type === "raster") {
    return <RasterTaskEditor {...props as any} />;
  } else {
    return null;
  }
};

export class RasterTaskEditor extends React.Component<TaskEditorProps<RasterTask>> {
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

export const GCodeTaskEditor: React.SFC<TaskEditorProps<GCodeTask>> = props => {
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

