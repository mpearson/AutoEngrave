import * as React from "react";
import { RootState } from "../../redux/types";
import { connect } from "react-redux";
import { CrudState, CreateActionCreator, UpdateActionCreator, DeleteActionCreator } from "../../redux/CRUD/types";
import { Design } from "../../redux/catalog/types";
import { DesignCatalog } from "./DesignCatalog";
import { DesignEditor } from "./DesignEditor";
import * as actions from "../../redux/catalog/actions";
import * as _ from "lodash";

import "./catalog.less";

export interface CatalogPanelProps extends CrudState<Design> {
  // dispatch: Dispatch<RootState>;
  // scanComPorts: () => Promise<actions.ConsoleAction>;
  // sendCommand: (command: string) => Promise<actions.ConsoleAction>;
  // createDesign: (design: Design) => void;
  // updateDesign: (oldDesign: Design, design: Design) => void;
  // deleteDesign: (design: Design) => void;
  createDesign: CreateActionCreator<Design>;
  updateDesign: UpdateActionCreator<Design>;
  deleteDesign: DeleteActionCreator<Design>;
}

export interface CatalogPanelState {
  editingDesign: Design;
}

export class CatalogPanel extends React.Component<CatalogPanelProps, CatalogPanelState> {
  constructor(props: CatalogPanelProps) {
    super(props);
    this.state = {
      editingDesign: null,
    };
  }

  private onSelect = (design: Design) => {
    this.setState({ editingDesign: design });
  }

  private onSave = (design: Design) => {
    if (design.id) {
      const newDesign = _.pick(design, ["id", "name", "description", "dpi"]);
      this.props.updateDesign(this.state.editingDesign, newDesign);
    } else {
      this.props.createDesign(design);
    }

    this.setState({ editingDesign: null });
  }

  private onCancel = () => {
    this.setState({ editingDesign: null });
  }

  public render() {
    const { editingDesign } = this.state;
    // const classList: string[] = [];
    // if (dragHover)
    //   classList.push("drag-hover");
    if (editingDesign === null)
      return <DesignCatalog {...this.props} onSelect={this.onSelect} onUpload={this.onSave} />;
    else
      return <DesignEditor design={editingDesign} onSave={this.onSave} onCancel={this.onCancel} />;
  }

}

const mapStateToProps = (state: RootState) => state.catalog;

// const mapDispatchToProps = (dispatch: Dispatch<RootState>) => ({
//   createDesign: (design: Design) => { dispatch(actions.createDesign(design)); },
//   updateDesign: (oldDesign: Design, design: Design) => { dispatch(actions.updateDesign(oldDesign, design)); },
//   deleteDesign: (design: Design) => { dispatch(actions.deleteDesign(design)); },
// });

const mapDispatchToProps = {
  createDesign: actions.createDesign,
  updateDesign: actions.updateDesign,
  deleteDesign: actions.deleteDesign,
};


export const CatalogPanelConnected = connect(mapStateToProps, mapDispatchToProps)(CatalogPanel);
