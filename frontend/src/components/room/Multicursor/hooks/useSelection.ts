import { useEffect, useRef, useState } from "react";
import type { Dispatch, RefObject, SetStateAction } from "react";
import type { Shape, Line, TextBox,ToolSetters } from "../types";
import { hitTestTextBoxRotationHandle } from "../canvas";
import { hitTestLine, hitTestShape, hitTestTextBox } from "../tools/hitTests";
import { socket } from "../../../../services/socket";
import { hitTestCorner, hitTestRotationHandle } from "../tools/hitTests";
import { useToolSettings } from "../../../../context/ToolBarLeftContext";
//tools
import { handleElementDelete, type InteractionRefs } from "../tools/selectionTools";
import {  computeResizeOrigin,
  tryStartShapeHandleInteraction,
  tryStartLineHandleInteraction,
  findElementAt,
  syncToolSettingsToShape,
  syncToolSettingsToText,
  syncToolSettingsToLine} from "../tools/selectionTools"
export function useSelection(
  roomId: string,
  canvasRef: RefObject<HTMLCanvasElement | null>,
  camera: RefObject<{ x: number; y: number; scale: number }>,
  shapesRef: RefObject<Shape[]>,
  linesRef: RefObject<Line[]>,
  selectedId: React.RefObject<string | null>,
  color: string,
  activeTool: string | null,
  textBoxesRef: React.RefObject<TextBox[]>,
  activeTextBox: React.RefObject<TextBox | null>,
  onEditTextBox: () => void,
  doRedraw: () => void,
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
  const resizeOrigin = useRef({ x: 0, y: 0 });

  //resize code for lines
  const lineEndpoint = useRef<"p1" | "p2" | "mid" | null>(null);

  //isRotation
  const isRotating = useRef(false);

  //edit mode
  const { selectedEle,setArrowHead,setArrowType,setOpacity,setFontFamily,setFontSize,setTextAlign ,setStrokeWidth, setSelectedEle,setFillColor,setStrokeStyle,setEdgeStyle } = useToolSettings();
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;


    const onMouseDown = (e: MouseEvent) => {
  if (activeTool !== "mouse") return;
  const { x, y } = toCanvas(e.clientX, e.clientY);
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const refs: InteractionRefs = {
    isDragging, isResizing, isRotating, dragType,
    dragOffset, lineDragOffset, resizeCorner, resizeOrigin, lineEndpoint,
  };
  const setters: ToolSetters = {
    setFillColor, setStrokeWidth, setStrokeStyle, setEdgeStyle, setOpacity,
    setFontFamily, setFontSize, setTextAlign, setArrowType, setArrowHead,
  };

  // 1. try to grab a handle on whatever is already selected
  if (selectedId.current) {
    const selectedText = textBoxesRef.current.find((t) => t.id === selectedId.current);
    if (selectedText && hitTestTextBoxRotationHandle(selectedText, x, y, ctx, camera.current.scale)) {
      isRotating.current = true;
      dragType.current = "textbox";
      return;
    }

    const selectedShape = shapesRef.current.find((s) => s.id === selectedId.current);
    if (selectedShape && tryStartShapeHandleInteraction(
      selectedShape, x, y, camera.current.scale, refs, hitTestRotationHandle, hitTestCorner,
    )) return;

    const selectedLine = linesRef.current.find((l) => l.id === selectedId.current);
    if (selectedLine && tryStartLineHandleInteraction(selectedLine, x, y, camera.current.scale, refs)) return;
  }

  // 2. otherwise, look for a new hit among all elements
  const { hitShape, hitLine, hitText } = findElementAt(
    x, y, ctx, camera.current.scale,
    shapesRef.current, linesRef.current, textBoxesRef.current,
    hitTestShape, hitTestLine, hitTestTextBox,
  );

  // 3. start dragging + sync toolbar to the hit element
  if (hitShape) {
    isDragging.current = true;
    dragType.current = "shape";
    canvas.style.cursor = "move";
    dragOffset.current = { x: x - hitShape.x, y: y - hitShape.y };
    syncToolSettingsToShape(hitShape, setters);
  } else if (hitText) {
    isDragging.current = true;
    dragType.current = "textbox";
    dragOffset.current = { x: x - hitText.x, y: y - hitText.y };
    syncToolSettingsToText(hitText, setters);
  } else if (hitLine) {
    isDragging.current = true;
    dragType.current = "line";
    lineDragOffset.current = {
      x1: x - hitLine.x1, x2: x - hitLine.x2,
      y1: y - hitLine.y1, y2: y - hitLine.y2,
    };
    syncToolSettingsToLine(hitLine, setters);
  }

  const hit = hitShape ?? hitLine ?? hitText;
  if (!hit) return;
  selectedId.current = hit.id;
  setSelectedEle(hit);
  doRedraw();
};

    const onMouseMove = (e: MouseEvent) => {
      if (!selectedId.current) return;
      const { x, y } = toCanvas(e.clientX, e.clientY);

      //!rotate
      if (isRotating.current && selectedId.current) {
        if (dragType.current === "textbox") {
          const tb = textBoxesRef.current.find(
            (t) => t.id === selectedId.current,
          );
          if (!tb) return;
          const ctx = canvasRef.current?.getContext("2d");
          if (!ctx) return;

          ctx.font = `normal ${tb.fontSize}px monospace`;
          const lines = tb.text.split("\n");
          const width = Math.max(...lines.map((l) => ctx.measureText(l).width));
          const height = lines.length * tb.fontSize * 1.4;
          const centerX = tb.x + width / 2;
          const centerY = tb.y + height / 2;

          tb.rotation = Math.atan2(y - centerY, x - centerX) + Math.PI / 2;
          socket.emit("element-update", {
            roomId,
            id: tb.id,
            changes: { rotation: tb.rotation },
          });
          doRedraw();
          return;
        }
        const shape = shapesRef.current.find(
          (s) => s.id === selectedId.current,
        );
        if (!shape) return;

        const left = Math.min(shape.x, shape.x + shape.width);
        const top = Math.min(shape.y, shape.y + shape.height);
        const right = Math.max(shape.x, shape.x + shape.width);
        const bottom = Math.max(shape.y, shape.y + shape.height);
        const centerX = (left + right) / 2;
        const centerY = (top + bottom) / 2;

        shape.rotation = Math.atan2(y - centerY, x - centerX) + Math.PI / 2;

        socket.emit("element-update", {
          roomId,
          id: shape.id,
          changes: { rotation: shape.rotation },
        });
        doRedraw();
        return;
      }

      if (!isDragging.current && !isResizing.current) return;
      //!resize shapes,textbox and lines
      //lines
      if (isResizing.current && lineEndpoint.current) {
        const line = linesRef.current.find((l) => l.id === selectedId.current);
        if (!line) return;

        if (lineEndpoint.current === "p1") {
          line.x1 = x;
          line.y1 = y;
          socket.emit("element-update", {
            roomId,
            id: line.id,
            changes: { x1: x, y1: y },
          });
        } else if (lineEndpoint.current === "p2") {
          line.x2 = x;
          line.y2 = y;
          socket.emit("element-update", {
            roomId,
            id: line.id,
            changes: { x2: x, y2: y },
          });
        } else if (lineEndpoint.current === "mid") {
          line.cpx = 2 * x - 0.5 * (line.x1 + line.x2);
          line.cpy = 2 * y - 0.5 * (line.y1 + line.y2);
          socket.emit("element-update", {
            roomId,
            id: line.id,
            changes: { cpx: line.cpx, cpy: line.cpy },
          });
        }
        doRedraw();
        return;
      }

      if (isResizing.current && selectedId.current && resizeCorner.current) {
        const shape = shapesRef.current.find(
          (s) => s.id === selectedId.current,
        );
        if (!shape) return;

        const rotation = shape.rotation || 0;
        const anchor = resizeOrigin.current; // fixed world-space anchor, set once in onMouseDown

        // vector from the fixed anchor to the current mouse, un-rotated into local space
        const dx = x - anchor.x;
        const dy = y - anchor.y;
        const localDx = dx * Math.cos(-rotation) - dy * Math.sin(-rotation);
        const localDy = dx * Math.sin(-rotation) + dy * Math.cos(-rotation);

        const signX = resizeCorner.current.includes("r") ? 1 : -1;
        const signY = resizeCorner.current.includes("b") ? 1 : -1;
        const minSize = 10;

        const newWidth = Math.max(minSize, signX * localDx);
        const newHeight = Math.max(minSize, signY * localDy);

        // anchor's position relative to the new center, in local space
        const anchorLocalX = -signX * (newWidth / 2);
        const anchorLocalY = -signY * (newHeight / 2);

        // rotate that back to world space to find where the new center must be
        const offsetX =
          anchorLocalX * Math.cos(rotation) - anchorLocalY * Math.sin(rotation);
        const offsetY =
          anchorLocalX * Math.sin(rotation) + anchorLocalY * Math.cos(rotation);

        const newCenterX = anchor.x - offsetX;
        const newCenterY = anchor.y - offsetY;

        shape.width = newWidth;
        shape.height = newHeight;
        shape.x = newCenterX - newWidth / 2;
        shape.y = newCenterY - newHeight / 2;

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
      if (activeTool !== "mouse") return;
      if (isResizing.current) {
        isResizing.current = false;
        resizeCorner.current = null;
        lineEndpoint.current = null;
        doRedraw();
        return;
      }
      if (isRotating.current) {
        isRotating.current = false;
        doRedraw();
        return;
      }

      if (!isDragging.current || !selectedId.current) return;
      isDragging.current = false;
      dragType.current = null;
      doRedraw();
    };

    const onDblClick = (e: MouseEvent) => {
      if (activeTool !== "mouse") return;
      const { x, y } = toCanvas(e.clientX, e.clientY);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const hitText = [...(textBoxesRef?.current ?? [])]
        .reverse()
        .find((t) => hitTestTextBox(t, x, y, ctx));

      if (hitText) {
        activeTextBox.current = { ...hitText };
        onEditTextBox?.();
        doRedraw();
        setTimeout(() => {
          const textarea = document.querySelector("textarea");
          if (textarea) {
            textarea.value = hitText.text;
            textarea.dispatchEvent(new Event("input", { bubbles: true }));
          }
        }, 0);
      }
    };

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("dblclick", onDblClick);
    window.addEventListener("keydown", (e) => handleElementDelete(e, selectedId, shapesRef, linesRef, textBoxesRef));
    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("dblclick", onDblClick);
      window.removeEventListener("keydown", (e) => handleElementDelete(e, selectedId, shapesRef, linesRef, textBoxesRef));
    };
  }, [activeTool, color, doRedraw]);

  const { strokeColor, setStrokeColor } = useToolSettings();

  //edit mode
  useEffect(() => {
    if (selectedEle === null) {
      selectedId.current = null;
      doRedraw();
      return;
    }

    const handleClick = () => {
      if (activeTool !== "mouse") {
        setSelectedEle(null);
        selectedId.current = null;
        return;
      }
    };

    if (activeTool === "mouse") {
      setStrokeColor(selectedEle.color);
    }

    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [selectedEle, activeTool]);
}
