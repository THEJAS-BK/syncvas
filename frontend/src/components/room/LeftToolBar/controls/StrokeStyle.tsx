import{ useState } from "react"; 
import { useToolSettings } from "../../../../context/ToolBarLeftContext";
import { Ellipsis, GripHorizontal, Minus } from "lucide-react";
export default function StrokeStyle() {
    const {strokeStyle,setStrokeStyle}=useToolSettings();

  return (
    <div>
      <span className="mb-2 text-sm font-medium text-gray-300 ">Stroke style</span>
      <div className="flex space-x-2">
        <div
          onClick={() => setStrokeStyle("solid")}
          className={`icon-background ${strokeStyle === "solid" ? "bg-[rgb(65,65,137)]" : "bg-[rgb(51,52,55)]"} `}
        >
          <Minus strokeWidth={3} />
        </div>
        <div
          onClick={() => setStrokeStyle("dashed")}
          className={`icon-background ${strokeStyle === "dashed" ? "bg-[rgb(65,65,137)]" : "bg-[rgb(51,52,55)]"} `}
        >
          <Ellipsis strokeWidth={3} />
        </div>
        <div
          onClick={() => setStrokeStyle("dotted")}
          className={`icon-background ${strokeStyle === "dotted" ? "bg-[rgb(65,65,137)]" : "bg-[rgb(51,52,55)]"} `}
        >
          <GripHorizontal strokeWidth={3} />
        </div>
      </div>
    </div>
  );
}
