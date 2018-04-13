import * as React from "react";
import { Design } from "../../redux/catalog/types";
import { calculateImageSize } from "../../redux/catalog/utils";
import { LoadingSpinner } from "../LoadingSpinner";

export interface DesignThumbnailProps {
  design: Design;
  size: number;
  onClick?: () => void;
}

export const DesignThumbnail: React.SFC<DesignThumbnailProps> = props => {
  const { design, size, onClick } = props;
  const { isFetching, width, height, imageData } = design;
  if (isFetching) {
    return <div className="design loading"><LoadingSpinner /></div>;
  } else {
    const imageSize = calculateImageSize(width, height, size);
    return (
      <div className="design" onClick={onClick}>
        <img src={imageData} style={imageSize} />
      </div>
    );
  }
};
