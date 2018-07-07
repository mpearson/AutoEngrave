import "./task-editor.less";

import * as React from "react";
import { MachineTask } from "../../../redux/workspace/types";
import { RasterTaskEditor } from "./RasterTaskEditor";
import { GCodeTaskEditor } from "./GCodeTaskEditor";

export interface TaskEditorProps<T extends MachineTask = MachineTask> {
  model: T;
  onUpdate: (diff: Partial<T>) => void;
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
