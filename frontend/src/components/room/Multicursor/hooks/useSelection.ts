import { useEffect, useRef } from "react";
import type { Dispatch, RefObject, SetStateAction } from "react";
import type { Shape, Line, TextBox } from "../types";
import { hitTestTextBoxRotationHandle } from "../canvas";
import { hitTestLine, hitTestShape, hitTestTextBox } from "../tools/hitTests";
import { socket } from "../../../../services/socket";
import { hitTestCorner, hitTestRotationHandle } from "../canvas";

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
  setIsEditMode:Dispatch<SetStateAction<Line|Shape|TextBox|null>>
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let eleTodelete: any;
    const handleElementDelete = (e:KeyboardEvent) => {
      if(!eleTodelete) return
      if(e.key === "Delete"||e.key==="Backspace") {
        if(eleTodelete.type==="shape"){
          shapesRef.current=shapesRef.current.filter((shape)=>shape.id!=eleTodelete.id)
        }else if(eleTodelete.type==="line"){
          linesRef.current=linesRef.current.filter((line)=>line.id!=eleTodelete.id)
        }
        socket.emit("element-delete", {
          roomId,
          id: eleTodelete.id,
        });

        doRedraw();
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      if (activeTool !== "mouse") return;
      const { x, y } = toCanvas(e.clientX, e.clientY);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      //!resize shapes textbox and lines
      if (selectedId.current) {
        const selectedText = textBoxesRef.current.find(
          (t) => t.id === selectedId.current,
        );
        if (selectedText && ctx) {
          if (
            hitTestTextBoxRotationHandle(
              selectedText,
              x,
              y,
              ctx,
              camera.current.scale,
            )
          ) {
            isRotating.current = true;
            dragType.current = "textbox";
            return;
          }
        }
        //rotate
        const selectedShape = shapesRef.current.find(
          (s) => s.id === selectedId.current,
        );
        if (selectedShape) {
          if (
            hitTestRotationHandle(selectedShape, x, y, camera.current.scale)
          ) {
            isRotating.current = true;
            return;
          }

          //resize
          const corner = hitTestCorner(
            selectedShape,
            x,
            y,
            camera.current.scale,
          );
          if (corner) {
            isResizing.current = true;
            resizeCorner.current = corner;

            const left = Math.min(
              selectedShape.x,
              selectedShape.x + selectedShape.width,
            );
            const top = Math.min(
              selectedShape.y,
              selectedShape.y + selectedShape.height,
            );
            const right = Math.max(
              selectedShape.x,
              selectedShape.x + selectedShape.width,
            );
            const bottom = Math.max(
              selectedShape.y,
              selectedShape.y + selectedShape.height,
            );
            const w = right - left;
            const h = bottom - top;
            const centerX = (left + right) / 2;
            const centerY = (top + bottom) / 2;
            const rotation = selectedShape.rotation || 0;

            // opposite corner in local space
            const localOx = corner.includes("l") ? w / 2 : -w / 2;
            const localOy = corner.includes("t") ? h / 2 : -h / 2;

            // rotate back to world space
            const worldOx =
              localOx * Math.cos(rotation) - localOy * Math.sin(rotation);
            const worldOy =
              localOx * Math.sin(rotation) + localOy * Math.cos(rotation);

            resizeOrigin.current = {
              x: centerX + worldOx,
              y: centerY + worldOy,
            };
            return;
          }
        }
        const selectedLine = linesRef.current.find(
          (l) => l.id === selectedId.current,
        );
        if (selectedLine) {
          const tolerance = 8 / camera.current.scale;
          const distP1 = Math.hypot(x - selectedLine.x1, y - selectedLine.y1);
          const distP2 = Math.hypot(x - selectedLine.x2, y - selectedLine.y2);

          if (distP1 <= tolerance) {
            lineEndpoint.current = "p1";
            isResizing.current = true;
            return;
          }
          if (distP2 <= tolerance) {
            lineEndpoint.current = "p2";
            isResizing.current = true;
            return;
          }

          const midX =
            selectedLine.cpx !== undefined
              ? 0.25 * selectedLine.x1 +
                0.5 * selectedLine.cpx +
                0.25 * selectedLine.x2
              : (selectedLine.x1 + selectedLine.x2) / 2;
          const midY =
            selectedLine.cpy !== undefined
              ? 0.25 * selectedLine.y1 +
                0.5 * selectedLine.cpy +
                0.25 * selectedLine.y2
              : (selectedLine.y1 + selectedLine.y2) / 2;

          const distMid = Math.hypot(x - midX, y - midY);
          if (distMid <= tolerance) {
            lineEndpoint.current = "mid";
            isResizing.current = true;
            if (selectedLine.cpx === undefined) {
              selectedLine.cpx = midX;
              selectedLine.cpy = midY;
            }
            return;
          }
        }
      }

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

      //!deleting using backspace and delete
      eleTodelete = hitLine || hitShape || hitText;

      //!moving shapes,textbox and lines
      if (hitShape) {
        isDragging.current = true;
        dragType.current = "shape";
        canvas.style.cursor = "move";
        dragOffset.current = { x: x - hitShape.x, y: y - hitShape.y };
      } else if (hitText) {
        isDragging.current = true;
        dragType.current = "textbox";
        dragOffset.current = { x: x - hitText.x, y: y - hitText.y };
      } else if (hitLine) {
        isDragging.current = true;
        dragType.current = "line";
        lineDragOffset.current = {
          x1: x - hitLine.x1,
          x2: x - hitLine.x2,
          y1: y - hitLine.y1,
          y2: y - hitLine.y2,
        };
      }

      const hit = hitShape ?? hitLine ?? hitText;

      //!edit mode
      if(!hit) return;
      setIsEditMode(hit)
      selectedId.current = hit?.id ?? null;
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

      if (isResizing.current && selectedId.current) {
        const shape = shapesRef.current.find(
          (s) => s.id === selectedId.current,
        );
        if (!shape) return;

        const left = Math.min(shape.x, shape.x + shape.width);
        const top = Math.min(shape.y, shape.y + shape.height);
        const right = Math.max(shape.x, shape.x + shape.width);
        const bottom = Math.max(shape.y, shape.y + shape.height);
        const w = right - left;
        const h = bottom - top;

        const centerX = (left + right) / 2;
        const centerY = (top + bottom) / 2;
        const rotation = shape.rotation || 0;

        // convert mouse to local frame
        const dx = x - centerX;
        const dy = y - centerY;
        const localX = dx * Math.cos(-rotation) - dy * Math.sin(-rotation);
        const localY = dx * Math.sin(-rotation) + dy * Math.cos(-rotation);

        // local point relative to shape origin
        const localPointX = localX + w / 2;
        const localPointY = localY + h / 2;

        const minSize = 10;

        switch (resizeCorner.current) {
          case "br":
            shape.width = Math.max(minSize, localPointX);
            shape.height = Math.max(minSize, localPointY);
            break;
          case "bl": {
            const newWidth = Math.max(minSize, w - localPointX);
            shape.x = centerX - w / 2 + (w - newWidth);
            shape.width = newWidth;
            shape.height = Math.max(minSize, localPointY);
            break;
          }
          case "tr": {
            const newHeight = Math.max(minSize, h - localPointY);
            shape.y = centerY - h / 2 + (h - newHeight);
            shape.height = newHeight;
            shape.width = Math.max(minSize, localPointX);
            break;
          }
          case "tl": {
            const newWidth = Math.max(minSize, w - localPointX);
            const newHeight = Math.max(minSize, h - localPointY);
            shape.x = centerX - w / 2 + (w - newWidth);
            shape.y = centerY - h / 2 + (h - newHeight);
            shape.width = newWidth;
            shape.height = newHeight;
            break;
          }
        }

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

    //edit textbox
    const onDblClick = (e: MouseEvent) => {
      if (activeTool !== "mouse") return;
      const { x, y } = toCanvas(e.clientX, e.clientY);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const hitText = [...(textBoxesRef?.current ?? [])]
        .reverse()
        .find((t) => hitTestTextBox(t, x, y, ctx));

      if (hitText) {
        textBoxesRef.current = textBoxesRef.current.filter(
          (t) => t.id !== hitText.id,
        );
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
    window.addEventListener("keydown", handleElementDelete);
    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("dblclick", onDblClick);
      window.removeEventListener("keydown", handleElementDelete);
    };
  }, [activeTool, color, doRedraw]);
}
