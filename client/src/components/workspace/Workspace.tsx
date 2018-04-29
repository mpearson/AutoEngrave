import * as React from "react";
import { RootState } from "../../redux/types";
import { connect } from "react-redux";
import { OrderedMap } from "immutable";
import { Machine } from "../../redux/settings/types";
import { Template } from "../../redux/templates/types";
import { WorkspaceMenuConnected } from "./WorkspaceMenu";
import { TemplateDropZone } from "./TemplateDropZone";
import { WorkspaceState } from "../../redux/workspace/reducer";
import { addDesignToTemplate } from "../../redux/workspace/actions";
import { Design } from "../../redux/catalog/types";
import { WorkspaceItemConnected } from "./WorkspaceItem";

import "./workspace.less";

export interface WorkspaceProps extends WorkspaceState {
  machines: OrderedMap<number, Machine>;
  templates: OrderedMap<number, Template>;
  onDropDesign: (design: Design, slotIndex: number) => any;
  // scanComPorts: () => Promise<actions.ConsoleAction>;
  // sendCommand: (command: string) => Promise<actions.ConsoleAction>;
}

export const Workspace: React.SFC<WorkspaceProps> = props => {
  const { machines, templates, machineID, templateID, onDropDesign, activeJob } = props;
  const template = templates.get(templateID);
  const machine = machines.get(machineID);

  const machineStyle: React.CSSProperties = {};
  if (machine) {
    machineStyle.width = Math.abs(machine.offsetLeft - machine.offsetRight);
    machineStyle.height = Math.abs(machine.offsetBack - machine.offsetFront);
  } else {
    machineStyle.display = "none";
  }
  let taskItems: JSX.Element[] = null;
  if (activeJob)
    taskItems = activeJob.tasks.map((task, index) => <WorkspaceItemConnected task={task} key={index} />);

  let templateSlots: JSX.Element[] = null;
  if (template) {
    templateSlots = template.slots.map((slot, index) => {
      return (
        <TemplateDropZone
          slot={slot}
          key={index}
          onDrop={design => onDropDesign(design, index)}
        />
      );
    });
  }

  return (
    <div className="workspace-panel">
      <WorkspaceMenuConnected />
      <div className="machine-bed" style={machineStyle}>
        {taskItems}
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

const mapDispatchToProps = ({
  onDropDesign: addDesignToTemplate,
});


export const WorkspaceConnected = connect(mapStateToProps, mapDispatchToProps)(Workspace);
