import * as React from "react";
import { RasterTask } from "../../../redux/workspace/types";
import { NumericInput } from "../../NumericInput";
import { TaskEditorProps } from "./TaskEditor";

export class RasterTaskEditor extends React.Component<TaskEditorProps<RasterTask>> {
  private onChange = (field: keyof RasterTask, value: number) => {
    const {onUpdate} = this.props;
    onUpdate({[field]: value});
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
            increment={1}
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
