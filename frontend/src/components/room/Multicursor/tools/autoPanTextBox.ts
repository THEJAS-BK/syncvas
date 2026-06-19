import { redraw } from "../canvas";
import type { Stroke, Point, BoardImage, ActiveStroke } from "../types";

export function autoPanIfNeeded(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  camera: React.RefObject<{ x: number; y: number; scale: number }>,
  textareaRight: number,
  textareaBottom: number,
  images: React.RefObject<BoardImage[]>,
  imageCache: React.RefObject<Map<string, HTMLImageElement>>,
  activeStrokes: React.RefObject<Record<string, ActiveStroke>>,
  currentStroke: React.RefObject<Point[]>,
  strokes: React.RefObject<Stroke[]>,
  userId: string,
  color: string,
  onPan: () => void,
): boolean {
  const margin = 40;
  let panned = false;

  if (textareaRight > window.innerWidth - margin) {
    const overflow = textareaRight - (window.innerWidth - margin);
    camera.current.x -= overflow;
    panned = true;
  }

  if (textareaBottom > window.innerHeight - margin) {
    const overflow = textareaBottom - (window.innerHeight - margin);
    camera.current.y -= overflow;
    panned = true;
  }

  if (panned) {
    redraw(
      canvas,
      ctx,
      camera,
      images,
      imageCache,
      activeStrokes,
      currentStroke,
      strokes,
      userId,
      color,
    );
    onPan();
  }

  return panned;
}