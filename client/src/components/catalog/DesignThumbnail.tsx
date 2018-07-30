import * as React from "react";
import { Design } from "../../redux/catalog/types";
import { calculateImageSize } from "../../redux/catalog/utils";
import { LoadingSpinner } from "../LoadingSpinner";
import { ConnectDragSource, DragSourceSpec, DragSourceCollector, DragSource } from "react-dnd";

export interface DesignThumbnailProps {
  design: Design;
  size: number;
  selected?: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
  onBeginDrag?: () => void;
  onEndDrag?: () => void;
  droppable?: boolean;
  onDrop?: () => void;
}

type CombinedProps = DesignThumbnailProps & DragSourceProps;

export class DesignThumbnail extends React.Component<CombinedProps> {
  private clickTimeout: number = null;

  private clearClickTimeout = () => {
    window.clearTimeout(this.clickTimeout);
    this.clickTimeout = null;
  }

  /**
   * First click, fire onClick(). Second click, fire onDoubleClick() instead.
   */
  private onClick = () => {
    const { onClick, onDoubleClick } = this.props;
    if (this.clickTimeout === null) {
      this.clickTimeout = window.setTimeout(this.clearClickTimeout, 300);
      onClick();
    } else {
      this.clearClickTimeout();
      onDoubleClick();
    }
  }

  public componentWillUnmount() {
    if (this.clickTimeout)
      this.clearClickTimeout();
  }

  public render() {
    const { design, size, selected, connectDragSource } = this.props;
    const { isFetching, width, height, imageData } = design;
    if (isFetching) {
      return <div className="design loading"><LoadingSpinner /></div>;
    } else {
      const classList = ["design"];
      if (selected)
        classList.push("selected");
      const imageSize = calculateImageSize(width, height, size);
      return connectDragSource(
        <div className={classList.join(" ")} onClick={this.onClick}>
          <img src={imageData} style={imageSize} />
        </div>
      );
    }
  }
}

/** Properties injected by the DragSourceConnector */
interface DragSourceProps {
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
