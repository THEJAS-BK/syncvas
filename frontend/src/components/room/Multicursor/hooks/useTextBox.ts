import { useEffect, useRef } from "react";
import { socket } from "../../../../services/socket";
import type { MutableRefObject, RefObject } from "react";
import type {
  TextBox,
  CanvasElement,
  BoardImage,
  Point,
  Stroke,
  Shape,
  Line,
  ActiveStroke,
} from "../types";
import { redraw } from "../canvas";
export function useTextBox(
  roomId: string,
  canvasRef: RefObject<HTMLCanvasElement | null>,
  camera: MutableRefObject<{ x: number; y: number; scale: number }>,
  images: RefObject<BoardImage[]>,
  imageCache: RefObject<Map<string, HTMLImageElement>>,
  activeStrokes: RefObject<Record<string, ActiveStroke>>,
  currentStroke: RefObject<Point[]>,
  strokes: RefObject<Stroke[]>,
  shapesRef: RefObject<Shape[]>,
  activeShape: RefObject<Shape | null>,
  userId: string,
  color: string,
  filled: boolean,
  activeTool: string | null,
linesRef: React.RefObject<Line[]>,
activeLine: React.RefObject<Line | null>,
selectedId: React.RefObject<string | null>,
textBoxesRef: React.RefObject<TextBox[]>,
activeTextBox: React.RefObject<TextBox | null>,
) {
  const doRedraw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    redraw(
      canvas,
      ctx,
      camera,
      images,
      imageCache,
      activeStrokes,
      currentStroke,
      strokes,
      userId,
      color,
      shapesRef,
      activeShape,
      linesRef,
      activeLine,
      selectedId,
      textBoxesRef,
      activeTextBox!,
    );
  };
  const placeTextBox = (clientX: number, clientY: number) => {
    const scale = camera.current?.scale ?? 1;
    const cx = camera.current?.x ?? 0;
    const cy = camera.current?.y ?? 0;
    const x = (clientX - cx) / scale;
    const y = (clientY - cy) / scale;

    activeTextBox!.current = {
      id: crypto.randomUUID(),
      type: "textbox",
      x,
      y,
      text: "",
      fontSize: 16,
      color,
      userId: userId,
    };
    doRedraw();
  };

const finalizeTextBox = (text: string, isEdit = false) => {
  if (!activeTextBox?.current) return;
  if (!text.trim()) {
    activeTextBox.current = null;
    doRedraw();
    return;
  }

  const box: TextBox = {
    id: activeTextBox.current.id,
    type: "textbox",
    x: activeTextBox.current.x,
    y: activeTextBox.current.y,
    fontSize: activeTextBox.current.fontSize,
    color: activeTextBox.current.color,
    userId: activeTextBox.current.userId,
    rotation: activeTextBox.current.rotation,
    text,
  };

  textBoxesRef.current = [...textBoxesRef.current, box];
  activeTextBox.current = null;

  if (isEdit) {
    socket.emit("element-update", { roomId, id: box.id, changes: { text } });
  } else {
    socket.emit("element-add", { roomId, element: box });
  }
  doRedraw();
};

  const cancelTextBox = () => {
    activeTextBox!.current = null;
    doRedraw();
  };

  const updateTextBox = (id: string, changes: Partial<TextBox>) => {
    if (!textBoxesRef?.current) return;

    textBoxesRef.current = textBoxesRef.current.map((b) =>
      b.id === id ? { ...b, ...changes } : b,
    );
    socket.emit("element-update", { roomId, id, changes });
    doRedraw();
  };

  const changeFontSize = (id: string, fontSize: number) => {
    updateTextBox(id, { fontSize });
  };

  const deleteTextBox = (id: string) => {

    textBoxesRef.current = textBoxesRef.current.filter((b) => b.id !== id);
    socket.emit("element-delete", { roomId, id });
    doRedraw();
  };

  // ---- socket listeners ----
  useEffect(() => {

    const onElementAdd = (el: CanvasElement) => {
      if (el.type !== "textbox") return;
      textBoxesRef.current = [...textBoxesRef.current, el];
      doRedraw();
    };

    const onElementUpdate = ({
      id,
      changes,
    }: {
      id: string;
      changes: Partial<TextBox>;
    }) => {
      textBoxesRef.current = textBoxesRef.current.map((b) =>
        b.id === id ? { ...b, ...changes } : b,
      );
      doRedraw();
    };

    const onElementDelete = (id: string) => {
      textBoxesRef.current = textBoxesRef.current.filter((b) => b.id !== id);
      doRedraw();
    };

    const onElementState = (elements: CanvasElement[]) => {
      textBoxesRef.current = elements.filter(
        (e): e is TextBox => e.type === "textbox",
      );
      doRedraw();
    };

    socket.on("element-add", onElementAdd);
    socket.on("element-update", onElementUpdate);
    socket.on("element-delete", onElementDelete);
    socket.on("element-state", onElementState);

    return () => {
      socket.off("element-add", onElementAdd);
      socket.off("element-update", onElementUpdate);
      socket.off("element-delete", onElementDelete);
      socket.off("element-state", onElementState);
    };
  }, []);

  return {
    placeTextBox,
    finalizeTextBox,
    cancelTextBox,
    updateTextBox,
    changeFontSize,
    deleteTextBox,
  };
}
