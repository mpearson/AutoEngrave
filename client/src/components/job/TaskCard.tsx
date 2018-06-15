import * as React from "react";
import { MachineTask, GCodeTask, RasterTask } from "../../redux/workspace/types";
// import { RootState } from "../../redux/types";
// import { OrderedMap } from "immutable";
// import { Design } from "../../redux/catalog/types";
// import { connect, Dispatch } from "react-redux";
// import { SET_ACTIVE_JOB } from "../../redux/workspace/actions";

import "./job.less";

export interface TaskCardProps<T extends MachineTask = MachineTask> {
  model: T;
  // onUpdate: (model: T) => void;
  onDelete: () => void;
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

export const RasterTaskCard: React.SFC<TaskCardProps<RasterTask>> = props => {
  const {onDelete, onMouseOver, onMouseOut, highlight} = props;
  const {power, speed, dpi, readonly} = props.model;
  const classList = ["task-card"];
  if (highlight)
    classList.push("highlight");

  return (
    <div className={classList.join(" ")} onMouseOver={onMouseOver} onMouseOut={onMouseOut}>
      <div title="Power" className="power parameter">
        <i className="fas fa-bolt" />
        <span>{power}</span>
      </div>
      <div title="Speed" className="speed parameter">
        <i className="fas fa-angle-double-right" />
        <span>{speed}</span>
      </div>
      <div title="DPI" className="dpi parameter">
        <span>{dpi}</span>
        <small>DPI</small>
      </div>
      {readonly ? null : <DeleteButton onClick={onDelete} />}
    </div>
  );
};

export const GCodeTaskCard: React.SFC<TaskCardProps<GCodeTask>> = props => {
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
