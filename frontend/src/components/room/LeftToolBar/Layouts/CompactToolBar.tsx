import { Settings2 } from "lucide-react";
import ColorGrid from "../controls/ColorGrid";
import { useState } from "react";
import StrokeWidth from "../controls/StrokeWidth";
import OpacitySlider from "../controls/OpacitySlider";
import LayerControls from "../controls/LayerControls";
import FontSetting from "../controls/FontSetting";
import StrokeStyle from "../controls/StrokeStyle";
import ArrowSetting from "../controls/ArrowSetting";
import EdgeSetting from "../controls/EdgeSetting";
import { LineSquiggle } from "lucide-react";
import { HachureIcon } from "../tools/HachureIcon";

export default function CompactToolBar({
  activeTool,
}: {
  activeTool: string | null;
}) {
  const [panel, setPanel] = useState<string | null>(null);

  const toggle = (panel: string) => {
    setPanel((prev) => (prev === panel ? null : panel));
  };
  const tools = ["pen", "text", "arrow", "line", "square", "diamond", "circle"];
  return (
    <div
      className={`absolute text-white rounded-2xl bg-[#1f1f2b] p-3 shadow-xl left-3 top-1/4 flex flex-col z-20 ${tools.includes(activeTool ?? "") ? "p-2" : "hidden"}  gap-3`}
    >
      <div
        className={`
    relative w-8 h-8 rounded-lg flex items-center justify-center
    transition-colors cursor-pointer
    ${panel === "strokes" ? "bg-neutral-800 ring-1 ring-neutral-600" : "hover:bg-neutral-800/60"}
  `}
        onClick={() => toggle("strokes")}
      >
        <HachureIcon />
        <div onClick={(e) => e.stopPropagation()}>
          {panel === "strokes" && <ColorGrid isMostUsedColorsNeeded={true} />}
        </div>
      </div>
      <div
        className="w-8 h-8 rounded bg-green-500 relative"
        onClick={() => toggle("background")}
      >
        <div
          className=" relative left-full top-0 bg-red-600"
          onClick={(e) => e.stopPropagation()}
        >
          {panel === "background" && (
            <ColorGrid isMostUsedColorsNeeded={false} />
          )}
        </div>
      </div>

      <div className="relative w-8 h-8" onClick={() => toggle("settings")}>
        <Settings2 />
        <div
          className={`absolute text-white left-[150%] w-[170px] top-0 flex flex-col justify-center rounded-2xl bg-[#1f1f2b] shadow-xl ${panel === "settings" ? "p-4" : "hidden"} z-20`}
          onClick={(e) => e.stopPropagation()}
        >
          {panel === "settings" && (
            <>
              {activeTool === "pen" && (
                <>
                  <StrokeWidth />
                  <OpacitySlider />
                  <LayerControls />
                </>
              )}

              {activeTool === "text" && (
                <>
                  <FontSetting />
                  <OpacitySlider />
                  <LayerControls />
                </>
              )}

              {activeTool === "arrow" && (
                <>
                  <StrokeWidth />
                  <StrokeStyle />
                  <ArrowSetting activeTool={activeTool} />
                  <OpacitySlider />
                  <LayerControls />
                </>
              )}

              {activeTool === "line" && (
                <>
                  <StrokeWidth />
                  <StrokeStyle/>
                  <ArrowSetting activeTool={activeTool} />
                  <EdgeSetting />
                  <OpacitySlider />
                  <LayerControls />
                </>
              )}

              {(activeTool === "square" || activeTool === "diamond") && (
                <>
                  <StrokeWidth />
                  <StrokeStyle />
                  <EdgeSetting />
                  <OpacitySlider />
                  <LayerControls />
                </>
              )}

              {activeTool === "circle" && (
                <>
                  <StrokeWidth />
                  <StrokeStyle />
                  <OpacitySlider />
                  <LayerControls />
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
