import "./job.less";

import * as React from "react";
import { MachineTask, GCodeTask, RasterTask } from "../../redux/workspace/types";
import { NumericInput } from "../NumericInput";
// import { RootState } from "../../redux/types";
// import { OrderedMap } from "immutable";
// import { Design } from "../../redux/catalog/types";
// import { connect, Dispatch } from "react-redux";
// import { SET_ACTIVE_JOB } from "../../redux/workspace/actions";
import { CommandListInput } from "../CommandListInput";

export interface TaskEditorProps<T extends MachineTask = MachineTask> {
  model: T;
  onUpdate: (model: T) => void;
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
  if (model === null || model.type === "raster") {
    return <RasterTaskEditor {...props as any} />;
  } else if (model.type === "gcode") {
    return <GCodeTaskEditor {...props as any} />;
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
    const {model} = this.props;
    const disabled = model === null || model.readonly;

    return (
      <div className="task-editor">
        <div title="Power" className="power parameter">
          <i className="fas fa-bolt" />
          <NumericInput
            value={model && model.power}
            onChange={x => this.onChange("power", x)}
            disabled={disabled}
            min={0}
            max={100}
            increment={5}
          />
        </div>
        <div title="Speed" className="speed parameter">
          <i className="fas fa-angle-double-right" />
          <NumericInput
            value={model && model.speed}
            onChange={x => this.onChange("speed", x)}
            disabled={disabled}
            min={0}
            max={100}
            increment={0.1}
          />
        </div>
        <div title="DPI" className="dpi parameter">
          <small>DPI</small>
          <NumericInput
            value={model && model.dpi}
            onChange={x => this.onChange("dpi", x)}
            disabled={disabled}
            min={1}
            increment={100}
          />
        </div>
      </div>
    );
  }
}

export class GCodeTaskEditor extends React.Component<TaskEditorProps<GCodeTask>> {
  private onChange = (commands: string[]) => {
    const {model, onUpdate} = this.props;
    onUpdate({...model, commands});
  }

  public render() {
    const {model} = this.props;
    const disabled = model === null || model.readonly;

    return (
      <div className="task-card">
        <CommandListInput value={model && model.commands} onChange={this.onChange} disabled={disabled} />
      </div>
    );
  }
}
