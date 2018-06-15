import * as React from "react";
import { RootState } from "../../redux/types";
import { connect } from "react-redux";
import { OrderedMap } from "immutable";
import { Machine } from "../../redux/settings/types";
import { Template } from "../../redux/templates/types";
import { WorkspaceMenuConnected } from "./WorkspaceMenu";
import { TemplateDropZone } from "./TemplateDropZone";
import { WorkspaceState } from "../../redux/workspace/reducer";
import * as actions from "../../redux/workspace/actions";
import { Design } from "../../redux/catalog/types";
import { WorkspaceItem } from "./WorkspaceItem";

import "./workspace.less";

interface StateProps extends WorkspaceState {
  machines: OrderedMap<number, Machine>;
  templates: OrderedMap<number, Template>;
  catalog: OrderedMap<number, Design>;
}

interface DispatchProps {
  onDropDesign: (design: Design, slotIndex: number) => any;
  hoverTask: (index: number) => any;
}

type CombinedProps = StateProps & DispatchProps;

export interface WorkspaceProps extends WorkspaceState {
}

export const Workspace: React.SFC<CombinedProps> = props => {
  const {
    machines, templates, machineID, templateID, onDropDesign,
    activeJob, catalog, hoverTaskIndex, hoverTask,
  } = props;
  const template = templates.get(templateID);
  const machine = machines.get(machineID);

  const machineStyle: React.CSSProperties = {};
  if (machine) {
    machineStyle.width = Math.abs(machine.offsetLeft - machine.offsetRight);
    machineStyle.height = Math.abs(machine.offsetBack - machine.offsetFront);
  } else {
    machineStyle.display = "none";
  }

  const tasks = activeJob ? activeJob.tasks : [];
  const taskItems = tasks.reduce<JSX.Element[]>((items, task, index) => {
    if (task.type !== "gcode")
      items.push(
        <WorkspaceItem
          task={task}
          design={catalog.get(task.designID)}
          highlight={index === hoverTaskIndex}
          key={task.slotIndex}
          onMouseOver={() => hoverTask(index)}
          onMouseOut={() => hoverTask(null)}
        />
      );
    return items;
  }, []);

  const slots = template ? template.slots : [];
  const templateSlots: JSX.Element[] = slots.map((slot, index) => {
    return (
      <TemplateDropZone
        slot={slot}
        key={index}
        onDrop={design => onDropDesign(design, index)}
      />
    );
  });

  return (
    <div className="panel workspace-panel">
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
  catalog: state.catalog.items,
});

const mapDispatchToProps = ({
  onDropDesign: actions.addDesignToTemplate,
  hoverTask: actions.hoverActiveJobTask,
});


export const WorkspaceConnected = connect(mapStateToProps, mapDispatchToProps)(Workspace);
