import * as React from "react";
import { MachineTask, GCodeTask, RasterTask } from "../../redux/workspace/types";

import "./job.less";

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
  public render() {
    const {model, onDelete, onClick, onMouseOver, onMouseOut, highlight, selected} = this.props;
    const {readonly} = model;
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
        <div title="Power" className="power parameter">
          <i className="fas fa-bolt" />
          <span>{model.power}</span>
        </div>
        <div title="Speed" className="speed parameter">
          <i className="fas fa-angle-double-right" />
          <span>{model.speed}</span>
        </div>
        <div title="DPI" className="dpi parameter">
          <small>DPI</small>
          <span>{model.dpi}</span>
        </div>
        {readonly ? null : <DeleteButton onClick={onDelete} />}
      </div>
    );
  }
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
      <span>{commands.length > 0 ? commands[0] : "[empty]"}</span>
      {readonly ? null : <DeleteButton onClick={onDelete} />}
    </div>
  );
};

