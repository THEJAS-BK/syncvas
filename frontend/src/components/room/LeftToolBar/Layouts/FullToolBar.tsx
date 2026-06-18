import React from "react";
import FillToggle from "../controls/FillToggle";
import ColorSwatches from "../controls/ColorSwatches";
import StrokeWidth from "../controls/StrokeWidth";
import OpacitySlider from "../controls/OpacitySlider";
import LayerControls from "../controls/LayerControls";
import FontSetting from "../controls/FontSetting";
import StrokeStyle from "../controls/StrokeStyle";
import ArrowSetting from "../controls/ArrowSetting";
import EdgeSetting from "../controls/EdgeSetting";
import { LineSquiggle } from "lucide-react";
export default function FullToolBar({
  activeTool,
}: {
  activeTool: string | null;
}) {
  return (
    <div className="toolbar-scroll absolute text-white left-3 top-1/4 flex flex-col rounded-2xl bg-[#1f1f2b] shadow-xl p-3 h-3/4 z-20">

      {activeTool === "pen" && (
        <>
          <ColorSwatches activeTool={"pen"} />
          <FillToggle />
          <StrokeWidth />
          <OpacitySlider />
          <LayerControls />
        </>
      )}
      {activeTool === "text" && (
        <>
          <ColorSwatches activeTool={"text"} />
          <FontSetting />
          <OpacitySlider />
          <LayerControls />
        </>
      )}
      {activeTool === "arrow" && (
        <>
          <ColorSwatches activeTool={"arrow"} />
          <StrokeWidth />
          <StrokeStyle />
          <ArrowSetting activeTool={"arrow"} />
          <OpacitySlider />
          <LayerControls />
        </>
      )}
      {activeTool === "line" && (
        <>
          <ColorSwatches activeTool={"line"} />
          <FillToggle />
          <StrokeWidth />
          <ArrowSetting activeTool={"line"} />
          <EdgeSetting />
          <OpacitySlider />
          <LayerControls />
        </>
      )}
      {activeTool === "square" && (
        <>
          <ColorSwatches activeTool={"square"} />
          <FillToggle />
          <StrokeWidth />
          <StrokeStyle />
         <ArrowSetting activeTool={"square"} />
          <EdgeSetting />
          <OpacitySlider />
          <LayerControls />
        </>
      )}
      {activeTool === "diamond" && (
        <>
          <ColorSwatches activeTool={"diamond"} />
          <FillToggle />
          <StrokeWidth />
          <StrokeStyle />
          <ArrowSetting activeTool={"diamond"} />
          <EdgeSetting />
          <OpacitySlider />
          <LayerControls />
        </>
      )}
      {activeTool === "circle" && (
        <>
          <ColorSwatches activeTool={"circle"} />
          <FillToggle />
          <StrokeWidth />
          <StrokeStyle />
          <ArrowSetting activeTool={"circle"}/>
          <OpacitySlider />
          <LayerControls />
        </>
      )}
    </div>
  );
}
