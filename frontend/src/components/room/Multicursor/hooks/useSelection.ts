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
import { hitTestCorner, hitTestRotationHandle } from "../canvas";

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

  //resize code
  const isResizing = useRef(false);
  const resizeCorner = useRef<"tl" | "tr" | "bl" | "br" | null>(null);
  const resizeOrigin = useRef({ x: 0, y: 0 }); // the fixed opposite corner

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

      //!resize shapes textbox and lines
      if (selectedId.current) {
        const selectedShape = shapesRef.current.find(
          (s) => s.id === selectedId.current,
        );
        if (selectedShape) {
          //resize
          const corner = hitTestCorner(
            selectedShape,
            x,
            y,
            camera.current.scale,
          );
          if (corner) {
            isResizing.current = true;
            resizeCorner.current = corner;

            const left = Math.min(
              selectedShape.x,
              selectedShape.x + selectedShape.width,
            );
            const top = Math.min(
              selectedShape.y,
              selectedShape.y + selectedShape.height,
            );
            const right = Math.max(
              selectedShape.x,
              selectedShape.x + selectedShape.width,
            );
            const bottom = Math.max(
              selectedShape.y,
              selectedShape.y + selectedShape.height,
            );

            resizeOrigin.current = {
              x: corner.includes("l") ? right : left,
              y: corner.includes("t") ? bottom : top,
            };
            return;
          }
        }
      }

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

      //!moving shapes,textbox and lines
      if (hitShape) {
        isDragging.current = true;
        dragType.current = "shape";
        dragOffset.current = { x: x - hitShape.x, y: y - hitShape.y };
      } else if (hitText) {
        isDragging.current = true;
        dragType.current = "textbox";
        dragOffset.current = { x: x - hitText.x, y: y - hitText.y };
      } else if (hitLine) {
        isDragging.current = true;
        dragType.current = "line";
        lineDragOffset.current = {
          x1: x - hitLine.x1,
          x2: x - hitLine.x2,
          y1: y - hitLine.y1,
          y2: y - hitLine.y2,
        };
      }

      const hit = hitShape ?? hitLine ?? hitText;
      selectedId.current = hit?.id ?? null;
      doRedraw();
    };

    const onMouseMove = (e: MouseEvent) => {
     if (!isDragging.current && !isResizing.current) return;
      if (!selectedId.current) return;
      const { x, y } = toCanvas(e.clientX, e.clientY);

      //!resize shapes,textbox and lines
      if (isResizing.current && selectedId.current) {
        const shape = shapesRef.current.find(
          (s) => s.id === selectedId.current,
        );
        if (!shape) return;

        const ox = resizeOrigin.current.x;
        const oy = resizeOrigin.current.y;
        const minSize = 10;

        switch (resizeCorner.current) {
          case "br":
            shape.width = Math.max(minSize, x - ox);
            shape.height = Math.max(minSize, y - oy);
            break;
          case "bl": {
            const newWidth = Math.max(minSize, ox - x);
            shape.x = ox - newWidth;
            shape.width = newWidth;
            shape.height = Math.max(minSize, y - oy);
            break;
          }
          case "tr": {
            const newHeight = Math.max(minSize, oy - y);
            shape.y = oy - newHeight;
            shape.height = newHeight;
            shape.width = Math.max(minSize, x - ox);
            break;
          }
          case "tl": {
            const newWidth = Math.max(minSize, ox - x);
            const newHeight = Math.max(minSize, oy - y);
            shape.x = ox - newWidth;
            shape.y = oy - newHeight;
            shape.width = newWidth;
            shape.height = newHeight;
            break;
          }
        }

        socket.emit("element-update", {
          roomId,
          id: shape.id,
          changes: {
            x: shape.x,
            y: shape.y,
            width: shape.width,
            height: shape.height,
          },
        });
        doRedraw();
        return;
      }

      //!moving elements
      if (dragType.current === "shape" || dragType.current === "textbox") {
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
        }

        socket.emit("element-update", {
          roomId,
          id: selectedId.current,
          changes: { x: newX, y: newY },
        });
      }

      if (dragType.current === "line") {
        const line = linesRef.current.find((l) => l.id === selectedId.current);
        if (line)
          Object.assign(line, {
            x1: x - lineDragOffset.current.x1,
            y1: y - lineDragOffset.current.y1,
            x2: x - lineDragOffset.current.x2,
            y2: y - lineDragOffset.current.y2,
          });

        socket.emit("element-update", {
          roomId,
          id: selectedId.current,
          changes: {
            x1: x - lineDragOffset.current.x1,
            y1: y - lineDragOffset.current.y1,
            x2: x - lineDragOffset.current.x2,
            y2: y - lineDragOffset.current.y2,
          },
        });
      }

      doRedraw();
    };

    const onMouseUp = () => {
      if (isResizing.current) {
        isResizing.current = false;
        resizeCorner.current = null;
        doRedraw();
        return;
      }
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
