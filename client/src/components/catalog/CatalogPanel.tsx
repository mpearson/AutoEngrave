import "./catalog.less";

import * as React from "react";
import { connect } from "react-redux";
import * as _ from "lodash";
import { createSelector } from "reselect";
import { Collection } from "immutable";

import { RootState } from "../../redux/types";
import { CatalogState } from "../../redux/catalog/types";
import { CreateActionCreator, UpdateActionCreator, DeleteActionCreator, CrudAction } from "../../redux/CRUD/types";
import { Design } from "../../redux/catalog/types";
import { DesignCatalog } from "./DesignCatalog";
import { DesignEditor } from "./DesignEditor";
import * as actions from "../../redux/catalog/actions";
import { addDesignToTemplate } from "../../redux/workspace/actions";
import { Job, DesignTask } from "../../redux/workspace/types";

interface StateProps extends CatalogState {
  activeJob: Job;
  sortedDesigns: Collection.Indexed<Design>;
}

interface DispatchProps {
  createDesign: CreateActionCreator<Design>;
  updateDesign: UpdateActionCreator<Design>;
  deleteDesign: DeleteActionCreator<Design>;
  selectDesign: (id: number, ctrlKey: boolean) => CrudAction<Design>;
  addToWorkspace: (ids: number[]) => any;
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
    const { items, sortedDesigns, selectedID, addToWorkspace, selectDesign } = this.props;
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
          items={sortedDesigns}
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

const sortDesignsByID = createSelector(
  (state: RootState) => state.catalog.items,
  (items) => items.sortBy((value, key) => key).reverse()
);

const mapStateToProps = (state: RootState) => ({
  ...state.catalog,
  sortedDesigns: sortDesignsByID(state),
  activeJob: state.workspace.activeJob,
});

// const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
//   createDesign: (diff) => dispatch(actions.createDesign(diff)),
//   updateDesign: (diff, id) => dispatch(actions.updateDesign(diff, id)),
//   deleteDesign: (id) => dispatch(actions.deleteDesign(id)),
//   selectDesign: (id) => dispatch(actions.selectDesign(id)),
//   addToWorkspace: (id) => dispatch(addDesignToTemplate(id)),
// });

const mapDispatchToProps = {
  ...actions,
  addToWorkspace: addDesignToTemplate,
};

export const CatalogPanelConnected = connect(mapStateToProps, mapDispatchToProps)(CatalogPanel as any);
