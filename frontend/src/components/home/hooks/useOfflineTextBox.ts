import { useEffect } from "react";
import type { RefObject } from "react";
import type { TextBox } from "../../room/Multicursor/types.ts";
import { useToolSettings } from "../../../context/ToolBarLeftContext.tsx";
export function useOfflineTextBox(
  camera: RefObject<{ x: number; y: number; scale: number }>,
  userId: string,
  color: string,
  textBoxesRef: React.RefObject<TextBox[]>,
  activeTextBox: React.RefObject<TextBox | null>,
  doRedraw: () => void,
) {
  const { fontSize, activeTool, textAlign, fontFamily, selectedEle } =
    useToolSettings();

  useEffect(() => {
    if (activeTool !== "mouse" || !selectedEle || selectedEle.type !== "textbox")
      return;

    const textbox = textBoxesRef.current.find((t) => t.id === selectedEle.id);
    if (!textbox) return;

    textbox.fontFamily = fontFamily;
    textbox.fontSize = fontSize;
    textbox.textAlign = textAlign;

    doRedraw();
  }, [selectedEle, fontFamily, fontSize, textAlign, activeTool, doRedraw, textBoxesRef]);

  const placeTextBox = (clientX: number, clientY: number) => {
    const scale = camera.current?.scale ?? 1;
    const cx = camera.current?.x ?? 0;
    const cy = camera.current?.y ?? 0;
    const x = (clientX - cx) / scale;
    const y = (clientY - cy) / scale;

    activeTextBox.current = {
      id: crypto.randomUUID(),
      type: "textbox",
      x,
      y,
      text: "",
      fontSize,
      textAlign,
      fontFamily,
      color,
      userId,
    };

    doRedraw();
  };

  const updateTextBoxContent = (text: string) => {
    if (!activeTextBox.current) return;

    activeTextBox.current.text = text;
    const id = activeTextBox.current.id;
    const exists = textBoxesRef.current.some((b) => b.id === id);

    if (!exists) {
      const box: TextBox = { ...activeTextBox.current, text };
      textBoxesRef.current = [...textBoxesRef.current, box];
    } else {
      textBoxesRef.current = textBoxesRef.current.map((b) =>
        b.id === id ? { ...b, text } : b,
      );
    }

    doRedraw();
  };

  const finalizeTextBox = (text: string) => {
    if (!activeTextBox.current) return;
    const id = activeTextBox.current.id;

    if (!text.trim()) {
      if (textBoxesRef.current.some((b) => b.id === id)) {
        textBoxesRef.current = textBoxesRef.current.filter((b) => b.id !== id);
      }
      activeTextBox.current = null;
      doRedraw();
      return;
    }

    const box: TextBox = { ...activeTextBox.current, text };
    const exists = textBoxesRef.current.some((b) => b.id === id);

    textBoxesRef.current = exists
      ? textBoxesRef.current.map((b) => (b.id === id ? box : b))
      : [...textBoxesRef.current, box];

    activeTextBox.current = null;
    doRedraw();
  };

  return {
    placeTextBox,
    finalizeTextBox,
    updateTextBoxContent,
  };
}