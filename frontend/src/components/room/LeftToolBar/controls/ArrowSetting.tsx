import {
  LineSquiggle,
  MoveUpRight,
  CornerUpRight,
  TrendingUp,
  ArrowRightFromLine,
  MoveRight,
} from "lucide-react";
import { useToolSettings } from "../../../../context/ToolBarLeftContext";

export default function ArrowSetting({ activeTool }: { activeTool: string }) {
  const { sloppines, setSloppines, arrowType, setArrowType, arrowHead, setArrowHead } = useToolSettings();
  return (
    <div>
      <div className="mt-2">
        <span className="mb-2 text-sm  text-gray-300 ">Sloppiness</span>
        <div className="flex space-x-2">
          <div
            onClick={() => setSloppines("architect")}
            className={`icon-background ${sloppines === "architect" ? "bg-[rgb(65,65,137)]" : "bg-[rgb(51,52,55)]"} `}
          >
            <LineSquiggle className="icon" />
          </div>
          <div
            onClick={() => setSloppines("artist")}
            className={`icon-background ${sloppines === "artist" ? "bg-[rgb(65,65,137)]" : "bg-[rgb(51,52,55)]"} `}
          >
            <LineSquiggle className="icon" />
          </div>
          <div
            onClick={() => setSloppines("catoonist")}
            className={`icon-background ${sloppines === "catoonist" ? "bg-[rgb(65,65,137)]" : "bg-[rgb(51,52,55)]"} `}
          >
            <LineSquiggle className="icon" />
          </div>
        </div>
      </div>

      {activeTool !== "square" && activeTool !== "diamond" && activeTool !== "circle"  && (
        <div className="mt-2">
          <span className="mb-2 text-sm  text-gray-300 ">Arrow type</span>
          <div className="flex space-x-2">
            <div
              onClick={() => setArrowType("solid")}
              className={`icon-background ${arrowType === "solid" ? "bg-[rgb(65,65,137)]" : "bg-[rgb(51,52,55)]"} `}
            >
              <MoveUpRight className="icon" />
            </div>
            <div
              onClick={() => setArrowType("dashed")}
              className={`icon-background ${arrowType === "dashed" ? "bg-[rgb(65,65,137)]" : "bg-[rgb(51,52,55)]"} `}
            >
              <CornerUpRight className="icon" />
            </div>
            <div
              onClick={() => setArrowType("dotted")}
              className={`icon-background ${arrowType === "dotted" ? "bg-[rgb(65,65,137)]" : "bg-[rgb(51,52,55)]"} `}
            >
              <TrendingUp className="icon" />
            </div>
          </div>
        </div>
      )}

      {activeTool !== "square" && activeTool !== "diamond"&& activeTool !== "circle" && (
        <div className="mt-2">
          <span className="mb-2 text-sm  text-gray-300 ">Arrowheads</span>
          <div className="flex space-x-2">
            <div
              onClick={() => setArrowHead("none")}
              className={`icon-background ${arrowHead === "none" ? "bg-[rgb(65,65,137)]" : "bg-[rgb(51,52,55)]"} `}
            >
              <ArrowRightFromLine className="icon" />
            </div>
            <div
              onClick={() => setArrowHead("classic")}
              className={`icon-background ${arrowHead === "classic" ? "bg-[rgb(65,65,137)]" : "bg-[rgb(51,52,55)]"} `}
            >
              <MoveRight className="icon" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
