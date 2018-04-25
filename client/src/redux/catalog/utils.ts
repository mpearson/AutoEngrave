import * as React from "react";
import { ImageMetadata, Design } from "./types";

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

export function loadImage(file: File) {
  return new Promise<ImageMetadata>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => resolve({
        imageData: image.src,
        width: image.width,
        height: image.height,
        filetype: file.type,
        dpi: 72, // how the balls do we detect this? look for friggin Inkscape SVG comments? yuck
      });
      image.src = reader.result;
      // image.src = buildImageDataURL(file.type, reader.result);
    };

    // if (file.type === "image/svg+xml")
    //   reader.readAsText(file);
    // else if (file.type.startsWith("image/"))
    if (file.type.startsWith("image/"))
      reader.readAsDataURL(file);
    else
      reject("aint no image file homes");
  });
}

export function uploadDesigns(files: FileList, onUpload: (design: Design) => void) {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    loadImage(file).then(
      metadata => onUpload({
        name: file.name.replace(/\.\w+$/i, ""),
        description: "",
        ...metadata,
      }),
      (error) => {
        console.error(error);
      }
    );
  }
}
