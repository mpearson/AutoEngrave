import "./workspace.less";

import * as React from "react";
import { RootState } from "../../redux/types";
import { connect } from "react-redux";
import { OrderedMap } from "immutable";
import { Machine } from "../../redux/settings/types";
import { Template } from "../../redux/templates/types";
import { WorkspaceMenuConnected } from "./WorkspaceMenu";
import { TemplateDropZone } from "./TemplateDropZone";
import { WorkspaceState } from "../../redux/workspace/types";
import * as actions from "../../redux/workspace/actions";
import { Design } from "../../redux/catalog/types";
import { WorkspaceItem } from "./WorkspaceItem";

interface StateProps extends WorkspaceState {
  machines: OrderedMap<number, Machine>;
  templates: OrderedMap<number, Template>;
  catalog: OrderedMap<number, Design>;
  invertZoom: boolean;
}

interface DispatchProps {
  onDropDesign: (id: number, slotIndex: number) => any;
  hoverTask: (index: number) => any;
}

type CombinedProps = StateProps & DispatchProps;

interface WorkspaceComponentState {
  isPanning: boolean;
  offsetX: number;
  offsetY: number;
  zoomX: number;
  zoomY: number;
  zoom: number;
}

const ZOOM_FACTOR = 1.5;

export class Workspace extends React.Component<CombinedProps, WorkspaceComponentState> {
  constructor(props: CombinedProps) {
    super(props);

    this.state = {
      isPanning: false,
      offsetX: 0,
      offsetY: 0,
      zoomX: 50,
      zoomY: 50,
      zoom: 1,
    };
  }

  private panStartEvent: React.PointerEvent<HTMLElement> = null;
  private panStartOffsetX: number = null;
  private panStartOffsetY: number = null;

  private startPanning = (e: React.PointerEvent<HTMLElement>) => {
    // we're only interested in regular clicks and middle clicks
    if (e.button === 0 || e.button === 1) {
      e.persist();
      e.stopPropagation();
      e.preventDefault();
      this.panStartEvent = e;
      this.panStartOffsetX = this.state.offsetX;
      this.panStartOffsetY = this.state.offsetY;
      e.currentTarget.setPointerCapture(e.pointerId);
      this.setState({ isPanning: true });
    }
  }

  private onMouseMove = (e: React.PointerEvent<HTMLElement>) => {
    this.setState({
      offsetX: this.panStartOffsetX + e.screenX - this.panStartEvent.screenX,
      offsetY: this.panStartOffsetY + e.screenY - this.panStartEvent.screenY,
    });
  }

  private stopPanning = (e: React.PointerEvent<HTMLElement>) => {
    e.currentTarget.releasePointerCapture(this.panStartEvent.pointerId);
    this.setState({ isPanning: false });
    this.panStartEvent = null;
    this.panStartOffsetX = null;
    this.panStartOffsetY = null;
  }

  private cancelPanning = () => {
    this.setState({
      offsetX: this.panStartOffsetX,
      offsetY: this.panStartOffsetY,
    });
  }

  private onZoom = (e: React.WheelEvent<HTMLElement>) => {
    if (e.deltaY !== 0) {
      let { zoom, offsetX, offsetY } = this.state;

      // this is equivalent to "zoom in XOR invertZoom"
      if (e.deltaY < 0 !== this.props.invertZoom)
        zoom *= ZOOM_FACTOR;
      else
        zoom /= ZOOM_FACTOR;

      // snap to 100%
      if (Math.abs(1.0 - zoom) < 0.1)
        zoom = 1.0;

      const elementOffset = e.currentTarget.getBoundingClientRect();

      const zoomX = e.clientX - elementOffset.left - offsetX;
      const zoomY = e.clientY - elementOffset.top - offsetY;
      // console.log(e.nativeEvent);

      this.setState({ zoom, zoomX, zoomY });
      console.log(`${zoomX}, ${zoomY}`);
    }
  }

  private renderTaskItems(): JSX.Element[] {
    const { activeJob, catalog, hoverTaskIndex, hoverTask } = this.props;
    const tasks = activeJob ? activeJob.tasks : [];
    return tasks.reduce<JSX.Element[]>((items, task, index) => {
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
  }

  private renderTemplateSlots(): JSX.Element[] {
    const { templates, templateID, onDropDesign } = this.props;
    const template = templates.get(templateID);
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

  private getZoomStyle = (): React.CSSProperties => {
    const { zoom, zoomX, zoomY } = this.state;
    return {
      transform: `scale(${zoom})`,
      transformOrigin: `${zoomX}px ${zoomY}px`,
    };
  }

  private getTranslateStyle = (): React.CSSProperties => {
    return { transform: `translate(${this.state.offsetX}px, ${this.state.offsetY}px)` };
  }

  public render() {
    const { machines, machineID } = this.props;
    const { isPanning } = this.state;
    const machine = machines.get(machineID);
    if (!machine)
      return null;

    const machineBedStyle: React.CSSProperties = {
      width: Math.abs(machine.offsetLeft - machine.offsetRight),
      height: Math.abs(machine.offsetBack - machine.offsetFront),
    };

    const wrapperClassList = ["machine-bed-wrapper"];
    if (isPanning)
      wrapperClassList.push("panning");

    return (
      <div className="panel workspace-panel">
        <WorkspaceMenuConnected />
          <div
            className={wrapperClassList.join(" ")}
            onPointerDownCapture={this.startPanning}
            onPointerMoveCapture={isPanning ? this.onMouseMove : undefined}
            onPointerUpCapture={isPanning ? this.stopPanning : undefined}
            onPointerCancelCapture={this.cancelPanning}
            onWheelCapture={this.onZoom}
          >
            <div className="machine-bed-translate" style={this.getTranslateStyle()}>
              <div className="machine-bed-zoom" style={this.getZoomStyle()}>
              <div className="machine-bed" style={machineBedStyle}>
                {this.renderTaskItems()}
                {this.renderTemplateSlots()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  ...state.workspace,
  machines: state.settings.machines.items,
  templates: state.templates.items,
  catalog: state.catalog.items,
  invertZoom: false, // TODO: make it real (state.settings.preferences.invertZoom)
});

const mapDispatchToProps = ({
  onDropDesign: actions.updateTemplateSlot,
  hoverTask: actions.hoverTask,
});


export const WorkspaceConnected = connect(mapStateToProps, mapDispatchToProps)(Workspace);
