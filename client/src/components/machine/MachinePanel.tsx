import * as React from "react";
import { RootState } from "../../redux/types";
import { Dispatch, connect } from "react-redux";
import { CrudState } from "../../redux/CRUD/types";
import { Machine } from "../../redux/settings/types";
import { SELECT_MACHINE } from "../../redux/workspace/actions";

import "./machine.less";

export interface MachinePanelProps extends CrudState<Machine> {
  selected: number;
  selectMachine: (machineID: number) => void;
}

export const MachinePanel: React.SFC<MachinePanelProps> = props => {
  const { items, selected, selectMachine } = props;

  return (
    <div className="machine-panel">
      <label>Machine</label>
      <select value={selected || ""} onChange={e => selectMachine(Number(e.target.value))} disabled={false}>
        <option value={0}>None</option>
        {items.valueSeq().map(t => <option value={t.id} key={t.id}>{t.name}</option>)}
      </select>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  ...state.settings.machines,
  selected: state.workspace.machineID,
});

const mapDispatchToProps = (dispatch: Dispatch<RootState>) => ({
  selectMachine: (machineID: number) => { dispatch({ type: SELECT_MACHINE, machineID }); },
});


export const MachinePanelConnected = connect(mapStateToProps, mapDispatchToProps)(MachinePanel);
