import * as React from "react";
// import { RootState } from "../../redux/types";
// import { Dispatch, connect } from "react-redux";
import { Design } from "../../redux/catalog/types";
import { calculateSize } from "../../redux/catalog/utils";

export interface DesignEditorProps {
  design: Design;
  onSave: (design: Design) => void;
  onCancel: () => void;
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

  private onChange = (key: keyof Design, value: string) => {
    this.setState({
      design: {...this.state.design, [key]: value }
    });
  }

  // dangerouslySetInnerHTML={{ __html: "" }}

  public render() {
    const { onSave, onCancel } = this.props;
    const { design } = this.state;
    const imageSize = calculateSize(design.width, design.height, 200);

    return (
      <div className="catalog-panel">
        <div className="design-editor">
          <section>
            <label>Name</label>
            <input type="text" onChange={e => this.onChange("name", e.target.value)} value={design.name} />
            <dl>
              <dt>Format</dt>
              <dd>{design.filetype}</dd>
              <dt>Width</dt>
              <dd>{design.width}</dd>
              <dt>Height</dt>
              <dd>{design.height}</dd>
              <dt>Created</dt>
              <dd>{design.created}</dd>
              <dt>Updated</dt>
              <dd>{design.updated}</dd>
            </dl>
            <label>DPI</label>
            <input type="text" onChange={e => this.onChange("dpi", e.target.value)} value={design.dpi} />
            <label>Description</label>
            <textarea onChange={e => this.onChange("description", e.target.value)} value={design.description} />
            <div className="image-preview">
              <img src={"data:image/svg+xml;utf8," + design.imageData} style={imageSize} />
            </div>
          </section>
          <section className="action-buttons">
            <button onClick={() => onSave(design)}>Save</button>
            <button onClick={() => onCancel()}>Cancel</button>
          </section>
        </div>
      </div>
    );
  }
}

