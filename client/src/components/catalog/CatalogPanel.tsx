import "./catalog.less";

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
import { Job, DesignTask } from "../../redux/workspace/types";
import * as _ from "lodash";

interface StateProps extends CatalogState {
  activeJob: Job;
}

interface DispatchProps {
  createDesign: CreateActionCreator<Design>;
  updateDesign: UpdateActionCreator<Design>;
  deleteDesign: DeleteActionCreator<Design>;
  selectDesign: (id: number) => CrudAction<Design>;
  addToWorkspace: (id: number, slotIndex?: number) => any;
}

type CombinedProps = StateProps & DispatchProps;

export interface CatalogPanelState {
  editingID: number;
}

export class CatalogPanel extends React.Component<CombinedProps, CatalogPanelState> {
  constructor(props: CombinedProps) {
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

  private checkDesignInUse = (designID: number) => {
    const { activeJob } = this.props;
    for (const task of activeJob.tasks) {
      if ((task as DesignTask).designID === designID)
        return true;
    }
    return false;
  }

  private confirmDelete = (designID: number) => {
    if (this.checkDesignInUse(designID))
      alert("Can't remove while design is being used");
    else if (confirm("Oh?")) {
      this.props.deleteDesign(designID);
    }
  }

  private confirmDeleteSelected = () => this.confirmDelete(this.props.selectedID);

  private confirmDeleteEditing = () => this.confirmDelete(this.state.editingID);

  public render() {
    const { items, selectedID, addToWorkspace, selectDesign } = this.props;
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
          onDelete={this.confirmDeleteEditing}
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
          onDelete={this.confirmDeleteSelected}
          onUpload={this.onSave}
        />
      );
    }
  }

}

const mapStateToProps = (state: RootState) => ({
  ...state.catalog,
  activeJob: state.workspace.activeJob,
});

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
