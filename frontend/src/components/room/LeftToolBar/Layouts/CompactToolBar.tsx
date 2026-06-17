import { Settings2 } from "lucide-react";
import ColorGrid from "../controls/ColorGrid";
import { useState } from "react";
import FillToggle from "../controls/FillToggle";
import StrokeWidth from "../controls/StrokeWidth";
import OpacitySlider from "../controls/OpacitySlider";
import LayerControls from "../controls/LayerControls";
import FontSetting from "../controls/FontSetting";
import StrokeStyle from "../controls/StrokeStyle";
import ArrowSetting from "../controls/ArrowSetting";
import EdgeSetting from "../controls/EdgeSetting";
import { LineSquiggle } from "lucide-react";

export default function CompactToolBar({ activeTool }: { activeTool: string|null }) {
  const [panel, setPanel] = useState<string | null>(null);

  const toggle = (panel: string) => {
    setPanel((prev) => (prev === panel ? null : panel));
  };
  return (
    <div className="absolute left-3 top-1/4 flex flex-col bg-blue-200 z-20 p-2 gap-3">
      <div className="relative w-8 h-8" onClick={() => toggle("strokes")}>
        <LineSquiggle />
        <div className="left-full top-0" onClick={(e) => e.stopPropagation()}>
          {panel === "strokes" && <ColorGrid isMostUsedColorsNeeded={true} />}
        </div>
      </div>
      <div
        className="w-8 h-8 bg-green-500 relative"
        onClick={() => toggle("background")}
      >
        <div className=" absolute left-full top-0 bg-red-600" onClick={(e) => e.stopPropagation()}>
          {panel === "background" && (
            <ColorGrid isMostUsedColorsNeeded={false} />
          )}
        </div>
      </div>

      <div className="relative w-8 h-8" onClick={() => toggle("settings")}>
        <Settings2 />
        <div className=" absolute left-full top-0 bg-gray-600 z-9999" onClick={(e) => e.stopPropagation()}>
          
          {panel === "settings" && (
            <>
              {activeTool === "pen" && (
                <>
                  <FillToggle />
                  <StrokeWidth />
                  <StrokeStyle />
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
                  <ArrowSetting />
                  <OpacitySlider />
                  <LayerControls />
                </>
              )}

              {activeTool === "line" && (
                <>
                  <FillToggle />
                  <StrokeWidth />
                  <ArrowSetting />
                  <EdgeSetting />
                  <OpacitySlider />
                  <LayerControls />
                </>
              )}

              {(activeTool === "square" || activeTool === "diamond") && (
                <>
                  <FillToggle />
                  <StrokeWidth />
                  <StrokeStyle />
                  <div>
                    <span>Sloppiness</span>
                    <div className="flex space-x-2">
                      <div>
                        <LineSquiggle strokeWidth={0.5} />
                      </div>
                      <div>
                        <LineSquiggle strokeWidth={1.75} />
                      </div>
                      <div>
                        <LineSquiggle strokeWidth={3} />
                      </div>
                    </div>
                  </div>
                  <EdgeSetting />
                  <OpacitySlider />
                  <LayerControls />
                </>
              )}

              {activeTool === "circle" && (
                <>
                  <FillToggle />
                  <StrokeWidth />
                  <StrokeStyle />
                  <div>
                    <span>Sloppiness</span>
                    <div className="flex space-x-2">
                      <div>
                        <LineSquiggle strokeWidth={0.5} />
                      </div>
                      <div>
                        <LineSquiggle strokeWidth={1.75} />
                      </div>
                      <div>
                        <LineSquiggle strokeWidth={3} />
                      </div>
                    </div>
                  </div>
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
