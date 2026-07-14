import { useToolSettings } from "../../../context/ToolBarLeftContext";

export function useOfflineEditElements() {
  const {
    shapesRef,
    linesRef,
    textBoxesRef,
    doRedrawRef,
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

    const el = ref.current.find((e:any) => e.id === selectedEle.id);
    if (!el) return;

    el.color = color;
    doRedrawRef.current?.();
  };

  const handleEditShapeFillColor = (fillColor: string) => {
    if (!selectedEle || selectedEle.type !== "shape") return;

    const el = shapesRef.current.find((e:any) => e.id === selectedEle.id);
    if (!el) return;

    el.fillColor = fillColor;
    doRedrawRef.current?.();
  };

  const handleLineStrokeWidthUpdate = (strokeWidth: number) => {
    if (!selectedEle || selectedEle.type !== "line") return;

    const el = linesRef.current.find((e:any) => e.id === selectedEle.id);
    if (!el) return;

    el.strokeWidth = strokeWidth;
    doRedrawRef.current?.();
  };

  const handleEdgeUpdatation = (edge: string) => {
    if (!selectedEle || selectedEle.type !== "shape") return;

    const el = shapesRef.current.find((e:any) => e.id === selectedEle.id);
    if (!el) return;

    el.edgeStyle = edge;
    doRedrawRef.current?.();
  };

  return {
    handleEdgeUpdatation,
    handleEditShapeOutlineColor,
    handleLineStrokeWidthUpdate,
    handleEditShapeFillColor,
  };
}