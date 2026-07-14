import { useEffect, useRef } from "react";
import type { Stroke, Point } from "../../room/Multicursor/types.ts";
import {getCanvasPoint, isPointNearStroke } from "../../room/Multicursor/canvas.ts";

export function useOfflineEraser(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  camera: React.RefObject<any>,
  strokes: React.RefObject<Stroke[]>,
  activeTool: string | null,
  doRedraw: () => void,
) {
  const eraseAtPoint = (point: Point) => {
    const before = strokes.current.length;
    strokes.current = strokes.current.filter(
      (stroke) => !isPointNearStroke(point, stroke),
    );

    if (strokes.current.length !== before) {
      doRedraw();
    }
  };

  const isEraserSelected = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const mouseDown = () => {
      if (activeTool === "eraser") {
        isEraserSelected.current = true;
      }
    };

    const mouseMove = (e: MouseEvent) => {
      if (!isEraserSelected.current) return;

      const point = getCanvasPoint(e, canvas, camera);
      eraseAtPoint(point);
    };

    const mouseUp = () => {
      if (!isEraserSelected.current) return;
      isEraserSelected.current = false;
    };

    canvas.addEventListener("mousedown", mouseDown);
    canvas.addEventListener("mousemove", mouseMove);
    window.addEventListener("mouseup", mouseUp);

    return () => {
      canvas.removeEventListener("mousedown", mouseDown);
      canvas.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mouseup", mouseUp);
    };
  }, [activeTool]);
}