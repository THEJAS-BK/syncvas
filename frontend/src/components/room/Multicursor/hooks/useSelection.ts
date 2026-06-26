import { useEffect, useRef } from "react";
import type { MutableRefObject, RefObject } from "react";
import type {
  Shape,
  Line,
  TextBox,
  BoardImage,
  ActiveStroke,
  Point,
  Stroke,
} from "../types";
import { redraw } from "../canvas";
import { hitTestLine, hitTestShape, hitTestTextBox } from "../tools/hitTests";
import { socket } from "../../../../services/socket";

export function useSelection(
  roomId: string,
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
  textBoxesRef: React.RefObject<TextBox[]>,
  activeTextBox?: React.RefObject<TextBox | null>,
) {
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const lineDragOffset = useRef({ x1: 0, x2: 0, y1: 0, y2: 0 });
  const dragType = useRef<"shape" | "textbox" | "line" | null>(null);
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

      //moving shapes,textbox and lines
      if (hitShape) {
        isDragging.current = true;
        dragType.current = "shape";
        dragOffset.current = { x: x - hitShape.x, y: y - hitShape.y };
      }

      if (hitText) {
        isDragging.current = true;
        dragType.current = "textbox";
        dragOffset.current = { x: x - hitText.x, y: y - hitText.y };
      }
      if (hitLine) {
        isDragging.current = true;
        dragType.current = "line";
        lineDragOffset.current = {
          x1: x-hitLine.x1,
          x2: x-hitLine.x2,
          y1: y-hitLine.y1,
          y2: y-hitLine.y2,
        };
      }

      const hit = hitShape ?? hitLine ?? hitText;
      selectedId.current = hit?.id ?? null;
      doRedraw();
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !selectedId.current) return;
      const { x, y } = toCanvas(e.clientX, e.clientY);


      //moving elements
      const newX = x - dragOffset.current.x;
      const newY = y - dragOffset.current.y;
      if (dragType.current === "shape") {
        const shape = shapesRef.current.find(
          (s) => s.id === selectedId.current,
        );
        if (shape) Object.assign(shape, { x: newX, y: newY });
      } else if (dragType.current === "textbox") {
        const tb = textBoxesRef.current.find(
          (t) => t.id === selectedId.current,
        );
        if (tb) Object.assign(tb, { x: newX, y: newY });
      } else if (dragType.current === "line") {
        const line = linesRef.current.find((l) => l.id === selectedId.current);
        if (line)
          Object.assign(line, {
            x1: x - lineDragOffset.current.x1,
            y1: y - lineDragOffset.current.y1,
            x2: x - lineDragOffset.current.x2,
            y2: y - lineDragOffset.current.y2,
          });
      }

      socket.emit("element-update", {
        roomId,
        id: selectedId.current,
        changes: { x: newX, y: newY },
      });
      doRedraw();
    };

    const onMouseUp = () => {
      if (!isDragging.current || !selectedId.current) return;
      isDragging.current = false;
      dragType.current = null;
      doRedraw();
    };

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [activeTool, color]);
}
