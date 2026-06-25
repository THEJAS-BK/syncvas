import { useEffect } from "react";
import type { MutableRefObject, RefObject } from "react";
import type {
  Shape,
  Line,
  TextBox,
  CanvasElement,
  BoardImage,
  ActiveStroke,
  Point,
  Stroke,
} from "../types";
import { redraw } from "../canvas";

// ---- hit tests ----

function hitTestShape(shape: Shape, x: number, y: number): boolean {
  const left = Math.min(shape.x, shape.x + shape.width);
  const top = Math.min(shape.y, shape.y + shape.height);
  const right = Math.max(shape.x, shape.x + shape.width);
  const bottom = Math.max(shape.y, shape.y + shape.height);

  switch (shape.shapeType) {
    case "square":
      return x >= left && x <= right && y >= top && y <= bottom;

    case "circle": {
      const cx = (left + right) / 2;
      const cy = (top + bottom) / 2;
      const rx = (right - left) / 2;
      const ry = (bottom - top) / 2;
      if (rx === 0 || ry === 0) return false;
      return (x - cx) ** 2 / rx ** 2 + (y - cy) ** 2 / ry ** 2 <= 1;
    }

    case "diamond": {
      const cx = (left + right) / 2;
      const cy = (top + bottom) / 2;
      const rx = (right - left) / 2;
      const ry = (bottom - top) / 2;
      if (rx === 0 || ry === 0) return false;
      return Math.abs(x - cx) / rx + Math.abs(y - cy) / ry <= 1;
    }
  }
}

function hitTestLine(line: Line, x: number, y: number, scale: number): boolean {
  const dx = line.x2 - line.x1;
  const dy = line.y2 - line.y1;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return false;

  const t = Math.max(
    0,
    Math.min(1, ((x - line.x1) * dx + (y - line.y1) * dy) / lenSq),
  );
  const closestX = line.x1 + t * dx;
  const closestY = line.y1 + t * dy;

  // tolerance of 6px in screen space → divide by scale to get canvas space
  return Math.hypot(x - closestX, y - closestY) < 6 / scale;
}

function hitTestTextBox(
  tb: TextBox,
  x: number,
  y: number,
  ctx: CanvasRenderingContext2D,
): boolean {
  ctx.font = `${tb.fontSize}px monospace`;
  const lines = tb.text.split("\n");
  const lineHeight = tb.fontSize * 1.2;
  const width = Math.max(...lines.map((l) => ctx.measureText(l).width));
  const height = lines.length * lineHeight;
  return x >= tb.x && x <= tb.x + width && y >= tb.y && y <= tb.y + height;
}

// ---- hook ----
export function useSelection(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  camera: MutableRefObject<{ x: number; y: number; scale: number }>,
  images: RefObject<BoardImage[]>,
  imageCache: RefObject<Map<string, HTMLImageElement>>,
  activeStrokes: RefObject<Record<string, ActiveStroke>>,
  currentStroke: RefObject<Point[]>,
  strokes: RefObject<Stroke[]>,
  shapesRef: RefObject<Shape[]>,
  activeShape: RefObject<Shape | null>,
  linesRef: RefObject<Line[]>,
  activeLine: RefObject<Line | null>,
  selectedId: React.RefObject<string | null>,  
  userIdRef: React.RefObject<string | null>,
  color: string,
  activeTool: string | null,
  textBoxesRef?: React.RefObject<TextBox[]>,
  activeTextBox?: React.RefObject<TextBox | null>,
) {
  const toCanvas = (clientX: number, clientY: number) => ({
    x: (clientX - camera.current.x) / camera.current.scale,
    y: (clientY - camera.current.y) / camera.current.scale,
  });

  const doRedraw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    redraw(
      canvas,
      ctx,
      camera,
      images,
      imageCache,
      activeStrokes,
      currentStroke,
      strokes,
      userIdRef.current!,
      color,
      shapesRef,
      activeShape,
      linesRef,
      activeLine,
      selectedId,
      textBoxesRef,
      activeTextBox,
    );
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onMouseDown = (e: MouseEvent) => {
      if (activeTool !== "mouse") return;
      const { x, y } = toCanvas(e.clientX, e.clientY);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // reverse so topmost (last drawn) wins
      const hitShape = [...shapesRef.current]
        .reverse()
        .find((s) => hitTestShape(s, x, y));

      const hitLine = [...linesRef.current]
        .reverse()
        .find((l) => hitTestLine(l, x, y, camera.current.scale));

      const hitText = [...(textBoxesRef?.current ?? [])]
        .reverse()
        .find((t) => hitTestTextBox(t, x, y, ctx));

      const hit = hitShape ?? hitLine ?? hitText;
      selectedId.current = hit?.id ?? null;
      doRedraw();
    };

    canvas.addEventListener("mousedown", onMouseDown);
    return () => canvas.removeEventListener("mousedown", onMouseDown);
  }, [activeTool, color]);
}
