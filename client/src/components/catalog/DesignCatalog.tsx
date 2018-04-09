import * as React from "react";
// import { RootState } from "../../redux/types";
// import { Dispatch, connect } from "react-redux";
import { CrudState } from "../../redux/CRUD/types";
import { Design } from "../../redux/catalog/types";
import { DesignThumbnail } from "./DesignThumbnail";

export interface DesignCatalogProps extends CrudState<Design> {
  onSelect: (design: Design) => void;
}

export interface DesignCatalogState {
  dragHover: boolean;
  editingDesign: Design;
}

export class DesignCatalog extends React.Component<DesignCatalogProps, DesignCatalogState> {
  constructor(props: DesignCatalogProps) {
    super(props);
    this.state = {
      dragHover: false,
      editingDesign: null,
    };
  }

  private fileInput: HTMLInputElement;

  private onDragOver: React.DragEventHandler<HTMLDivElement> = e => {
    e.preventDefault();
    this.setState({ dragHover: true });
  }

  private onDragLeave: React.DragEventHandler<HTMLDivElement> = e => {
    e.preventDefault();
    this.setState({ dragHover: false });
  }

  private onDrop: React.DragEventHandler<HTMLDivElement> = e => {
    e.preventDefault();
    this.setState({ dragHover: false });
    this.loadFiles(e.dataTransfer.files);
  }

  private onSelectFile: React.ChangeEventHandler<HTMLInputElement> = e => {
    this.loadFiles(this.fileInput.files);
  }


  // dangerouslySetInnerHTML={{ __html: "" }}
  public render() {
    const { items, onSelect } = this.props;
    const { dragHover } = this.state;
    const classList = ["design-catalog"];
    if (dragHover)
      classList.push("drag-hover");

    const thumbnails = items.toKeyedSeq().map((item, id) => (
      <DesignThumbnail key={id} design={item} onClick={() => onSelect(item)} />
    )).toArray();

    return (
      <div
        id="catalog-panel"
        className={classList.join(" ")}
        onDrop={this.onDrop}
        onDragOver={this.onDragOver}
        onDragLeave={this.onDragLeave}
      >
        <input
          type="file"
          className="file-input"
          ref={elem => this.fileInput = elem}
          onChange={this.onSelectFile}
        />
        <button onClick={() => this.fileInput.click()}>Upload Design</button>
        <div className="drop-message">Drop filez here, yo</div>
        <div className="catalog-items">
          {thumbnails}
        </div>
      </div>
    );
  }

  private loadFiles(files: FileList) {
    console.log(files);
    // "data:image/svg+xml;utf8,"
  }
}
