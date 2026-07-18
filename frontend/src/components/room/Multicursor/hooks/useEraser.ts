import { useEffect, useRef } from "react";
import type { Stroke, Point, ActiveStroke } from "../types.ts";
import { getCanvasPoint, isPointNearStroke } from "../canvas.ts";
import { socket } from "../../../../services/socket.ts";

export function useEraser(
  roomId: string,
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
      socket.emit("stroke-delete", { point: point, roomId });
      doRedraw();
    }
  };
  const isEraserSelected = useRef<boolean>(false);

  useEffect(() => {
    if (activeTool !== "eraser") {
      isEraserSelected.current = false;
      return;
    }
   
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
        socket.off("stroke-delete")
      canvas.removeEventListener("mousedown", mouseDown);
      canvas.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mouseup", mouseUp);
    };
  }, [activeTool]);
}
