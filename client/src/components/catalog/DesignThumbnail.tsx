import * as React from "react";
import { Design } from "../../redux/catalog/types";
import { calculateSize } from "../../redux/catalog/utils";
import { LoadingSpinner } from "../LoadingSpinner";

export interface DesignThumbnailProps {
  design: Design;
  onClick: () => void;
}

export const DesignThumbnail: React.SFC<DesignThumbnailProps> = props => {
  const { design, onClick } = props;
  if (design.isFetching) {
    return <div className="design loading"><LoadingSpinner /></div>;
  } else {
    const imageSize = calculateSize(design.width, design.height, 50, 200);
    return (
      <div className="design" onClick={onClick}>
        <img src={"data:image/svg+xml;utf8," + design.imageData} style={imageSize} />
      </div>
    );
  }
};
