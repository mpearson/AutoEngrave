import "./zoom-area.less";

import * as React from "react";

const DEFAULT_ZOOM_FACTOR = Math.pow(2, 0.25); // Math.sqrt(2);

export interface ZoomAreaProps {
  invertZoom?: boolean;
  constrainContent?: boolean;
  zoomFactor?: number;
  className?: string;
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
      translateX: 0,
      translateY: 0,
      zoom: 1,
    };
  }

  static defaultProps = {
    invertZoom: false,
    constrainContent: false,
    zoomFactor: DEFAULT_ZOOM_FACTOR,
  };

  private panStartEvent: React.PointerEvent<HTMLElement> = null;
  private panStartOffsetX: number = null;
  private panStartOffsetY: number = null;

  private zoomAreaWidth: number = null;
  private zoomAreaHeight: number = null;
  private contentWidth: number = null;
  private contentHeight: number = null;

  private zoomArea = React.createRef<HTMLDivElement>();
  private zoomTransform = React.createRef<HTMLDivElement>();

  private updateZoomBounds = () => {
    this.zoomAreaWidth = this.zoomArea.current.clientWidth;
    this.zoomAreaHeight = this.zoomArea.current.clientHeight;
    this.contentWidth = this.zoomTransform.current.clientWidth;
    this.contentHeight = this.zoomTransform.current.clientHeight;
  }

  private startPanning = (e: React.PointerEvent<HTMLElement>) => {
    // we're only interested in regular clicks and maybe middle clicks
    if (e.button === 0 || e.button === 1) {
      e.persist();
      e.stopPropagation();
      e.preventDefault();
      this.panStartEvent = e;
      this.panStartOffsetX = this.state.translateX;
      this.panStartOffsetY = this.state.translateY;
      this.updateZoomBounds();

      e.currentTarget.setPointerCapture(e.pointerId);
      this.setState({ isPanning: true });
    }
  }

  private constrainTranslateX = (x: number, zoom: number) => {
    if (this.props.constrainContent) {
      return Math.min(0, Math.max(x, this.zoomAreaWidth - this.contentWidth * zoom));

      // // alternately, this version doesn't lock to the upper left when zoomed out all the way:
      // const width =  this.contentWidth * zoom;
      // const max = Math.max(0, this.zoomAreaWidth - width);
      // const min = Math.min(0, this.zoomAreaWidth - width);
      // return Math.min(max, Math.max(x, min));
    } else {
      return x;
    }
  }

  private constrainTranslateY = (y: number, zoom: number) => {
    if (this.props.constrainContent)
      return Math.min(0, Math.max(y, this.zoomAreaHeight - this.contentHeight * zoom));
    else
      return y;
  }

  private onMouseMove = (e: React.PointerEvent<HTMLElement>) => {
    const translateX = this.panStartOffsetX + e.screenX - this.panStartEvent.screenX;
    const translateY = this.panStartOffsetY + e.screenY - this.panStartEvent.screenY;

    this.setState({
      translateX: this.constrainTranslateX(translateX, this.state.zoom),
      translateY: this.constrainTranslateY(translateY, this.state.zoom),
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
    const { zoomFactor } = this.props;
    let { zoom } = this.state;

    if (zoomIn) {
      // zoom in slower if we're going below 100%
      zoom *= (zoom >= 1 ? zoomFactor : Math.sqrt(zoomFactor));
    } else {
      zoom /= (zoom > 1 ? zoomFactor : Math.sqrt(zoomFactor));
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

      this.updateZoomBounds();

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
        translateX: this.constrainTranslateX(newTranslateX, newZoom),
        translateY: this.constrainTranslateY(newTranslateY, newZoom),
      });
    }
  }

  public zoomIn = () => this.setState({ zoom: this.getNextZoom(true) });

  public zoomOut = () => this.setState({ zoom: this.getNextZoom(false) });

  public zoomFit = () => {
    this.updateZoomBounds();
    const zoom = Math.min(
      this.zoomAreaWidth / this.contentWidth,
      this.zoomAreaHeight / this.contentHeight
    );

    this.setState({
      zoom,
      translateX: 0,
      translateY: 0,
    });
  }

  public zoomReset = () => {
    this.setState({
      zoom: 1.0,
      translateX: 0,
      translateY: 0,
    });
  }

  private getTransformStyle = (): React.CSSProperties => {
    const { zoom, translateX, translateY } = this.state;
    return {
      transform: `translate(${translateX}px, ${translateY}px) scale(${zoom}) `,
    };
  }

  public render() {
    const { children, className } = this.props;
    const { isPanning } = this.state;

    const wrapperClassList = ["zoom-area"];
    if (isPanning)
      wrapperClassList.push("panning");
    if (className)
      wrapperClassList.push(className);

    return (
      <div
        className={wrapperClassList.join(" ")}
        onPointerDownCapture={this.startPanning}
        onPointerMoveCapture={isPanning ? this.onMouseMove : undefined}
        onPointerUpCapture={isPanning ? this.stopPanning : undefined}
        onWheelCapture={isPanning ? undefined : this.onMouseWheel}
        ref={this.zoomArea}
      >
        <div className="zoom-area-transform" style={this.getTransformStyle()} ref={this.zoomTransform}>
          {children}
        </div>
      </div>
    );
  }
}
