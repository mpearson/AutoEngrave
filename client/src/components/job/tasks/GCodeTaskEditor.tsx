import * as React from "react";
import { GCodeTask } from "../../../redux/workspace/types";
import { CommandListInput } from "../../CommandListInput";
import { TaskEditorProps } from "./TaskEditor";

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
