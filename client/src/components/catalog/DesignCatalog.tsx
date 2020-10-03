import * as React from "react";
import { defaultMemoize } from "reselect";
import { NativeTypes } from "react-dnd-html5-backend";
import { Collection, Set } from "immutable";

import { Design } from "../../redux/catalog/types";
import { DraggableDesignThumbnail } from "./DesignThumbnail";
import { ConnectDropTarget, DropTargetSpec, DropTargetCollector, DropTarget } from "react-dnd";
import { uploadDesigns } from "../../redux/catalog/utils";
import { QuickAddDialog } from "./QuickAddDialog";
import { QuickSearch } from "../QuickSearch";
import { quickSearchDesigns } from "../../services/search";

export interface DesignCatalogProps {
  items: Collection.Indexed<Design>;
  selectedIds: Set<number>;
  setSelectedIds: (ids: Set<number>) => void;
  onAdd: (ids: Array<number>) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onUpload: (design: Design) => void;
}

export interface DesignCatalogState {
  quickAddInput: string;
  quickSearch: string;
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
const dropTargetCollector: DropTargetCollector<DropTargetProps, DesignCatalogProps> = (connector, monitor) => {
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
      quickSearch: "",
    };
  }

  private fileInput: HTMLInputElement;

  private onSelectFile: React.ChangeEventHandler<HTMLInputElement> = e => {
    uploadDesigns(this.fileInput.files, this.props.onUpload);
  }

  private onChangeQuickAdd = (quickAddInput: string) => this.setState({ quickAddInput });

  private onChangeQuickSearch = (quickSearch: string) => this.setState({ quickSearch });

  private filterByQuickSearch = defaultMemoize(quickSearchDesigns);

  private submitQuickAdd = () => {
    const count = parseInt(this.state.quickAddInput, 10);
    const designIdList: number[] = [];
    this.props.selectedIds.forEach((id: number) => {
      for (let i = 0; i < count; i++)
        designIdList.push(id);
    });

    //   for (let
    // const x = Repeat(this.props.selectedIds, count).flatten().sort().toArray();
    this.props.onAdd(designIdList);
    this.closeQuickAdd();
  }

  private closeQuickAdd = () => this.setState({ quickAddInput: null });

  public render() {
    const { items, setSelectedIds, onAdd, onEdit, onDelete, selectedIds } = this.props;
    const { isOver, canDrop, connectDropTarget } = this.props;
    const { quickAddInput, quickSearch } = this.state;
    const classList = ["panel", "catalog-panel", "design-catalog"];
    if (canDrop) {
      classList.push("dnd-can-drop");
      if (isOver)
        classList.push("dnd-hover");
    }
    let actionButtons: JSX.Element[];
    if (!selectedIds.isEmpty()) {
      const editDisabled = selectedIds.size === 1;
      actionButtons = [
        <button
          key="add"
          onClick={() => onAdd(selectedIds.toArray())}
          className="blue fas fa-plus"
          title="Add to the thing"
        />,
        <button
          key="edit"
          onClick={editDisabled ? null : () => onEdit(selectedIds.first())}
          className="blue fas fa-edit"
          title="Like, edit or whatever"
          disabled={editDisabled}
        />,
        <button
          key="delete"
          onClick={() => onDelete(selectedIds.first())}
          className="red fas fa-times"
          title="Delete, duh"
        />
      ];
    }

    const thumbnails = this.filterByQuickSearch(items, quickSearch)
      .map(design => (
        <DraggableDesignThumbnail
          key={design.id}
          design={design}
          size={100}
          selected={selectedIds.has(design.id)}
          onClick={e => setSelectedIds(Set<number>([design.id]))}
          onDoubleClick={() => onEdit(design.id)}
        />
      ))
      .toArray();

    return connectDropTarget(
      <div className={classList.join(" ")}>
        <div className="drop-message">Drop filez here, yo</div>
        <header className="action-buttons">
          <input
            type="file"
            accept="image/*"
            multiple
            className="file-input"
            ref={elem => this.fileInput = elem}
            onChange={this.onSelectFile}
          />
          <button className="upload-button" onClick={() => this.fileInput.click()}>Upload Design</button>
          <div className="spacer" />
          {actionButtons}
        </header>
        <div className="quick-search">
          <QuickSearch value={quickSearch} onChange={this.onChangeQuickSearch} />
        </div>
        <section className="catalog-items scrollable">
          {thumbnails}
        </section>
        <QuickAddDialog
          value={quickAddInput}
          onChange={this.onChangeQuickAdd}
          onSubmit={this.submitQuickAdd}
          onCancel={this.closeQuickAdd}
          disabled={selectedIds.isEmpty()}
        />
      </div>
    );
  }
}

export const DesignCatalog = DropTarget(NativeTypes.FILE, dropTargetSpec, dropTargetCollector)(DesignCatalogComponent);
