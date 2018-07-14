import * as React from "react";
import { GCodeTask } from "../../../redux/workspace/types";
import { DeleteButton, TaskCardProps } from "./TaskCard";

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
