import type { RefObject } from "react";
import { useToolSettings } from "../../../../context/ToolBarLeftContext";
import type { Line, Shape, TextBox, ToolSetters } from "../types";
import { socket } from "../../../../services/socket";
const handleElementDelete = (
  e: KeyboardEvent,
  selectedId: React.RefObject<string | null>,
  shapesRef: RefObject<Shape[]>,
  linesRef: RefObject<Line[]>,
  textBoxesRef: React.RefObject<TextBox[]>,
) => {
  const { activeTool, setSelectedEle, doRedrawRef, roomId } = useToolSettings();
  if (e.key !== "Delete" && e.key !== "Backspace") return;
  if (activeTool !== "mouse") return;

  const target = e.target as HTMLElement;
  if (target?.tagName === "TEXTAREA" || target?.tagName === "INPUT") return;

  const id = selectedId.current;
  if (!id) return;

  if (shapesRef.current.some((s) => s.id === id)) {
    shapesRef.current = shapesRef.current.filter((s) => s.id !== id);
  } else if (linesRef.current.some((l) => l.id === id)) {
    linesRef.current = linesRef.current.filter((l) => l.id !== id);
  } else if (textBoxesRef.current.some((t) => t.id === id)) {
    textBoxesRef.current = textBoxesRef.current.filter((t) => t.id !== id);
  } else {
    return;
  }

  socket.emit("element-delete", { roomId, id });
  selectedId.current = null;
  setSelectedEle(null);
  doRedrawRef.current?.();
};

interface InteractionRefs {
  isDragging: React.RefObject<boolean>;
  isResizing: React.RefObject<boolean>;
  isRotating: React.RefObject<boolean>;
  dragType: React.RefObject<"shape" | "line" | "textbox" | null>;
  dragOffset: React.RefObject<{ x: number; y: number }>;
  lineDragOffset: React.RefObject<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }>;
  resizeCorner: React.RefObject<string | null>;
  resizeOrigin: React.RefObject<{ x: number; y: number } | null>;
  lineEndpoint: React.RefObject<"p1" | "p2" | "mid" | null>;
}

// ---- 1. resize-origin math, extracted as a pure function ----
function computeResizeOrigin(shape: Shape, corner: string) {
  const left = Math.min(shape.x, shape.x + shape.width);
  const top = Math.min(shape.y, shape.y + shape.height);
  const right = Math.max(shape.x, shape.x + shape.width);
  const bottom = Math.max(shape.y, shape.y + shape.height);
  const w = right - left;
  const h = bottom - top;
  const centerX = (left + right) / 2;
  const centerY = (top + bottom) / 2;
  const rotation = shape.rotation || 0;

  const localOx = corner.includes("l") ? w / 2 : -w / 2;
  const localOy = corner.includes("t") ? h / 2 : -h / 2;

  const worldOx = localOx * Math.cos(rotation) - localOy * Math.sin(rotation);
  const worldOy = localOx * Math.sin(rotation) + localOy * Math.cos(rotation);

  return { x: centerX + worldOx, y: centerY + worldOy };
}

// ---- 2. try to grab a handle on the currently selected shape ----
// returns true if the click was consumed (caller should return early)
function tryStartShapeHandleInteraction(
  shape: Shape,
  x: number,
  y: number,
  scale: number,
  refs: InteractionRefs,
  hitTestRotationHandle: typeof import("./hitTests").hitTestRotationHandle,
  hitTestCorner: typeof import("./hitTests").hitTestCorner,
): boolean {
  if (hitTestRotationHandle(shape, x, y, scale)) {
    refs.isRotating.current = true;
    return true;
  }

  const corner = hitTestCorner(shape, x, y, scale);
  if (corner) {
    refs.isResizing.current = true;
    refs.resizeCorner.current = corner;
    refs.resizeOrigin.current = computeResizeOrigin(shape, corner);
    return true;
  }

  return false;
}

// ---- 3. try to grab an endpoint/midpoint on the currently selected line ----
function tryStartLineHandleInteraction(
  line: Line,
  x: number,
  y: number,
  scale: number,
  refs: InteractionRefs,
): boolean {
  const tolerance = 8 / scale;
  const distP1 = Math.hypot(x - line.x1, y - line.y1);
  const distP2 = Math.hypot(x - line.x2, y - line.y2);

  if (distP1 <= tolerance) {
    refs.lineEndpoint.current = "p1";
    refs.isResizing.current = true;
    return true;
  }
  if (distP2 <= tolerance) {
    refs.lineEndpoint.current = "p2";
    refs.isResizing.current = true;
    return true;
  }

  const midX =
    line.cpx !== undefined
      ? 0.25 * line.x1 + 0.5 * line.cpx + 0.25 * line.x2
      : (line.x1 + line.x2) / 2;
  const midY =
    line.cpy !== undefined
      ? 0.25 * line.y1 + 0.5 * line.cpy + 0.25 * line.y2
      : (line.y1 + line.y2) / 2;

  if (Math.hypot(x - midX, y - midY) <= tolerance) {
    refs.lineEndpoint.current = "mid";
    refs.isResizing.current = true;
    if (line.cpx === undefined) {
      line.cpx = midX;
      line.cpy = midY;
    }
    return true;
  }

  return false;
}

// ---- 4. hit-test all element collections for a NEW selection ----
interface HitResult {
  hitShape?: Shape;
  hitLine?: Line;
  hitText?: TextBox;
}

function findElementAt(
  x: number,
  y: number,
  ctx: CanvasRenderingContext2D,
  scale: number,
  shapes: Shape[],
  lines: Line[],
  textBoxes: TextBox[],
  hitTestShape: typeof import("./hitTests").hitTestShape,
  hitTestLine: typeof import("./hitTests").hitTestLine,
  hitTestTextBox: typeof import("./hitTests").hitTestTextBox,
): HitResult {
  // reverse so topmost (last drawn) wins
  const hitShape = [...shapes].reverse().find((s) => hitTestShape(s, x, y));
  const hitLine = [...lines].reverse().find((l) => hitTestLine(l, x, y, scale));
  const hitText = [...textBoxes]
    .reverse()
    .find((t) => hitTestTextBox(t, x, y, ctx));
  return { hitShape, hitLine, hitText };
}

function syncToolSettingsToShape(shape: Shape, s: ToolSetters) {
  s.setFillColor(shape.fillColor);
  s.setStrokeWidth(shape.strokeWidth);
  s.setStrokeStyle(shape.strokeStyle);
  s.setEdgeStyle(shape.edgeStyle);
  s.setOpacity(shape.opacity ?? 100);
}

function syncToolSettingsToText(text: TextBox, s: ToolSetters) {
  s.setFontFamily(text.fontFamily);
  s.setFontSize(text.fontSize);
  s.setTextAlign(text.textAlign);
  s.setOpacity(text.opacity ?? 100);
}

function syncToolSettingsToLine(line: Line, s: ToolSetters) {
  s.setStrokeStyle(line.lineStyle);
  s.setStrokeWidth(line.strokeWidth);
  s.setOpacity(line.opacity ?? 100);
  if (line.lineType === "arrow") {
    s.setArrowType(line.arrowType);
    s.setArrowHead(line.arrowHead);
  }
}

export {
  computeResizeOrigin,
  tryStartShapeHandleInteraction,
  tryStartLineHandleInteraction,
  findElementAt,
  syncToolSettingsToShape,
  syncToolSettingsToText,
  syncToolSettingsToLine,
  handleElementDelete,
};
export type { InteractionRefs, HitResult, ToolSetters };
