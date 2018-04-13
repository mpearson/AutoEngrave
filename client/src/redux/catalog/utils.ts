import * as React from "react";

/**
 * Calculates dimensions for image thumbnail so that no side is longer than
 * MAX_IMAGE_SIZE and, if possible, no side is shorter than MIN_IMAGE_SIZE
 */
export function calculateImageSize(
  srcWidth: number,
  srcHeight: number,
  size: number
): React.CSSProperties {
  let width: number;
  let height: number;
  const aspect = srcWidth / srcHeight;
  if (aspect >= 1.0) {
    width = size;
    height = size / aspect;
  } else {
    height = size;
    width = size * aspect;
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
