import "./task-card.less";

import * as React from "react";
import { MachineTask } from "../../../redux/workspace/types";
import { GCodeTaskCard } from "./GCodeTaskCard";
import { RasterTaskCard } from "./RasterTaskCard";
import { DragSource, DragSourceCollector, ConnectDragSource, DragSourceSpec } from "react-dnd";

export interface TaskCardProps<T extends MachineTask = MachineTask> {
  model: T;
  onDelete: () => void;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseOver?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseOut?: (e: React.MouseEvent<HTMLDivElement>) => void;
  selected?: boolean;
  highlight?: boolean;
}

type CombinedProps = TaskCardProps & DragSourceProps;

export const DeleteButton: React.SFC<{onClick: () => void}> = props => (
  <button
    key="delete"
    onClick={props.onClick}
    className="delete-button red fas fa-times"
    title="Delete, duh"
  />
);

export const TaskCard: React.SFC<CombinedProps> = props => {
  const { model, connectDragSource } = props;
  if (model.type === "gcode") {
    return connectDragSource(
      <div>
        <GCodeTaskCard {...props as any} />
      </div>
    );
  } else if (model.type === "raster") {
    return connectDragSource(
      <div>
        <RasterTaskCard {...props as any} />
      </div>
    );
  } else {
    return null;
  }
};

/** Properties injected by the DragSourceConnector */
interface DragSourceProps {
  isDragging: boolean;
  connectDragSource: ConnectDragSource;
}

/** Config object for DragSource */
const dragSourceSpec: DragSourceSpec<TaskCardProps, MachineTask> = {
  canDrag(props, monitor) {
    return true;
  },
  beginDrag(props, monitor, component: any): MachineTask {
    // if (props.onBeginDrag) {
    //   props.onBeginDrag();
    // }

    return props.model;
  },
  // endDrag(props) {
  //   if (props.onEndDrag) {
  //     props.onEndDrag();
  //   }
  // }
};

/** Calculate properties to be injected into DesignThumbnail */
const dragSourceCollector: DragSourceCollector<DragSourceProps, TaskCardProps> = (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
};

const dragSourceWrapper = DragSource("task", dragSourceSpec, dragSourceCollector);

export const DraggableTaskCard = dragSourceWrapper(TaskCard);
