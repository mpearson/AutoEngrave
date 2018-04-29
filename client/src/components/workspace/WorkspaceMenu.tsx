import * as React from "react";
import { RootState } from "../../redux/types";
import { Dispatch, connect } from "react-redux";
import { Template } from "../../redux/templates/types";
import { CrudState } from "../../redux/CRUD/types";
import { SELECT_TEMPLATE } from "../../redux/workspace/actions";

import "./template-menu.less";

export interface WorkspaceMenuProps extends CrudState<Template> {
  selected: number;
  selectTemplate: (templateID: number) => void;
}



export const WorkspaceMenu: React.SFC<WorkspaceMenuProps> = props => {
  const { items, selected, selectTemplate } = props;

  return (
    <div className="template-menu">
      <label>Template</label>
      <select value={selected || ""} onChange={e => selectTemplate(Number(e.target.value))} disabled={false}>
        <option value={0}>None</option>
        {items.valueSeq().map(t => <option value={t.id} key={t.id}>{t.name}</option>)}
      </select>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  ...state.templates,
  selected: state.workspace.templateID,
});

const mapDispatchToProps = (dispatch: Dispatch<RootState>) => ({
  selectTemplate: (templateID: number) => { dispatch({ type: SELECT_TEMPLATE, templateID }); },
});


export const WorkspaceMenuConnected = connect(mapStateToProps, mapDispatchToProps)(WorkspaceMenu);
