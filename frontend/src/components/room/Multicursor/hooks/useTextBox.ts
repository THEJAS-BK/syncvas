import { useRef, useState } from "react";
import { socket } from "../../../../services/socket";
import type { RefObject, MutableRefObject } from "react";
import type {  TextBox } from "../types";

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
    if (!text.trim()) { setActiveTextBox(null); return; }

    const box = { ...activeTextBox, text };
    setTextBoxes((prev) => [...prev, box]);
    socket.emit("textbox:add", { roomId, box });
    setActiveTextBox(null);
  };

  const cancelTextBox = () => setActiveTextBox(null);

  // receive from others
  const onRemoteTextBox = (box: TextBox) => {
    setTextBoxes((prev) => [...prev, box]);
  };

  return { textBoxes, activeTextBox, placeTextBox, finalizeTextBox, cancelTextBox, onRemoteTextBox };
}
