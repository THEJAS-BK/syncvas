import { useEffect, useRef, useState } from "react";
import { socket } from "../../../../services/socket";
import type { RefObject, MutableRefObject } from "react";
import type {
  Shape,
  CanvasElement,
  BoardImage,
  ActiveStroke,
  Point,
  Stroke,
  Line,
  TextBox,
} from "../types";
import { redraw } from "../canvas";

// maps the active tool name to the shape type stored on the element
const TOOL_TO_SHAPE: Record<string, "square" | "circle" | "diamond"> = {
  square: "square",
  circle: "circle",
  diamond: "diamond",
};

export function useShapes(
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
  userIdRef: MutableRefObject<string>,
  color: string,
  filled: boolean,
  activeTool: string | null,
  linesRef?: React.RefObject<Line[]>,
  activeLine?: React.RefObject<Line | null>,
  selectedId?: React.RefObject<string | null>,
  textBoxesRef?: React.RefObject<TextBox[]>,
  activeTextBox?: React.RefObject<TextBox | null>,
) {
  const isDragging = useRef(false);
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
      userIdRef.current,
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

  const toCanvas = (clientX: number, clientY: number) => ({
    x: (clientX - camera.current.x) / camera.current.scale,
    y: (clientY - camera.current.y) / camera.current.scale,
  });

  // ---- native mouse listeners on canvas ----
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const shapeType = activeTool ? TOOL_TO_SHAPE[activeTool] : undefined;

    const onMouseDown = (e: MouseEvent) => {
      if (!shapeType) return;
      const { x, y } = toCanvas(e.clientX, e.clientY);
      isDragging.current = true;
      activeShape.current = {
        id: crypto.randomUUID(),
        type: "shape",
        shapeType: activeTool as "square" | "circle" | "diamond",
        x,
        y,
        width: 0,
        height: 0,
        color,
        filled,
        userId: userIdRef.current,
      };

      const shape = activeShape.current;
      socket.emit("element-add", { roomId, element: shape });
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !activeShape.current) return;
      const { x, y } = toCanvas(e.clientX, e.clientY);
      activeShape.current = {
        ...activeShape.current,
        width: x - activeShape.current.x,
        height: y - activeShape.current.y,
      };

      const shape = activeShape.current;
      socket.emit("element-update", {
        roomId,
        id: shape.id,
        changes: { width: shape.width, height: shape.height },
      });
      requestAnimationFrame(doRedraw);
    };

    const onMouseUp = () => {
      if (!isDragging.current || !activeShape.current) return;
      isDragging.current = false;

      const shape = activeShape.current;
      activeShape.current = null;

      if (Math.abs(shape.width) < 5 && Math.abs(shape.height) < 5) {
        doRedraw();
        return;
      }

      shapesRef.current = [...shapesRef.current, shape];
      doRedraw();
    };

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseup", onMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseup", onMouseUp);
    };
  }, [activeTool, color, filled]);

  // ---- socket listeners ----
  useEffect(() => {
    const onElementAdd = (el: CanvasElement) => {
      if (el.type !== "shape") return;
      shapesRef.current = [...shapesRef.current, el];
      doRedraw();
    };

    const onElementUpdate = ({
      id,
      changes,
    }: {
      id: string;
      changes: Partial<Shape>;
    }) => {
      shapesRef.current = shapesRef.current.map((s) =>
        s.id === id ? { ...s, ...changes } : s,
      );
      doRedraw();
    };

    const onElementDelete = (id: string) => {
      shapesRef.current = shapesRef.current.filter((s) => s.id !== id);
      doRedraw();
    };

    const onElementState = (elements: CanvasElement[]) => {
      shapesRef.current = elements.filter(
        (e): e is Shape => e.type === "shape",
      );
      doRedraw();
    };

    socket.on("element-add", onElementAdd);
    socket.on("element-update", onElementUpdate);
    socket.on("element-delete", onElementDelete);
    socket.on("element-state", onElementState);

    return () => {
      socket.off("element-add", onElementAdd);
      socket.off("element-update", onElementUpdate);
      socket.off("element-delete", onElementDelete);
      socket.off("element-state", onElementState);
    };
  }, []);

  const deleteShape = (id: string) => {
    shapesRef.current = shapesRef.current.filter((s) => s.id !== id);
    socket.emit("element-delete", { roomId, id });
    doRedraw();
  };

  return { deleteShape };
}
