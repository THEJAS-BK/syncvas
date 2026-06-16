import React from "react";
import FillToggle from "../controls/FillToggle";
import ColorSwatches from "../controls/ColorSwatches";
import StrokeWidth from "../controls/StrokeWidth";
import OpacitySlider from "../controls/OpacitySlider";
import LayerControls from "../controls/LayerControls";
import FontSetting from "../controls/FontSetting";
import StrokeStyle from "../controls/StrokeStyle";
import ArrowSetting from "../controls/ArrowSetting";

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
    <StrokeWidth />
    <OpacitySlider />
    <LayerControls />
  </>
)}

{activeTool === "square" && (
  <>
    <ColorSwatches activeTool={"square"} />
    <FillToggle />
    <StrokeWidth />
    <OpacitySlider />
    <LayerControls />
  </>
)}

{activeTool === "diamond" && (
  <>
    <ColorSwatches activeTool={"diamond"} />
    <FillToggle />
    <StrokeWidth />
    <OpacitySlider />
    <LayerControls />
  </>
)}

{activeTool === "circle" && (
  <>
    <ColorSwatches activeTool={"circle"} />
    <FillToggle />
    <StrokeWidth />
    <OpacitySlider />
    <LayerControls />
  </>
)}
    </div>
  );
}
