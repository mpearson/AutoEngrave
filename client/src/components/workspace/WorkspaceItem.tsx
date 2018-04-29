import * as React from "react";
import { Design } from "../../redux/catalog/types";
import { MachineTask } from "../../redux/workspace/types";
import { connect } from "react-redux";
import { RootState } from "../../redux/types";
import { OrderedMap } from "immutable";

export interface WorkspaceItemProps {
  task: MachineTask;
  catalog: OrderedMap<number, Design>;
}

export const WorkspaceItem: React.SFC<WorkspaceItemProps> = props => {
  const { task, catalog } = props;
  if (task.type === "vector-raster" || task.type === "bitmap-raster") {
    const design = catalog.get(task.designID);

    const containerStyle: React.CSSProperties = {
      left: task.x + "px",
      top: task.y + "px",
    };

    const imageSize: React.CSSProperties = {
      width: task.width + "px",
      height: task.height + "px",
    };

    return (
      <div className="workspace-item" style={containerStyle}>
        <img src={design.imageData} style={imageSize} />
      </div>
    );
  } else {
    return null;
  }
};

const mapStateToProps = (state: RootState) => ({
  catalog: state.catalog.items,
});

export const WorkspaceItemConnected = connect(mapStateToProps)(WorkspaceItem);

