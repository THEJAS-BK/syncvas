import FullToolBar from "./Layouts/FullToolBar";
import { useToolSettings } from "../../../context/ToolBarLeftContext";
import CompactToolBar from "./Layouts/CompactToolBar";
import { useRef, useState } from "react";

export default function ToolBarContainer() {
  const { activeTool, selectedEle  } = useToolSettings();
  const lastTool = useRef<string | null>(null);

  if (selectedEle?.type === "shape") {
    lastTool.current = selectedEle.shapeType;
  } else if (selectedEle?.type === "line") {
    lastTool.current = selectedEle.lineType;
  } else if (selectedEle?.type === "textbox") {
    lastTool.current = "text";
  } 
  
  if (selectedEle === null||activeTool!=="mouse") {
    lastTool.current = null; 
  }
  // if none match, lastTool.current just keeps whatever it was before


  const displayTool = lastTool.current || activeTool  ;

  return (
    <div >
      <FullToolBar displayTool={displayTool} />
    </div>
  );
}
