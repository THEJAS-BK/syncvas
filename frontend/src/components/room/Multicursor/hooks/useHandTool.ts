import { useEffect, useRef } from "react";
import type {  RefObject } from "react";

export function useHandTool(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  camera: RefObject<{ x: number; y: number; scale: number }>,

  activeTool: string | null,
  doRedraw:()=>void
) {
  const isPanning = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onMouseDown = (e: MouseEvent) => {
      if (activeTool !== "hand") return;
      isPanning.current = true;
      lastPos.current = { x: e.clientX, y: e.clientY };
      canvas.style.cursor = "hand";
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isPanning.current) return;
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      camera.current.x += dx;
      camera.current.y += dy;
      lastPos.current = { x: e.clientX, y: e.clientY };
      canvas.style.cursor = "grab";
      doRedraw();
    };

    const onMouseUp = () => {
      isPanning.current = false;
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