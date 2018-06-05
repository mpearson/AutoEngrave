import * as React from "react";
import { CrudState } from "../../redux/CRUD/types";
import { Design } from "../../redux/catalog/types";
import { DraggableDesignThumbnail } from "./DesignThumbnail";
import { ConnectDropTarget, DropTargetSpec, DropTargetCollector, DropTarget } from "react-dnd";
import { NativeTypes } from "react-dnd-html5-backend";
import { uploadDesigns } from "../../redux/catalog/utils";
// import { RootState } from '../../redux/types';

export interface DesignCatalogProps extends CrudState<Design> {
  onSelect: (design: Design) => void;
  onUpload: (design: Design) => void;
}

export interface DesignCatalogState {
  editingDesign: Design;
}

interface FileDragInfo {
  files: FileList;
}

// properties injected by the DropTargetConnector
export interface DropTargetProps {
  connectDropTarget?: ConnectDropTarget;
  isOver?: boolean;
  canDrop?: boolean;
}

type CombinedProps = DesignCatalogProps & DropTargetProps;

// config object for DropTarget
const dropTargetSpec: DropTargetSpec<DesignCatalogProps> = {
  drop(props, monitor) {
    const files = (monitor.getItem() as FileDragInfo).files;
    uploadDesigns(files, props.onUpload);
  }
};

// calculate properties to be injected into DesignCatalogComponent
const dropTargetCollector: DropTargetCollector = (connector, monitor) => {
  return {
    connectDropTarget: connector.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  };
};

export class DesignCatalogComponent extends React.Component<CombinedProps, DesignCatalogState> {
  constructor(props: CombinedProps) {
    super(props);
    this.state = {
      editingDesign: null,
    };
  }

  private fileInput: HTMLInputElement;

  private onSelectFile: React.ChangeEventHandler<HTMLInputElement> = e => {
    uploadDesigns(this.fileInput.files, this.props.onUpload);
  }

  public render() {
    const { items, onSelect, isOver, canDrop, connectDropTarget } = this.props;
    const classList = ["panel", "catalog-panel", "design-catalog"];
    if (canDrop) {
      classList.push("dnd-can-drop");
      if (isOver) {
        classList.push("dnd-hover");
      }
    }

    const thumbnails = items.toKeyedSeq().map((item, id) => (
      <DraggableDesignThumbnail
        key={id}
        size={100}
        design={item}
        onClick={() => onSelect(item)}
      />
    )).toArray();

    return connectDropTarget(
      <div className={classList.join(" ")}>
        <div className="drop-message">Drop filez here, yo</div>
        <header className="action-buttons">
          <input
            type="file"
            className="file-input"
            ref={elem => this.fileInput = elem}
            onChange={this.onSelectFile}
          />
          <button className="upload-button" onClick={() => this.fileInput.click()}>Upload Design</button>
        </header>
        <section className="catalog-items scrollable">
          {thumbnails}
        </section>
      </div>
    );
  }
}

// const mapStateToProps = (state: RootState) => ({
//   x: state.catalog.items
// });

export const DesignCatalog = DropTarget(NativeTypes.FILE, dropTargetSpec, dropTargetCollector)(DesignCatalogComponent);
