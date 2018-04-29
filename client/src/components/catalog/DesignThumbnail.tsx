import * as React from "react";
import { Design } from "../../redux/catalog/types";
import { calculateImageSize } from "../../redux/catalog/utils";
import { LoadingSpinner } from "../LoadingSpinner";
import { ConnectDragSource, DragSourceSpec, DragSourceCollector, DragSource } from "react-dnd";

export interface DesignThumbnailProps {
  design: Design;
  size: number;
  onClick?: () => void;
  onBeginDrag?: () => void;
  onEndDrag?: () => void;
  droppable?: boolean;
  onDrop?: () => void;
}

export class DesignThumbnail extends React.Component<DesignThumbnailProps & DragSourceProps> {
  public render() {
    const { design, size, onClick, connectDragSource } = this.props;
    const { isFetching, width, height, imageData } = design;
    if (isFetching) {
      return <div className="design loading"><LoadingSpinner /></div>;
    } else {
      const imageSize = calculateImageSize(width, height, size);
      return connectDragSource(
        <div className="design" onClick={onClick}>
          <img src={imageData} style={imageSize} />
        </div>
      );
    }
  }
}

/** Properties injected by the DragSourceConnector */
export interface DragSourceProps {
  isDragging: boolean;
  connectDragSource: ConnectDragSource;
}

/** Config object for DragSource */
const dragSourceSpec: DragSourceSpec<DesignThumbnailProps> = {
  canDrag(props, monitor) {
    return true;
  },
  beginDrag(props, monitor, component: DesignThumbnail): Design {
    if (props.onBeginDrag) {
      props.onBeginDrag();
    }

    return props.design;
  },
  endDrag(props) {
    if (props.onEndDrag) {
      props.onEndDrag();
    }
  }
};

/** Calculate properties to be injected into DesignThumbnail */
const dragSourceCollector: DragSourceCollector = (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
};

const dragSourceWrapper = DragSource("design", dragSourceSpec, dragSourceCollector);

export const DraggableDesignThumbnail = dragSourceWrapper(DesignThumbnail as any);
