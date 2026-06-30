import { Square, SquareDashedKanban, SquareMenu } from "lucide-react";
import { useToolSettings } from "../../../../context/ToolBarLeftContext";

export default function FillToggle() {
  const {shapeFillType,setShapeFillType}=useToolSettings();
  return (
    <div>
      <p className="mb-2 mt-2 ml-1 text-sm font-medium text-gray-300 ">Fill</p>
      <div className="flex gap-2">
        <div
          onClick={() => setShapeFillType("hachure")}
          className={`icon-background ${shapeFillType === "hachure" ? "bg-[rgb(65,65,137)]" : "bg-[rgb(51,52,55)]"} `}
        >
          <Square className="icon" />
        </div>
        <div
          onClick={() => setShapeFillType("cross-hatch")}
          className={`icon-background ${shapeFillType === "cross-hatch" ? "bg-[rgb(65,65,137)]" : "bg-[rgb(51,52,55)]"}`}
        >
          <SquareMenu className="icon" />
        </div>
        <div
          onClick={() => setShapeFillType("solid")}
          className={`icon-background ${shapeFillType === "solid" ? "bg-[rgb(65,65,137)]" : "bg-[rgb(51,52,55)]"} `}
        >
          <SquareDashedKanban className="icon" />
        </div>
      </div>
    </div>
  );
}
