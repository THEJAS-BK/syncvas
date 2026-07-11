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

  const handleEditShapeOutlineColor = (color: string) => {
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
  }

  const handleEditShapeFillColor = (fillColor: string) => {
    if (!selectedEle || selectedEle.type !== "shape") return;

    const el = shapesRef.current.find((e) => e.id === selectedEle.id);
    if (!el) return;

    el.fillColor = fillColor;
    doRedrawRef.current?.();
    socket.emit("element-update", {
      roomId,
      id: el.id,
      changes: { fillColor },
    });
  };


  return { handleEditShapeOutlineColor, handleEditShapeFillColor };
}
