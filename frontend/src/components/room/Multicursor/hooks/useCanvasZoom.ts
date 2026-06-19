import React, { useEffect } from "react";
import type { ActiveStroke, BoardImage, Line, Point, Shape, Stroke } from "../types";
import { redraw } from "../canvas";

export function useCanvasZoom(
  wrapperRef: React.RefObject<HTMLDivElement | null>,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  camera: React.RefObject<any>,
  images: React.RefObject<BoardImage[]>,
  imageCache: React.RefObject<Map<string, HTMLImageElement>>,
  activeStrokes: React.RefObject<Record<string, ActiveStroke>>,
  currentStroke: React.RefObject<Point[]>,
  strokes: React.RefObject<Stroke[]>,
  userIdRef: React.RefObject<string>,
  color: string,
  onCameraChange?: () => void,
  shapesRef?: React.RefObject<Shape[]>,
  activeShape?: React.RefObject<Shape | null>,
  linesRef?: React.RefObject<Line[]>,
activeLine?: React.RefObject<Line | null>,
) {
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      if (e.ctrlKey) {
        const zoomAmount = e.deltaY * -0.001;
        const oldScale = camera.current.scale;
        const newScale = Math.min(Math.max(0.2, oldScale + zoomAmount), 5);

        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const worldX = (mouseX - camera.current.x) / oldScale;
        const worldY = (mouseY - camera.current.y) / oldScale;
        camera.current.scale = newScale;
        camera.current.x = mouseX - worldX * newScale;
        camera.current.y = mouseY - worldY * newScale;
      } else if (e.shiftKey) {
        camera.current.x -= e.deltaY;
      } else {
        camera.current.y -= e.deltaY;
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
      activeLine
      );

      onCameraChange?.();
    };

    wrapper.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      wrapper.removeEventListener("wheel", handleWheel);
    };
  }, [onCameraChange]);
}
