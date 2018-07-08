import * as React from "react";
import { RasterTask } from "../../../redux/workspace/types";
import { TaskCardProps } from "./GCodeTaskCard";
import { DeleteButton } from "./TaskEditor";

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
        onMouseDown={onClick}
        className={classList.join(" ")}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
      >
        <i className="fas fa-image" />
        <div title="Power" className="power parameter">
          <i className="fas fa-bolt" />
          <span>{model.power}</span>
        </div>
        <div title="Speed" className="speed parameter">
          <i className="fas fa-angle-double-right" />
          <span>{model.speed}</span>
        </div>
        <div title="DPI" className="dpi parameter">
          {/* <small>DPI</small> */}
          <i className="fas fa-bars" />
          <span>{model.dpi}</span>
        </div>
        {readonly ? null : <DeleteButton onClick={onDelete} />}
      </div>
    );
  }
}
