import * as React from "react";
import { RootState } from "../../redux/types";
import { Dispatch, connect } from "react-redux";
import { OrderedMap } from "immutable";
import { Machine } from "../../redux/settings/types";
import { Template, TemplateSlot } from "../../redux/templates/types";
import { TemplateMenuConnected } from "./TemplateMenu";
import { TemplateDropZone } from "./TemplateDropZone";
import { WorkspaceState } from "../../redux/workspace/reducer";
import { addDesignToTemplate } from "../../redux/workspace/actions";
import { Design } from "../../redux/catalog/types";

import "./workspace.less";

export interface WorkspaceProps extends WorkspaceState {
  machines: OrderedMap<number, Machine>;
  templates: OrderedMap<number, Template>;
  onDropDesign: (design: Design, slot: TemplateSlot) => void;
  // scanComPorts: () => Promise<actions.ConsoleAction>;
  // sendCommand: (command: string) => Promise<actions.ConsoleAction>;
}

export const Workspace: React.SFC<WorkspaceProps> = props => {
  const { machines, templates, machineID, templateID, onDropDesign } = props;
  const template = templates.get(templateID);
  const machine = machines.get(machineID);

  const machineStyle: React.CSSProperties = {};
  if (machine) {
    machineStyle.width = Math.abs(machine.offsetLeft - machine.offsetRight);
    machineStyle.height = Math.abs(machine.offsetBack - machine.offsetFront);
  } else {
    machineStyle.display = "none";
  }
  let templateSlots: JSX.Element[] = null;
  if (template)
    templateSlots = template.slots.map((slot, index) => (
      <TemplateDropZone slot={slot} key={index} onDrop={design => onDropDesign(design, slot)} />
    ));

  return (
    <div className="workspace-panel">
      <TemplateMenuConnected />
      <div className="machine-bed" style={machineStyle}>
        {templateSlots}
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  ...state.workspace,
  machines: state.settings.machines.items,
  templates: state.templates.items,
});

const mapDispatchToProps = (dispatch: Dispatch<RootState>) => ({
  onDropDesign: (design: Design, slot: TemplateSlot) => dispatch(addDesignToTemplate(design, slot)),
  // scanComPorts: () => dispatch(actions.scanComPorts()).catch(() => null),
  // sendCommand: (command: string) => dispatch(actions.sendCommand(command)),
});


export const WorkspaceConnected = connect(mapStateToProps, mapDispatchToProps)(Workspace);


