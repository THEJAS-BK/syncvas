import { useEffect, useRef, useState } from "react";
import { socket } from "../../../../services/socket";
import type { MutableRefObject } from "react";
import type { TextBox, CanvasElement, Shape, Line } from "../types";

export function useTextBox(
  roomId: string,
  camera: React.RefObject<any>,
  userIdRef: MutableRefObject<string>,
  color: string,
) {
  const [textBoxes, setTextBoxes] = useState<TextBox[]>([]);
  const [activeTextBox, setActiveTextBox] = useState<TextBox | null>(null);

  const placeTextBox = (clientX: number, clientY: number) => {
    const scale = camera.current?.scale ?? 1;
    const cx = camera.current?.x ?? 0;
    const cy = camera.current?.y ?? 0;
    const x = (clientX - cx) / scale;
    const y = (clientY - cy) / scale;

    setActiveTextBox({
      id: crypto.randomUUID(),
      type: "textbox",
      x,
      y,
      text: "",
      fontSize: 16,
      color,
      userId: userIdRef.current,
    });
  };

  const finalizeTextBox = (text: string) => {
    if (!activeTextBox) return;
    if (!text.trim()) {
      setActiveTextBox(null);
      return;
    }

    const box: TextBox = { ...activeTextBox, text };
    setTextBoxes((prev) => [...prev, box]);

    socket.emit("element-add", {
      roomId,
      element: box, // send full element, backend tags userId itself
    });
    setActiveTextBox(null);
  };

  const cancelTextBox = () => setActiveTextBox(null);

  // edit existing textbox (e.g. after re-opening to change text)
  const updateTextBox = (id: string, changes: Partial<TextBox>) => {
    setTextBoxes((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...changes } : b)),
    );
    socket.emit("element-update", { roomId, id, changes });
  };

  // change font size on an existing textbox
  const changeFontSize = (id: string, fontSize: number) => {
    updateTextBox(id, { fontSize });
  };

  const deleteTextBox = (id: string) => {
    setTextBoxes((prev) => prev.filter((b) => b.id !== id));
    socket.emit("element-delete", { roomId, id });
  };

  // ---- socket listeners ----
  useEffect(() => {
    const onElementAdd = (el: CanvasElement) => {
      if (el.type !== "textbox") return;
      setTextBoxes((prev) => [...prev, el]);
    };

    const onElementUpdate = ({
      id,
      changes,
    }: {
      id: string;
      changes: Partial<TextBox>;
    }) => {
      setTextBoxes((prev) =>
        prev.map((b) => (b.id === id ? { ...b, ...changes } : b)),
      );
    };

    const onElementDelete = (id: string) => {
      setTextBoxes((prev) => prev.filter((b) => b.id !== id));
    };

    const onElementState = (elements: CanvasElement[]) => {
      setTextBoxes(elements.filter((e): e is TextBox => e.type === "textbox"));
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
    textBoxes,
    activeTextBox,
    placeTextBox,
    finalizeTextBox,
    cancelTextBox,
    updateTextBox,
    changeFontSize,
    deleteTextBox,
  };
}
