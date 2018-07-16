import * as React from "react";
import { RasterTask } from "../../../redux/workspace/types";
import { TaskCardProps } from "./TaskCard";
import { DeleteButton } from "./TaskEditor";
import { OrderedMap } from "immutable";
import { Design } from "../../../redux/catalog/types";
import { RootState } from "../../../redux/types";
import { connect } from "react-redux";

interface StateProps {
  catalog?: OrderedMap<number, Design>;
}

type CombinedProps = StateProps & TaskCardProps<RasterTask>;

export class RasterTaskCardComponent extends React.Component<CombinedProps> {
  public render() {
    const {model, catalog, onDelete, onClick, onMouseOver, onMouseOut, highlight, selected} = this.props;
    const {readonly} = model;
    const design = catalog.get(model.designID);

    const classList = ["task-card", "raster-task"];
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
        <header>
          <i className="fas fa-image" />
          {design.name}
          {readonly ? null : <DeleteButton onClick={onDelete} />}
        </header>
        <div className="details">
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
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  catalog: state.catalog.items,
});

export const RasterTaskCard = connect(mapStateToProps)(RasterTaskCardComponent);
