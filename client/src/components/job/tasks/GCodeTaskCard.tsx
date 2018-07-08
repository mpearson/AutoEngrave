import * as React from "react";
import { MachineTask, GCodeTask } from "../../../redux/workspace/types";
import { DeleteButton } from "./TaskCard";

export interface TaskCardProps<T extends MachineTask = MachineTask> {
  model: T;
  onDelete: () => void;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseOver?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseOut?: (e: React.MouseEvent<HTMLDivElement>) => void;
  selected?: boolean;
  highlight?: boolean;
}

export const GCodeTaskCard: React.SFC<TaskCardProps<GCodeTask>> = props => {
  const {onClick, onDelete, onMouseOver, onMouseOut, highlight, selected } = props;
  const {commands, readonly} = props.model;
  const classList = ["task-card"];
  if (highlight)
    classList.push("highlight");
  if (selected)
    classList.push("selected");

  return (
    <div
      onClick={onClick}
      className={classList.join(" ")}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
    >
      <i className="fas fa-align-left" />
      <span>{commands.length > 0 ? commands[0] : "[empty]"}</span>
      {readonly ? null : <DeleteButton onClick={onDelete} />}
    </div>
  );
};

