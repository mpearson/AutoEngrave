import * as React from "react";
// import { RootState } from "../../redux/types";
// import { Dispatch, connect } from "react-redux";
import { CrudState } from "../../redux/CRUD/types";
import { Design, ImageMetadata } from "../../redux/catalog/types";
import { DesignThumbnail } from "./DesignThumbnail";
// import { buildImageDataURL } from "../../redux/catalog/utils";

export interface DesignCatalogProps extends CrudState<Design> {
  onSelect: (design: Design) => void;
  onUpload: (design: Design) => void;
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
    const classList = ["catalog-panel"];
    if (dragHover)
      classList.push("drag-hover");

    const thumbnails = items.toKeyedSeq().map((item, id) => (
      <DesignThumbnail
        key={id}
        size={100}
        design={item}
        onClick={() => onSelect(item)}
      />
    )).toArray();

    return (
      <div
        className={classList.join(" ")}
        onDrop={this.onDrop}
        onDragOver={this.onDragOver}
        onDragLeave={this.onDragLeave}
      >
        <div className="drop-message">Drop filez here, yo</div>
        <div className="design-catalog">
          <input
            type="file"
            className="file-input"
            ref={elem => this.fileInput = elem}
            onChange={this.onSelectFile}
          />
          <button className="upload-button" onClick={() => this.fileInput.click()}>Upload Design</button>
          <div className="catalog-items">
            {thumbnails}
          </div>
        </div>
      </div>
    );
  }

  private loadFiles(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      this.loadImage(file).then(
        metadata => this.props.onUpload({
          name: file.name.replace(/\.\w+$/i, ""),
          description: "",
          ...metadata,
        }),
        (error) => {
          console.error(error);
        }
      );
    }
  }

  private loadImage(file: File) {
    return new Promise<ImageMetadata>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const image = new Image();
        image.onload = () => resolve({
          imageData: image.src,
          width: image.width,
          height: image.height,
          filetype: file.type,
          dpi: 72, // how the balls do we detect this? look for friggin Inkscape SVG comments? yuck
        });
        image.src = reader.result;
        // image.src = buildImageDataURL(file.type, reader.result);
      };

      // if (file.type === "image/svg+xml")
      //   reader.readAsText(file);
      // else if (file.type.startsWith("image/"))
      if (file.type.startsWith("image/"))
        reader.readAsDataURL(file);
      else
        reject("aint no image file homes");
    });
  }
}
