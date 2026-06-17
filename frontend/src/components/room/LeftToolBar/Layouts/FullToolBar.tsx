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
import ColorGrid from "../controls/ColorGrid";
export default function FullToolBar({
  activeTool,
}: {
  activeTool: string | null;
}) {
  return (
    <div className="absolute left-3 top-1/4 flex flex-col bg-blue-200 z-20">
      
     {activeTool === "pen" && (
  <>
    <ColorSwatches activeTool={"pen"} />
    <FillToggle />
    <StrokeWidth />
    <StrokeStyle/>
    <OpacitySlider />
    <LayerControls />
  </>
)}

{activeTool === "text" && (
  <>
    <ColorSwatches activeTool={"text"} />
    <FontSetting/>
    <OpacitySlider/>
    <LayerControls/>
  </>
)}

{activeTool === "arrow" && (
  <>
    <ColorSwatches activeTool={"arrow"} />
    <StrokeWidth />
    <StrokeStyle/>
    <ArrowSetting/>
    <OpacitySlider />
    <LayerControls />
  </>
)}

{activeTool === "line" && (
  <>
    <ColorSwatches activeTool={"line"} />
     <FillToggle />
    <StrokeWidth />
    <ArrowSetting/>
     <EdgeSetting/>
    <OpacitySlider />
    <LayerControls />
  </>
)}

{activeTool === "square" && (
  <>
    <ColorSwatches activeTool={"square"} />
    <FillToggle />
    <StrokeWidth />
    <StrokeStyle/>
      <div>
        <span>Sloppiness</span>
        <div className="flex space-x-2">
            <div><LineSquiggle strokeWidth={0.5} /></div>
            <div><LineSquiggle strokeWidth={1.75} /></div>
            <div><LineSquiggle strokeWidth={3} /></div>
        </div>
      </div>
    <EdgeSetting/>
    <OpacitySlider />
    <LayerControls />
  </>
)}

{activeTool === "diamond" && (
  <>
    <ColorSwatches activeTool={"diamond"} />
    <FillToggle />
    <StrokeWidth />
    <StrokeStyle/>
      <div>
        <span>Sloppiness</span>
        <div className="flex space-x-2">
            <div><LineSquiggle strokeWidth={0.5} /></div>
            <div><LineSquiggle strokeWidth={1.75} /></div>
            <div><LineSquiggle strokeWidth={3} /></div>
        </div>
      </div>
    <EdgeSetting/>
    <OpacitySlider />
    <LayerControls />
  </>
)}

{activeTool === "circle" && (
  <>
    <ColorSwatches activeTool={"circle"} />
    <FillToggle />
    <StrokeWidth />
    <StrokeStyle/>
    <div>
        <span>Sloppiness</span>
        <div className="flex space-x-2">
            <div><LineSquiggle strokeWidth={0.5} /></div>
            <div><LineSquiggle strokeWidth={1.75} /></div>
            <div><LineSquiggle strokeWidth={3} /></div>
        </div>
      </div>
    <OpacitySlider />
    <LayerControls />
  </>
)}

    </div>
  );
}
