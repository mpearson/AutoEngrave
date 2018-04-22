import * as React from "react";
import { DropTarget, DropTargetSpec, DropTargetCollector, ConnectDropTarget } from "react-dnd";
import { TemplateSlot } from "../../redux/templates/types";
import { DesignDragSourceInfo } from "../catalog/DesignThumbnail";


export interface TemplateDropZoneProps {
  slot: TemplateSlot;
  onDrop?: () => void;
  onHover?: (isOver: boolean) => void;
}

/** Properties injected by the DropTargetConnector */
export interface DropTargetProps {
  connectDropTarget?: ConnectDropTarget;
  isOver?: boolean;
  canDrop?: boolean;
  dragSourceInfo?: DesignDragSourceInfo;
}

type CombinedProps = TemplateDropZoneProps & DropTargetProps;

/** Config object for DropTarget */
const dropTargetSpec: DropTargetSpec<TemplateDropZoneProps> = {
  /** Calls props.onDrop (if defined) with the node being dragged and the location of this drop zone.  */
  drop(props, monitor) {
    if (props.onDrop) {
      // props.onDrop((monitor.getItem() as DesignDragSourceInfo).design);
    }
  },
  canDrop(props, monitor): boolean {
    // const design = (monitor.getItem() as DesignDragSourceInfo).design;
    return true;
  },
};

/** Calculate properties to be injected into WorkspaceDropZone */
const dropTargetCollector: DropTargetCollector = (connector, monitor) => {
  return {
    connectDropTarget: connector.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
    dragSourceInfo: (monitor.getItem() as DesignDragSourceInfo),
  };
};

/** Drop zone component to be wrapped by DropTarget to enable react-dnd dropping. */
class TemplateDropZoneComponent extends React.Component<CombinedProps> {
  public componentWillReceiveProps(nextProps: CombinedProps) {
    const {isOver, canDrop} = this.props;
    if (nextProps.onHover && (nextProps.isOver !== isOver || nextProps.canDrop !== canDrop)) {
      nextProps.onHover(nextProps.isOver && nextProps.canDrop);
    }
  }

  public render() {
    const {connectDropTarget, isOver, canDrop, slot} = this.props;
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
      <div className={classList.join(" ")} style={style}>
      </div>
    );
  }
}

export const TemplateDropZone = DropTarget("design", dropTargetSpec, dropTargetCollector)(TemplateDropZoneComponent);
