import * as React from "react";
// import { RootState } from "../../redux/types";
// import { Dispatch, connect } from "react-redux";
import { Design } from "../../redux/catalog/types";
import { DesignThumbnail } from "./DesignThumbnail";
import * as moment from "moment";
// import { calculateImageSize } from "../../redux/catalog/utils";

export interface DesignEditorProps {
  design: Design;
  onSave: (design: Design) => void;
  onCancel: () => void;
  onDelete: () => void;
}

export interface DesignEditorState {
  dragHover: boolean;
  design: Design;
}

export class DesignEditor extends React.Component<DesignEditorProps, DesignEditorState> {
  constructor(props: DesignEditorProps) {
    super(props);
    this.state = {
      dragHover: false,
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

  private onDelete = () => {
    if (window.confirm("Oh?"))
      this.props.onDelete();
  }

  public componentDidMount() {
    window.addEventListener("keydown", this.onEscape);
  }

  public componentWillUnmount() {
    window.removeEventListener("keydown", this.onEscape);
  }

  public render() {
    const { onSave, onCancel } = this.props;
    const { design } = this.state;

    const mmWidth = Math.round(design.width * 2540 / design.dpi) / 100;
    const mmHeight = Math.round(design.height * 2540 / design.dpi) / 100;

    return (
      <div className="catalog-panel">
        <div className="design-editor">
          <section className="action-buttons">
            <button onClick={() => onSave(design)} className="blue">Save</button>
            <button onClick={() => onCancel()}>Cancel</button>
            <button onClick={this.onDelete} className="red fas fa-trash-alt" title="Delete, duh" />
          </section>
          <section>
            <dl>
              <dt>Name</dt>
              <dd>
                <input
                  type="text"
                  className="name-input dark"
                  onChange={e => this.onChange("name", e.target.value)}
                  value={design.name}
                />
              </dd>
              <dt>DPI</dt>
              <dd>
                <input
                  type="text"
                  className="dpi-input dark"
                  onChange={e => this.onChange("dpi", e.target.value)}
                  value={design.dpi}
                />
              </dd>
              <dt>Description</dt>
              <dd>
                <input
                  type="text"
                  className="description-input dark"
                  onChange={e => this.onChange("description", e.target.value)}
                  value={design.description}
                />
              </dd>
            </dl>
            <div className="image-preview">
              <DesignThumbnail size={200} design={design} />
            </div>
          </section>
          <section>
            <dl>
              <dt>Format</dt>
              <dd>{design.filetype}</dd>
              <dt>Width</dt>
              <dd>{`${mmWidth}mm`}</dd>
              <dt>Height</dt>
              <dd>{`${mmHeight}mm`}</dd>
              <dt>Created</dt>
              <dd>{moment(design.created).format("YYYY-MM-DD h:mm A")}</dd>
              <dt>Updated</dt>
              <dd>{moment(design.updated).format("YYYY-MM-DD h:mm A")}</dd>
            </dl>
          </section>
        </div>
      </div>
    );
  }
}

