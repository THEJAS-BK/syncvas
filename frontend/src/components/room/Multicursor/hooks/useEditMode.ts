import { useEffect, type RefObject } from "react";
import type { Line, Shape, TextBox } from "../types";
import { useEditorState } from "../../../../context/EditerStateContext";
import { hitTestShape, hitTestLine, hitTestTextBox } from "../tools/hitTests";

export function useEditMode(
  shapesRef: RefObject<Shape[]>,
  linesRef: RefObject<Line[]>,
  textBoxesRef: React.RefObject<TextBox[]>,
  camera: RefObject<{ x: number; y: number; scale: number }>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
  doRedraw: () => void,
) {
  const { setSelectedElement, activeTool, setEditModeTool } = useEditorState();

  const toCanvas = (clientX: number, clientY: number) => ({
    x: (clientX - camera.current.x) / camera.current.scale,
    y: (clientY - camera.current.y) / camera.current.scale,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleClick = (e: MouseEvent) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const { x, y } = toCanvas(e.clientX, e.clientY);

      const hitShape = [...shapesRef.current]
        .reverse()
        .find((s) => hitTestShape(s, x, y));

      const hitLine = [...linesRef.current]
        .reverse()
        .find((l) => hitTestLine(l, x, y, camera.current.scale));

      const hitText = [...(textBoxesRef?.current ?? [])]
        .reverse()
        .find((t) => hitTestTextBox(t, x, y, ctx));

      const ele = hitShape || hitLine || hitText;

      if (!ele) {
        setSelectedElement(null);
        setEditModeTool(null);
        return;
      }

      setSelectedElement(ele);

      if (activeTool === "mouse") {
        if (ele.type === "shape") {
          setEditModeTool(ele.shapeType);
        } else if (ele.type === "line") {
          setEditModeTool(ele.lineType ?? "line");
        } else if (ele.type === "textbox") {
          setEditModeTool("text");
        }
      }
    };

    canvas.addEventListener("click", handleClick);
    return () => {
      canvas.removeEventListener("click", handleClick);
    };
  }, [activeTool]);
}