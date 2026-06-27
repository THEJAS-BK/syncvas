import { useEffect, useRef } from "react";
import type { MutableRefObject, RefObject } from "react";
import type { BoardImage, ActiveStroke, Point, Stroke, Shape, Line, TextBox } from "../types";
import { redraw } from "../canvas";

export function useHandTool(
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
  selectedId: RefObject<string | null>,
  textBoxesRef: RefObject<TextBox[]>,
  activeTextBox: RefObject<TextBox | null>,
  userIdRef: MutableRefObject<string>,
  color: string,
  activeTool: string | null,
) {
  const isPanning = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const doRedraw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    redraw(canvas, ctx, camera, images, imageCache, activeStrokes, currentStroke, strokes, userIdRef.current, color, shapesRef, activeShape, linesRef, activeLine, selectedId, textBoxesRef, activeTextBox);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onMouseDown = (e: MouseEvent) => {
      if (activeTool !== "hand") return;
      isPanning.current = true;
      lastPos.current = { x: e.clientX, y: e.clientY };
      canvas.style.cursor = "grabbing";
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isPanning.current) return;
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      camera.current.x += dx;
      camera.current.y += dy;
      lastPos.current = { x: e.clientX, y: e.clientY };
      doRedraw();
    };

    const onMouseUp = () => {
      isPanning.current = false;
      canvas.style.cursor = "grab";
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