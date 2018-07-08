import "./task-card.less";

import * as React from "react";
import { MachineTask } from "../../../redux/workspace/types";
import { GCodeTaskCard } from "./GCodeTaskCard";
import { RasterTaskCard } from "./RasterTaskCard";

export interface TaskCardProps<T extends MachineTask = MachineTask> {
  model: T;
  onDelete: () => void;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseOver?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseOut?: (e: React.MouseEvent<HTMLDivElement>) => void;
  selected?: boolean;
  highlight?: boolean;
}

export const DeleteButton: React.SFC<{onClick: () => void}> = props => (
  <button
    key="delete"
    onClick={props.onClick}
    className="delete-button red fas fa-times"
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
