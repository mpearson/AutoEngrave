import * as React from "react";
// import { RootState } from "../../redux/types";
// import { Dispatch, connect } from "react-redux";
import { Design } from "../../redux/catalog/types";
import { DraggableDesignThumbnail } from "./DesignThumbnail";
import { pixelsToMillimeters } from "../../redux/catalog/utils";
// import { calculateImageSize } from "../../redux/catalog/utils";

export interface DesignEditorProps {
  design: Design;
  onSave: (diff: Partial<Design>) => void;
  onCancel: () => void;
  onDelete: () => void;
}

export interface DesignEditorState {
  design: Design;
}

export class DesignEditor extends React.Component<DesignEditorProps, DesignEditorState> {
  constructor(props: DesignEditorProps) {
    super(props);
    this.state = {
      design: props.design,
    };
  }

  private onEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape")
      this.props.onCancel();
  }

  private onChange = (key: keyof Design, value: string) => {
    this.setState({
      design: {...this.state.design, [key]: value }
    });
  }

  public componentDidMount() {
    window.addEventListener("keydown", this.onEscape);
  }

  public componentWillUnmount() {
    window.removeEventListener("keydown", this.onEscape);
  }

  public render() {
    const { onSave, onCancel, onDelete } = this.props;
    const { design } = this.state;

    const mmWidth = pixelsToMillimeters(design.width, design.dpi).toFixed(2);
    const mmHeight = pixelsToMillimeters(design.height, design.dpi).toFixed(2);

    return (
      <div className="panel catalog-panel design-editor">
        <header>
          <button onClick={() => onSave(design)} className="blue">Save</button>
          <button onClick={() => onCancel()}>Cancel</button>
          <div className="spacer" />
          <button onClick={() => onDelete()} className="red fas fa-times" title="Delete, duh" />
        </header>
        <section className="design-details scrollable">
          <dl>
            <dt>Name</dt>
            <dd>
              <input
                type="text"
                className="name-input simple-input"
                onChange={e => this.onChange("name", e.target.value)}
                value={design.name}
              />
            </dd>
            <dt>DPI</dt>
            <dd>
              <input
                type="text"
                className="dpi-input simple-input"
                onChange={e => this.onChange("dpi", e.target.value)}
                value={design.dpi}
              />
            </dd>
            <dt>Description</dt>
            <dd>
              <input
                type="text"
                className="description-input simple-input"
                onChange={e => this.onChange("description", e.target.value)}
                value={design.description}
              />
            </dd>
          </dl>
          <div className="image-preview">
            <DraggableDesignThumbnail size={200} design={design} />
          </div>
          <dl>
            <dt>Format</dt>
            <dd>{design.filetype}</dd>
            <dt>Width</dt>
            <dd>{`${mmWidth}mm`}</dd>
            <dt>Height</dt>
            <dd>{`${mmHeight}mm`}</dd>
            <dt>Created</dt>
            <dd>{design.created.format("YYYY-MM-DD h:mm A")}</dd>
            <dt>Updated</dt>
            <dd>{design.updated.format("YYYY-MM-DD h:mm A")}</dd>
          </dl>
        </section>
      </div>
    );
  }
}

