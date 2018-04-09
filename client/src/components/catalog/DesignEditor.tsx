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
    const { design } = this.state;
    const imageSize = calculateSize(design.width, design.height, 200);

    return (
      <div id="catalog-panel" className="design-editor">
        <input type="text" onChange={e => this.onChange("name", e.target.value)} value={design.name} />
        <div>
          <label>Format</label>
          <span>{design.filetype}</span>
        </div>
        <div>
          <label>Width</label>
          <span>{design.width}</span>
        </div>
        <div>
          <label>Height</label>
          <span>{design.height}</span>
        </div>
        <div>
          <label>Created</label>
          <span>{design.created}</span>
        </div>
        <div>
          <label>Updated</label>
          <span>{design.updated}</span>
        </div>
        <input type="text" onChange={e => this.onChange("dpi", e.target.value)} value={design.dpi} />
        <textarea onChange={e => this.onChange("description", e.target.value)} value={design.name} />
        <div className="image-preview">
          <img src={"data:image/svg+xml;utf8," + design.imageData} style={imageSize} />
        </div>
      </div>
    );
  }
}

