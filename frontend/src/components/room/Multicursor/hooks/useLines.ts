import { useEffect, useRef } from "react";
import { socket } from "../../../../services/socket";
import type { RefObject, MutableRefObject } from "react";
import type {
  Line,
  Shape,
  CanvasElement,
  BoardImage,
  ActiveStroke,
  Point,
  Stroke,
  TextBox,
} from "../types";
import { redraw } from "../canvas";

export function useLines(
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
  userIdRef: React.RefObject<string>,
  color: string,
  activeTool: string | null,  selectedId?: React.RefObject<string | null>,
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
          activeTextBox
        );
  };

  const toCanvas = (clientX: number, clientY: number) => ({
    x: (clientX - camera.current.x) / camera.current.scale,
    y: (clientY - camera.current.y) / camera.current.scale,
  });

  // ---- native mouse listeners ----
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onMouseDown = (e: MouseEvent) => {
      if (activeTool !== "line" && activeTool !== "arrow") return;
      const { x, y } = toCanvas(e.clientX, e.clientY);
      isDragging.current = true;
      activeLine.current = {
        id: crypto.randomUUID(),
        type: "line",
        lineType: activeTool === "arrow" ? "arrow" : "straight",
        x1: x,
        y1: y,
        x2: x,
        y2: y,
        color,
        userId: userIdRef.current,
      };
      const line = activeLine.current;
      socket.emit("element-add", { roomId, element: line });
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !activeLine.current) return;
      const { x, y } = toCanvas(e.clientX, e.clientY);
      activeLine.current = {
        ...activeLine.current,
        x2: x,
        y2: y,
      };

      const line = activeLine.current;
      socket.emit("element-update", {
        roomId,
        id: line.id,
        changes: {x1:line.x1, x2: line.x2,y1:line.y1, y2: line.y2 },
      });
      requestAnimationFrame(doRedraw);
    };

    const onMouseUp = () => {
      if (!isDragging.current || !activeLine.current) return;
      isDragging.current = false;

      const line = activeLine.current;
      activeLine.current = null;

      const dx = line.x2 - line.x1;
      const dy = line.y2 - line.y1;
      if (dx * dx + dy * dy < 25) {
        doRedraw();
        return;
      }

      linesRef.current = [...linesRef.current, line];
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
  }, [activeTool, color]);

  // ---- socket listeners ----
  useEffect(() => {
    const onElementAdd = (el: CanvasElement) => {
      if (el.type !== "line") return;
      linesRef.current = [...linesRef.current, el];
      doRedraw();
    };

    const onElementUpdate = ({
      id,
      changes,
    }: {
      id: string;
      changes: Partial<Line>;
    }) => {
      linesRef.current = linesRef.current.map((l) =>
        l.id === id ? { ...l, ...changes } : l,
      );
      doRedraw();
    };

    const onElementDelete = (id: string) => {
      linesRef.current = linesRef.current.filter((l) => l.id !== id);
      doRedraw();
    };

    const onElementState = (elements: CanvasElement[]) => {
      linesRef.current = elements.filter((e): e is Line => e.type === "line");
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

  const deleteLine = (id: string) => {
    linesRef.current = linesRef.current.filter((l) => l.id !== id);
    socket.emit("element-delete", { roomId, id });
    doRedraw();
  };

  return { deleteLine };
}
