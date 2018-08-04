import "./workspace.less";

import * as React from "react";
import { RootState } from "../../redux/types";
import { connect } from "react-redux";
import { OrderedMap } from "immutable";
import { Machine } from "../../redux/settings/types";
import { Template } from "../../redux/templates/types";
import { WorkspaceMenuConnected } from "./WorkspaceMenu";
import { TemplateDropZone } from "./TemplateDropZone";
import { Job } from "../../redux/workspace/types";
import * as actions from "../../redux/workspace/actions";
import { Design } from "../../redux/catalog/types";
import { WorkspaceItem } from "./WorkspaceItem";
import { getActiveMachine } from "../../redux/workspace/utils";
import { getActiveTemplate } from "../../redux/templates/utils";
import { ZoomArea } from "./ZoomArea";

interface StateProps {
  activeJob: Job;
  hoverTaskIndex: number;
  machine: Machine;
  template: Template;
  catalog: OrderedMap<number, Design>;
  invertZoom: boolean;

}

interface DispatchProps {
  onDropDesign: (id: number, slotIndex: number) => any;
  hoverTask: (index: number) => any;
}

type CombinedProps = StateProps & DispatchProps;

interface WorkspaceState {
  currentZoom: number;
}

class Workspace extends React.Component<CombinedProps, WorkspaceState> {
  constructor(props: CombinedProps) {
    super(props);

    this.state = {
      currentZoom: 1,
    };
  }

  private zoomArea = React.createRef<ZoomArea>();

  private onZoomIn = () => this.zoomArea.current.zoomIn();
  private onZoomOut = () => this.zoomArea.current.zoomOut();
  private onZoomReset = () => this.zoomArea.current.zoomReset();

  private renderTaskItems(): JSX.Element[] {
    const { activeJob, catalog, hoverTaskIndex, hoverTask } = this.props;
    const tasks = activeJob ? activeJob.tasks : [];
    return tasks.reduce<JSX.Element[]>((items, task, index) => {
      if (task.type !== "gcode") {
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
      }
      return items;
    }, []);
  }

  private renderTemplateSlots(): JSX.Element[] {
    const { template, onDropDesign } = this.props;
    const slots = template ? template.slots : [];
    return slots.map((slot, index) => {
      return (
        <TemplateDropZone
          slot={slot}
          key={index}
          onDrop={design => onDropDesign(design.id, index)}
        />
      );
    });
  }

  public render() {
    const { machine } = this.props;

    if (!machine)
      return null;

    const machineBedStyle: React.CSSProperties = {
      width: Math.abs(machine.offsetLeft - machine.offsetRight),
      height: Math.abs(machine.offsetBack - machine.offsetFront),
    };

    return (
      <div className="panel workspace-panel">
        <WorkspaceMenuConnected />
        <ZoomArea ref={this.zoomArea}>
          <div className="machine-bed" style={machineBedStyle}>
            {this.renderTaskItems()}
            {this.renderTemplateSlots()}
          </div>
        </ZoomArea>
        <div className="zoom-buttons">
          <div className="button-group">
            <button className="fas fa-plus" title="Zoom in" onClick={this.onZoomIn} />
            <button className="fas fa-minus" title="Zoom out" onClick={this.onZoomOut} />
            <button className="fas fa-expand" title="Reset zoom" onClick={this.onZoomReset} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  activeJob: state.workspace.activeJob,
  hoverTaskIndex: state.workspace.hoverTaskIndex,
  machine: getActiveMachine(state),
  template: getActiveTemplate(state),
  catalog: state.catalog.items,
  invertZoom: false, // TODO: make it real (state.settings.preferences.invertZoom)
});

const mapDispatchToProps = ({
  onDropDesign: actions.updateTemplateSlot,
  hoverTask: actions.hoverTask,
});


export const WorkspaceConnected = connect(mapStateToProps, mapDispatchToProps)(Workspace);
