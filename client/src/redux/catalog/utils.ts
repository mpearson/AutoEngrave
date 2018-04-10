import * as React from "react";

/**
 * Calculates dimensions for image thumbnail so that no side is longer than
 * MAX_IMAGE_SIZE and, if possible, no side is shorter than MIN_IMAGE_SIZE
 */
export function calculateSize(
  srcWidth: number,
  srcHeight: number,
  maxSize: number,
  minSize: number = 0
): React.CSSProperties {
  let width: number;
  let height: number;
  const aspect = srcWidth / srcHeight;
  if (aspect >= 1.0) {
    height = Math.min(minSize, maxSize / aspect);
    width = height / aspect;
  } else {
    width = Math.min(minSize, maxSize / aspect);
    height = width / aspect;
  }
  return {
    width: width + "px",
    height: height + "px",
  };
}

/**
 * Renders the provided image data, either as SVG text or as base64 dataURL,
 * depending on the filetype.
 */
export function buildImageDataURL(filetype: string, imageData: string) {
  if (filetype === "image/svg+xml")
    return "data:image/svg+xml," + imageData;
  return imageData;
}
