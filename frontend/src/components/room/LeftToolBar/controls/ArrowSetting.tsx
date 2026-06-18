import {
  LineSquiggle,
  MoveUpRight,
  CornerUpRight,
  TrendingUp,
  ArrowRightFromLine,
  MoveRight,
} from "lucide-react";
import { useState } from "react";

export default function ArrowSetting({ activeTool }: { activeTool: string }) {
  const [sloppiness, setSloppiness] = useState<string>("architect");
  const [arrowType, setArrowType] = useState<string>("solid");
  const [arrowheads, setArrowheads] = useState<string>("");
  return (
    <div>
      <div className="mt-2">
        <span className="mb-2 text-sm  text-gray-300 ">Sloppiness</span>
        <div className="flex space-x-2">
          <div
            onClick={() => setSloppiness("architect")}
            className={`icon-background ${sloppiness === "architect" ? "bg-[rgb(65,65,137)]" : "bg-[rgb(51,52,55)]"} `}
          >
            <LineSquiggle className="icon" />
          </div>
          <div
            onClick={() => setSloppiness("artist")}
            className={`icon-background ${sloppiness === "artist" ? "bg-[rgb(65,65,137)]" : "bg-[rgb(51,52,55)]"} `}
          >
            <LineSquiggle className="icon" />
          </div>
          <div
            onClick={() => setSloppiness("catoonist")}
            className={`icon-background ${sloppiness === "catoonist" ? "bg-[rgb(65,65,137)]" : "bg-[rgb(51,52,55)]"} `}
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
              onClick={() => setArrowheads("none")}
              className={`icon-background ${arrowheads === "none" ? "bg-[rgb(65,65,137)]" : "bg-[rgb(51,52,55)]"} `}
            >
              <ArrowRightFromLine className="icon" />
            </div>
            <div
              onClick={() => setArrowheads("classic")}
              className={`icon-background ${arrowheads === "classic" ? "bg-[rgb(65,65,137)]" : "bg-[rgb(51,52,55)]"} `}
            >
              <MoveRight className="icon" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
