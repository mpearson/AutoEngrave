import * as React from "react";
import { Design } from "../../redux/catalog/types";
import { calculateSize } from "../../redux/catalog/utils";

export interface DesignThumbnailProps {
  design: Design;
  onClick: () => void;
}

export const DesignThumbnail: React.SFC<DesignThumbnailProps> = props => {
  const imageSize = calculateSize(props.design.width, props.design.height, 50, 200);
  return (
    <div className="design" onClick={props.onClick}>
      <img src={"data:image/svg+xml;utf8," + props.design.imageData} style={imageSize} />
    </div>
  );
};
