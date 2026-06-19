import type { BoardImage, Point } from "../types";

export function getClickedImage(images: BoardImage[], point: Point): number {
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    if (
      point.x >= img.x &&
      point.x <= img.x + img.width &&
      point.y >= img.y &&
      point.y <= img.y + img.height
    ) {
      return i;
    }
  }
  return -1;
}
