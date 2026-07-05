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

  export default function FullToolBar({
    displayTool,
  }: {
    displayTool: string | null,
  }) {
    const tools = ["pen", "text", "arrow", "line", "square", "diamond", "circle"];
    return (
      <div
        className={`toolbar-scroll absolute text-white left-3 top-15 flex flex-col rounded-2xl bg-[#1f1f2b] shadow-xl ${tools.includes(displayTool ?? "") ? "p-3" : "hidden"} z-20`}
      >
        {(displayTool === "pen") && (
          <>
            <ColorSwatches activeTool={"pen"}  />
            <FillToggle />
            <StrokeWidth />
            <OpacitySlider />
            <LayerControls />
          </>
        )}
        {(displayTool === "text") && (
          <>
            <ColorSwatches activeTool={"text"}  />
            <FontSetting />
            <OpacitySlider />
            <LayerControls />
          </>
        )}
        {(displayTool === "arrow") && (
          <>
            <ColorSwatches activeTool={"arrow"} />
            <StrokeWidth />
            <StrokeStyle />
            <ArrowSetting activeTool={"arrow"} />
            <OpacitySlider />
            <LayerControls />
          </>
        )}
        {(displayTool === "line") && (
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
        {(displayTool === "square") && (
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
        {(displayTool === "diamond") && (
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
        {(displayTool === "circle"  )&& (
          <>
            <ColorSwatches activeTool={"circle"} />
            <FillToggle />
            <StrokeWidth />
            <StrokeStyle />
            <ArrowSetting activeTool={"circle"} />
            <OpacitySlider />
            <LayerControls />
          </>
        )}
      </div>
    );
  }
