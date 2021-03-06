import * as React from "react";
import { RootState, RootDispatch } from "../../redux/types";
import { connect } from "react-redux";
import { Template } from "../../redux/templates/types";
import { CrudState } from "../../redux/CRUD/types";
import { SELECT_TEMPLATE, SET_ACTIVE_JOB, generateGCode } from "../../redux/workspace/actions";
import { getNewJob } from "../../redux/workspace/utils";

export interface WorkspaceMenuProps extends CrudState<Template> {
  selected: number;
  selectTemplate: (templateID: number) => void;
  resetTemplate: () => void;
  generateGCode: () => void;
}

export const WorkspaceMenu: React.SFC<WorkspaceMenuProps> = props => {
  const { items, selected, selectTemplate } = props;

  return (
    <header className="workspace-menu">
      <label>Template</label>
      <select value={selected || ""} onChange={e => selectTemplate(Number(e.target.value))} disabled={false}>
        <option value={0}>None</option>
        {items.valueSeq().map(t => <option value={t.id} key={t.id}>{t.name}</option>)}
      </select>
      <div className="spacer" />
      <button onClick={props.resetTemplate}>Clear</button>
      <button className="blue" onClick={props.generateGCode}>Generate G-Code</button>
    </header>
  );
};

const mapStateToProps = (state: RootState) => ({
  ...state.templates,
  selected: state.workspace.templateID,
});

const mapDispatchToProps = (dispatch: RootDispatch) => ({
  selectTemplate: (templateID: number) => { dispatch({ type: SELECT_TEMPLATE, templateID }); },
  resetTemplate: () => { dispatch({ type: SET_ACTIVE_JOB, job: getNewJob() }); },
  generateGCode: () => { dispatch(generateGCode()); },
});


export const WorkspaceMenuConnected = connect(mapStateToProps, mapDispatchToProps)(WorkspaceMenu);
