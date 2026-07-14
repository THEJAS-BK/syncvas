import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import type { Line, Shape, TextBox } from "../../room/Multicursor/types.ts";
import { useToolSettings } from "../../../context/ToolBarLeftContext.tsx";
import OpacitySlider from "../../room/LeftToolBar/controls/OpacitySlider.tsx";
import { getNextZIndex } from "../../room/Multicursor/tools/zIndex.ts";

export function useOfflineLines(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  camera: RefObject<{ x: number; y: number; scale: number }>,
  linesRef: RefObject<Line[]>,
  activeLine: RefObject<Line | null>,
  userIdRef: React.RefObject<string>,
  activeTool: string | null,
  strokeColor: string,
  shapesRef:RefObject<Shape[]>,
  textBoxesRef:RefObject<TextBox[]>,
  doRedraw: () => void,
) {
  const isDragging = useRef(false);

  const toCanvas = (clientX: number, clientY: number) => ({
    x: (clientX - camera.current.x) / camera.current.scale,
    y: (clientY - camera.current.y) / camera.current.scale,
  });

  const { strokeWidth,opacity, strokeStyle, arrowType, arrowHead, selectedEle } =
    useToolSettings();

  useEffect(() => {
    if (activeTool !== "mouse" || !selectedEle || selectedEle.type !== "line")
      return;

    const selectedLine = linesRef.current.find((l) => l.id === selectedEle.id);
    if (!selectedLine) return;

    selectedLine.arrowHead = arrowHead;
    selectedLine.arrowType = arrowType;
    selectedLine.lineStyle = strokeStyle;
    selectedLine.strokeWidth = strokeWidth;
    selectedLine.opacity=opacity;

    doRedraw();
  }, [selectedEle, arrowHead, arrowType, strokeStyle, strokeWidth, opacity, activeTool, doRedraw, linesRef]);

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
        color: strokeColor,
        strokeWidth,
        lineStyle: strokeStyle,
        arrowType,
        arrowHead,
        userId: userIdRef.current,
        opacity,
        zIndex:getNextZIndex(shapesRef, linesRef, textBoxesRef)
      };

      doRedraw();
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !activeLine.current) return;

      const { x, y } = toCanvas(e.clientX, e.clientY);
      activeLine.current = {
        ...activeLine.current,
        x2: x,
        y2: y,
      };

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
  }, [
    activeTool,
    strokeColor,
    doRedraw,
    strokeWidth,
    strokeStyle,
    arrowType,
    arrowHead,
    canvasRef,
    camera,
    linesRef,
    activeLine,
    userIdRef,
  ]);

  const deleteLine = (id: string) => {
    linesRef.current = linesRef.current.filter((l) => l.id !== id);
    doRedraw();
  };

  return { deleteLine };
}