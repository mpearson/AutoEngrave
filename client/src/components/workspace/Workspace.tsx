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

interface WorkspaceComponentState {
  isPanning: boolean;
  translateX: number;
  translateY: number;
  zoom: number;
}

const ZOOM_FACTOR = Math.sqrt(2);
const DEFAULT_PADDING = 10;

export class Workspace extends React.Component<CombinedProps, WorkspaceComponentState> {
  constructor(props: CombinedProps) {
    super(props);

    this.state = {
      isPanning: false,
      translateX: DEFAULT_PADDING,
      translateY: DEFAULT_PADDING,
      zoom: 1,
    };
  }

  private panStartEvent: React.PointerEvent<HTMLElement> = null;
  private panStartOffsetX: number = null;
  private panStartOffsetY: number = null;

  private startPanning = (e: React.PointerEvent<HTMLElement>) => {
    // we're only interested in regular clicks and maybe middle clicks
    if (e.button === 0 || e.button === 1) {
      e.persist();
      e.stopPropagation();
      e.preventDefault();
      this.panStartEvent = e;
      this.panStartOffsetX = this.state.translateX;
      this.panStartOffsetY = this.state.translateY;
      e.currentTarget.setPointerCapture(e.pointerId);
      this.setState({ isPanning: true });
    }
  }

  private onMouseMove = (e: React.PointerEvent<HTMLElement>) => {
    this.setState({
      translateX: this.panStartOffsetX + e.screenX - this.panStartEvent.screenX,
      translateY: this.panStartOffsetY + e.screenY - this.panStartEvent.screenY,
    });
  }

  private stopPanning = (e: React.PointerEvent<HTMLElement>) => {
    e.currentTarget.releasePointerCapture(this.panStartEvent.pointerId);
    this.setState({ isPanning: false });
    this.panStartEvent = null;
    this.panStartOffsetX = null;
    this.panStartOffsetY = null;
  }

  private getNewZoom = (e: React.WheelEvent<HTMLElement>) => {
    let { zoom } = this.state;
    // this test is equivalent to "zoom in XOR invertZoom"
    if (e.deltaY < 0 !== this.props.invertZoom)
      zoom *= ZOOM_FACTOR;
    else
      zoom /= ZOOM_FACTOR;

    // ain't no floating point errors gonna make this shit blurry
    if (Math.abs(1.0 - zoom) < 0.001)
      return 1.0;
    return zoom;
  }

  private onMouseWheel = (e: React.WheelEvent<HTMLElement>) => {
    if (e.deltaY !== 0) {
      const { zoom, translateX, translateY } = this.state;
      const newZoom = this.getNewZoom(e);

      // the projection from workspace coords to viewport coords looks like this:
      //      v = wz + t
      // and the inverse is:
      //      w = (v - t) / z
      // when zooming, we want to keep the workspace coordinate under the mouse fixed:
      //      v = v' and w = w'
      // solving for t' gives:
      //      t' = v - wz'

      // location of workspace viewport in client viewport coordinates
      const elementOffset = e.currentTarget.getBoundingClientRect();

      // location of mouse relative to workspace viewport
      const vx = e.clientX - elementOffset.left;
      const vy = e.clientY - elementOffset.top;

      // convert viewport coordinates to workspace coordinates
      const wx = (vx - translateX) / zoom;
      const wy = (vy - translateY) / zoom;

      // calculate new translation
      const newTranslateX = Math.round(vx - (wx * newZoom));
      const newTranslateY = Math.round(vy - (wy * newZoom));

      this.setState({
        zoom: newZoom,
        translateX: newTranslateX,
        translateY: newTranslateY,
      });
    }
  }

  private onZoomIn = () => this.setState({ zoom: this.state.zoom * ZOOM_FACTOR });

  private onZoomOut = () => this.setState({ zoom: this.state.zoom / ZOOM_FACTOR });

  private onZoomReset = () => {
    this.setState({
      zoom: 1.0,
      translateX: DEFAULT_PADDING,
      translateY: DEFAULT_PADDING,
    });
  }

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

  private getTransformStyle = (): React.CSSProperties => {
    const { zoom, translateX, translateY } = this.state;
    return {
      transform: `translate(${translateX}px, ${translateY}px) scale(${zoom}) `,
    };
  }

  public render() {
    const { machine } = this.props;
    const { isPanning, zoom } = this.state;

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
          onWheelCapture={isPanning ? undefined : this.onMouseWheel}
        >
          <div className="machine-bed-transform" style={this.getTransformStyle()}>
            <div className="machine-bed" style={machineBedStyle}>
              {this.renderTaskItems()}
              {this.renderTemplateSlots()}
            </div>
          </div>
        </div>
        <div className="zoom-buttons">
          <div className="button-group">
            <button className="fas fa-plus" title="Zoom in" onClick={this.onZoomIn} />
            <button className="fas fa-minus" title="Zoom out" onClick={this.onZoomOut} />
            <button className="fas fa-expand" title="Reset zoom" onClick={this.onZoomReset} />
          </div>
          <div className="zoom-indicator">{Math.round(zoom * 100) + "%"}</div>
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
