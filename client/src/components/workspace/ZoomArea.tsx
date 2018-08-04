import "./zoom-area.less";

import * as React from "react";

const ZOOM_FACTOR = Math.sqrt(2);
const ZOOM_FACTOR_SLOW = Math.sqrt(ZOOM_FACTOR);
const DEFAULT_PADDING = 10;

export interface ZoomAreaProps {
  invertZoom?: boolean;
}

interface ZoomAreaState {
  isPanning: boolean;
  translateX: number;
  translateY: number;
  zoom: number;
}

export class ZoomArea extends React.Component<ZoomAreaProps, ZoomAreaState> {
  constructor(props: ZoomAreaProps) {
    super(props);

    this.state = {
      isPanning: false,
      translateX: DEFAULT_PADDING,
      translateY: DEFAULT_PADDING,
      zoom: 1,
    };
  }

  static defaultProps = {
    invertZoom: false,
  };

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

  private getNextZoom = (zoomIn: boolean) => {
    let { zoom } = this.state;

    if (zoomIn) {
      // zoom in slower if we're going below 100%
      zoom *= (zoom >= 1 ? ZOOM_FACTOR : ZOOM_FACTOR_SLOW);
    } else {
      zoom /= (zoom > 1 ? ZOOM_FACTOR : ZOOM_FACTOR_SLOW);
    }

    // ain't no floating point errors gonna make this shit blurry
    if (Math.abs(1.0 - zoom) < 0.001)
      return 1.0;
    return zoom;
  }

  private onMouseWheel = (e: React.WheelEvent<HTMLElement>) => {
    if (e.deltaY !== 0) {
      const { zoom, translateX, translateY } = this.state;

      // this test is equivalent to "zoomIn XOR invertZoom"
      const newZoom = this.getNextZoom(e.deltaY < 0 !== this.props.invertZoom);

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

  public zoomIn = () => this.setState({ zoom: this.getNextZoom(true) });

  public zoomOut = () => this.setState({ zoom: this.getNextZoom(false) });

  public zoomReset = () => {
    this.setState({
      zoom: 1.0,
      translateX: DEFAULT_PADDING,
      translateY: DEFAULT_PADDING,
    });
  }

  private getTransformStyle = (): React.CSSProperties => {
    const { zoom, translateX, translateY } = this.state;
    return {
      transform: `translate(${translateX}px, ${translateY}px) scale(${zoom}) `,
    };
  }

  public render() {
    const { children } = this.props;
    const { isPanning } = this.state;

    const wrapperClassList = ["zoom-area"];
    if (isPanning)
      wrapperClassList.push("panning");

    return (
      <div
        className={wrapperClassList.join(" ")}
        onPointerDownCapture={this.startPanning}
        onPointerMoveCapture={isPanning ? this.onMouseMove : undefined}
        onPointerUpCapture={isPanning ? this.stopPanning : undefined}
        onWheelCapture={isPanning ? undefined : this.onMouseWheel}
      >
        <div className="zoom-area-transform" style={this.getTransformStyle()}>
          {children}
        </div>
      </div>
    );
  }
}
