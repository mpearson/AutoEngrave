import * as React from "react";
import { GCodeTask } from "../../../redux/workspace/types";
import { DeleteButton, TaskCardProps } from "./TaskCard";

export const GCodeTaskCard: React.SFC<TaskCardProps<GCodeTask>> = props => {
  const {onClick, onDelete, onMouseOver, onMouseOut, highlight, selected } = props;
  const {commands, readonly} = props.model;
  const classList = ["task-card", "gcode-task"];
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
      <header>
        <i className="fas fa-align-left" />
        {readonly ? null : <DeleteButton onClick={onDelete} />}
      </header>
      <div className="details">
        <span>{commands.length > 0 ? commands[0] : "[empty]"}</span>
      </div>
    </div>
  );
};
