import React, {
  useEffect,
  useRef,
  type MutableRefObject,
  type RefObject,
} from "react";
import type {
  ActiveStroke,
  BoardImage,
  Line,
  Point,
  Shape,
  Stroke,
  TextBox,
} from "../types";
import { hitTestLine, hitTestShape, hitTestTextBox } from "../tools/hitTests";
import { socket } from "../../../../services/socket";
import { redraw } from "../canvas";

export function useDeleteElement(
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
  linesRef: React.RefObject<Line[]>,
  activeLine: React.RefObject<Line | null>,
  selectedId: React.RefObject<string | null>,
  textBoxesRef: React.RefObject<TextBox[]>,
  activeTextBox: React.RefObject<TextBox | null>,
) {
  const toCanvas = (clientX: number, clientY: number) => ({
    x: (clientX - camera.current.x) / camera.current.scale,
    y: (clientY - camera.current.y) / camera.current.scale,
  });
  const isShapeEraser = useRef<boolean>(false);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const onMouseDown = () => {
      if (activeTool !== "eraser") return;
      isShapeEraser.current = true;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isShapeEraser.current || activeTool !== "eraser") return;
      const { x, y } = toCanvas(e.clientX, e.clientY);

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

      let id = "";

      if (hitShape) {
        id = hitShape.id;
        shapesRef.current = shapesRef.current.filter(
          (s) => s.id !== hitShape.id,
        );
      }
      if (hitLine) {
        id = hitLine.id;
        linesRef.current = linesRef.current.filter((l) => l.id !== hitLine.id);
      }
      if (hitText) {
        id = hitText.id;
        textBoxesRef.current = textBoxesRef.current.filter(
          (t) => t.id !== hitText.id,
        );
      }
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
      socket.emit("element-delete", { roomId, id });
    };

    const onMouseUp = () => {
      isShapeEraser.current = false;
    };

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [activeTool]);
}
