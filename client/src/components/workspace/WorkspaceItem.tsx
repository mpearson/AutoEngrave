import * as React from "react";
import { Design } from "../../redux/catalog/types";
import { DesignTask } from "../../redux/workspace/types";

export interface WorkspaceItemProps {
  task: DesignTask;
  design: Design;
  highlight?: boolean;
}

export const WorkspaceItem: React.SFC<WorkspaceItemProps> = props => {
  const { task, design, highlight } = props;
  if (design !== null) {
    const containerStyle: React.CSSProperties = {
      left: task.x + "px",
      top: task.y + "px",
    };

    const imageSize: React.CSSProperties = {
      width: task.width + "px",
      height: task.height + "px",
    };

    const classList = ["workspace-item"];
    if (highlight)
      classList.push("highlight");

    return (
      <div className={classList.join(" ")} style={containerStyle}>
        <img src={design.imageData} style={imageSize} />
      </div>
    );
  } else {
    return null;
  }
};

// const mapStateToProps = (state: RootState) => ({
//   catalog: state.catalog.items,
// });

// export const WorkspaceItemConnected = connect(mapStateToProps)(WorkspaceItem);


// /** Properties injected by the DragSourceConnector */
// export interface DragSourceProps {
//   isDragging: boolean;
//   connectDragSource: ConnectDragSource;
// }

// /** Config object for DragSource */
// const dragSourceSpec: DragSourceSpec<DesignThumbnailProps> = {
//   canDrag(props, monitor) {
//     return true;
//   },
//   beginDrag(props, monitor, component: DesignThumbnail): Design {
//     if (props.onBeginDrag) {
//       props.onBeginDrag();
//     }

//     return props.design;
//   },
//   endDrag(props) {
//     if (props.onEndDrag) {
//       props.onEndDrag();
//     }
//   }
// };

// /** Calculate properties to be injected into DesignThumbnail */
// const dragSourceCollector: DragSourceCollector = (connect, monitor) => {
//   return {
//     connectDragSource: connect.dragSource(),
//     isDragging: monitor.isDragging()
//   };
// };

// const dragSourceWrapper = DragSource("design", dragSourceSpec, dragSourceCollector);

// export const DraggableDesignThumbnail = dragSourceWrapper(DesignThumbnail as any);
