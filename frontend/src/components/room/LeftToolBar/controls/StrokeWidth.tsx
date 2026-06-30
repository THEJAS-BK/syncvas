import { Minus } from "lucide-react";
import { useToolSettings } from "../../../../context/ToolBarLeftContext";

export default function StrokeWidth() {
  const {strokeWidth,setStrokeWidth}=useToolSettings();
  return (
    <div>
      <p className="mb-2 mt-2 ml-1 text-sm  text-gray-300 ">Stroke Width</p>
      <div className="flex gap-4">
        <div
          onClick={() => setStrokeWidth(1)}
          className={`icon-background ${strokeWidth === 1 ? "bg-[rgb(65,65,137)]" : "bg-[rgb(51,52,55)]"} `}
        >
          <Minus className="icon" strokeWidth={1.25} />
        </div>
        <div
          onClick={() => setStrokeWidth(2)}
          className={`icon-background ${strokeWidth === 2 ? "bg-[rgb(65,65,137)]" : "bg-[rgb(51,52,55)]"} `}
        >
          <Minus className="icon"  />
        </div>
        <div
          onClick={() => setStrokeWidth(3)}
          className={`icon-background ${strokeWidth === 3 ? "bg-[rgb(65,65,137)]" : "bg-[rgb(51,52,55)]"} `}
        >
          <Minus className="icon"  strokeWidth={3} />
        </div>
      </div>
    </div>
  );
}
