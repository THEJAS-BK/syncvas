import { useToolSettings } from "../../../../context/ToolBarLeftContext";
import { socket } from "../../../../services/socket";
export function useEditElements() {
  const {
    shapesRef,
    linesRef,
    textBoxesRef,
    doRedrawRef,
    roomId,
    selectedEle,
  } = useToolSettings();

  const refByType = {
    shape: shapesRef,
    line: linesRef,
    textbox: textBoxesRef,
  } as const;

  const handleEditShapeColor = (color: string) => {
    if (!selectedEle) return;

    const ref = refByType[selectedEle.type as keyof typeof refByType];
    if (!ref) return;

    const el = ref.current.find((e) => e.id === selectedEle.id);
    if (!el) return;

    el.color = color;
    doRedrawRef.current?.();
    socket.emit("element-update", {
      roomId,
      id: el.id,
      changes: { color },
    });
  };
  return { handleEditShapeColor };
}
