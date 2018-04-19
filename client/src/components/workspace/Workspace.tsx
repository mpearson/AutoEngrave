import * as React from "react";
import { RootState } from "../../redux/types";
import { Dispatch, connect } from "react-redux";
import { TemplateMenuConnected } from "./TemplateMenu";
import { DropTarget, DropTargetSpec, DropTargetCollector, ConnectDropTarget } from "react-dnd";
import { TemplateSlot } from "../../redux/templates/types";
import { DesignDragSourceInfo } from "../catalog/DesignThumbnail";

import "./workspace.less";

export interface WorkspaceProps {
  // scanComPorts: () => Promise<actions.ConsoleAction>;
  // sendCommand: (command: string) => Promise<actions.ConsoleAction>;
}

export const Workspace: React.SFC<WorkspaceProps> = props => {
  // const { ports, portScanFetching, sendFetching, entries, scanComPorts, sendCommand } = props;

  return (
    <div className="workspace-panel">
      <TemplateMenuConnected />
      <div className="machine-bed">
        <WorkspaceDroppableSlot />
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => state.console;

const mapDispatchToProps = (dispatch: Dispatch<RootState>) => ({
  // scanComPorts: () => dispatch(actions.scanComPorts()).catch(() => null),
  // sendCommand: (command: string) => dispatch(actions.sendCommand(command)),
});


export const WorkspaceConnected = connect(mapStateToProps, mapDispatchToProps)(Workspace);



export interface WorkspaceSlotProps {
  slot?: TemplateSlot;
  x?: number;
  y?: number;
  onDrop?: () => void;
  onHover?: (isOver: boolean) => void;
}

/** Properties injected by the DropTargetConnector */
export interface DropTargetProps {
  connectDropTarget: ConnectDropTarget;
  isOver: boolean;
  canDrop: boolean;
  dragSourceInfo: DesignDragSourceInfo;
}

type CombinedProps = WorkspaceSlotProps & DropTargetProps;

/** Config object for DropTarget */
const dropTargetSpec: DropTargetSpec<WorkspaceSlotProps> = {
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
class WorkspaceSlot extends React.Component<CombinedProps> {
  public componentWillReceiveProps(nextProps: CombinedProps) {
    const {isOver, canDrop} = this.props;
    if (nextProps.onHover && (nextProps.isOver !== isOver || nextProps.canDrop !== canDrop)) {
      nextProps.onHover(nextProps.isOver && nextProps.canDrop);
    }
  }

  public render() {
    const {connectDropTarget, isOver, canDrop} = this.props;
    const classList = ["workspace-slot"];

    if (canDrop) {
      classList.push("can-drop");
      if (isOver) {
        classList.push("drag-hover");
      }
    }

    return connectDropTarget(<div className={classList.join(" ")}><div></div></div>);
  }
}

export const WorkspaceDroppableSlot = DropTarget("design", dropTargetSpec, dropTargetCollector)(
  WorkspaceSlot as any
);
