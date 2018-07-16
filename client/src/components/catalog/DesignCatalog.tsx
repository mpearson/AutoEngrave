import * as React from "react";
import { Design } from "../../redux/catalog/types";
import { DraggableDesignThumbnail } from "./DesignThumbnail";
import { ConnectDropTarget, DropTargetSpec, DropTargetCollector, DropTarget } from "react-dnd";
import { NativeTypes } from "react-dnd-html5-backend";
import { uploadDesigns } from "../../redux/catalog/utils";
import { OrderedMap } from "immutable";
import { QuickAddDialog } from "./QuickAddDialog";

export interface DesignCatalogProps {
  items: OrderedMap<number, Design>;
  selectedID: number;
  onSelect: (id: number) => void;
  onAdd: (id: number, count?: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onUpload: (design: Design) => void;
}

export interface DesignCatalogState {
  quickAddInput: string;
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
      quickAddInput: null,
    };
  }

  private fileInput: HTMLInputElement;

  private onSelectFile: React.ChangeEventHandler<HTMLInputElement> = e => {
    uploadDesigns(this.fileInput.files, this.props.onUpload);
  }

  private onChangeQuickInput = (quickAddInput: string) => this.setState({ quickAddInput });

  private submitQuickInput = () => {
    const count = parseInt(this.state.quickAddInput, 10);
    this.props.onAdd(this.props.selectedID, count);
    this.clearQuickInput();
  }

  private clearQuickInput = () => this.setState({ quickAddInput: null });

  public render() {
    const { items, onSelect, onAdd, onEdit, onDelete, selectedID } = this.props;
    const { isOver, canDrop, connectDropTarget } = this.props;
    const { quickAddInput } = this.state;
    const classList = ["panel", "catalog-panel", "design-catalog"];
    if (canDrop) {
      classList.push("dnd-can-drop");
      if (isOver)
        classList.push("dnd-hover");
    }
    let actionButtons: JSX.Element[];
    if (selectedID !== null) {
      actionButtons = [
        <button
          key="add"
          onClick={() => onAdd(selectedID)}
          className="blue fas fa-plus"
          title="Add to the thing"
        />,
        <button
          key="edit"
          onClick={() => onEdit(selectedID)}
          className="blue fas fa-edit"
          title="Like, edit or whatever"
        />,
        <button
          key="delete"
          onClick={() => onDelete(selectedID)}
          className="red fas fa-times"
          title="Delete, duh"
        />
      ];
    }

    const thumbnails = items.toKeyedSeq().map((item, id) => (
      <DraggableDesignThumbnail
        key={id}
        design={item}
        size={100}
        selected={id === selectedID}
        onClick={() => onSelect(id)}
        onDoubleClick={() => onEdit(id)}
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
          <div className="spacer" />
          {actionButtons}
        </header>
        <section className="catalog-items scrollable">
          {thumbnails}
        </section>
        <QuickAddDialog
          value={quickAddInput}
          onChange={this.onChangeQuickInput}
          onSubmit={this.submitQuickInput}
          onCancel={this.clearQuickInput}
          disabled={selectedID === null}
        />
      </div>
    );
  }
}

export const DesignCatalog = DropTarget(NativeTypes.FILE, dropTargetSpec, dropTargetCollector)(DesignCatalogComponent);
