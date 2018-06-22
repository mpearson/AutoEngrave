import * as React from "react";
import { RootState } from "../../redux/types";
import { connect } from "react-redux";
import { CatalogState } from "../../redux/catalog/reducer";
import { CreateActionCreator, UpdateActionCreator, DeleteActionCreator, CrudAction } from "../../redux/CRUD/types";
import { Design } from "../../redux/catalog/types";
import { DesignCatalog } from "./DesignCatalog";
import { DesignEditor } from "./DesignEditor";
import * as actions from "../../redux/catalog/actions";
import { addDesignToTemplate } from "../../redux/workspace/actions";
import * as _ from "lodash";

import "./catalog.less";

export interface CatalogPanelProps extends CatalogState {
  createDesign: CreateActionCreator<Design>;
  updateDesign: UpdateActionCreator<Design>;
  deleteDesign: DeleteActionCreator<Design>;
  selectDesign: (id: number) => CrudAction<Design>;
  addToWorkspace: (id: number, slotIndex?: number) => any;
}

export interface CatalogPanelState {
  editingID: number;
}

export class CatalogPanel extends React.Component<CatalogPanelProps, CatalogPanelState> {
  constructor(props: CatalogPanelProps) {
    super(props);
    this.state = {
      editingID: null,
    };
  }

  private openEditDialog = (editingID: number) => {
    this.setState({ editingID });
  }

  private onSave = (diff: Partial<Design>) => {
    const { editingID } = this.state;
    if (editingID === null) {
      this.props.createDesign(diff);
    } else {
      this.props.updateDesign(editingID, _.pick(diff, ["id", "name", "description", "dpi"]));
    }
    this.closeEditDialog();
  }

  private closeEditDialog = () => {
    this.setState({ editingID: null });
  }

  private onDelete = () => {
    this.props.deleteDesign(this.state.editingID);
    this.closeEditDialog();
  }

  public render() {
    const { items, selectedID, addToWorkspace, deleteDesign, selectDesign } = this.props;
    const editingModel = items.get(this.state.editingID);
    // const classList: string[] = [];
    // if (dragHover)
    //   classList.push("drag-hover");
    if (editingModel) {
      return (
        <DesignEditor
          design={editingModel}
          onSave={this.onSave}
          onCancel={this.closeEditDialog}
          onDelete={this.onDelete}
        />
      );
    } else {
      return (
        <DesignCatalog
          items={items}
          selectedID={selectedID}
          onSelect={selectDesign}
          onAdd={addToWorkspace}
          onEdit={this.openEditDialog}
          onDelete={deleteDesign}
          onUpload={this.onSave}
        />
      );
    }
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
  selectDesign: actions.selectDesign,
  addToWorkspace: addDesignToTemplate,
};


export const CatalogPanelConnected = connect(mapStateToProps, mapDispatchToProps)(CatalogPanel);
