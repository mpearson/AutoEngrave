import * as React from "react";
import { DropTarget, DropTargetSpec, DropTargetCollector, ConnectDropTarget } from "react-dnd";
import { TemplateSlot } from "../../redux/templates/types";
import { Design } from "../../redux/catalog/types";
import { pixelsToMillimeters } from "../../redux/catalog/utils";
// import { Design } from '../../redux/catalog/types';


export interface TemplateDropZoneProps {
  slot: TemplateSlot;
  onDrop: (design: Design) => void;
  // onHover?: (isOver: boolean) => void;
}

// properties injected by the DropTargetConnector
export interface DropTargetProps {
  connectDropTarget?: ConnectDropTarget;
  isOver?: boolean;
  canDrop?: boolean;
  // dragSourceInfo?: Design;
}

type CombinedProps = TemplateDropZoneProps & DropTargetProps;

// config object for DropTarget
const dropTargetSpec: DropTargetSpec<TemplateDropZoneProps> = {
  drop(props, monitor) {
    props.onDrop(monitor.getItem() as Design);
  },
  // check if the design is too big for this slot
  canDrop(props, monitor): boolean {
    const design = monitor.getItem() as Design;
    return (
      props.slot.width >= pixelsToMillimeters(design.width, design.dpi) &&
      props.slot.height >= pixelsToMillimeters(design.height, design.dpi)
    );
  },
};

// calculate properties to be injected into WorkspaceDropZone
const dropTargetCollector: DropTargetCollector = (connector, monitor) => {
  return {
    connectDropTarget: connector.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
    // droppedDesign: (monitor.getItem() as DesignDragSourceInfo),
  };
};

// drop zone component to be wrapped by DropTarget to enable react-dnd dropping.
const TemplateDropZoneComponent: React.SFC<CombinedProps> = props => {
  const {connectDropTarget, isOver, canDrop, slot} = props;
  const classList = ["template-slot"];
  const style: React.CSSProperties = {
    left: slot.x + "px",
    top: slot.y + "px",
    width: slot.width + "px",
    height: slot.height + "px",
  };

  if (canDrop) {
    classList.push("can-drop");
    if (isOver) {
      classList.push("drag-hover");
    }
  }

  return connectDropTarget(
    <div className={classList.join(" ")} style={style} />
  );
};

export const TemplateDropZone = DropTarget("design", dropTargetSpec, dropTargetCollector)(TemplateDropZoneComponent);
