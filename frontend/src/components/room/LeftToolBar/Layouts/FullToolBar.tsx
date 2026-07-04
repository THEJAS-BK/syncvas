import React, { type Dispatch, type SetStateAction } from "react";
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
import type { Shape } from "@mui/material/styles";
import type { Line, TextBox } from "../../Multicursor/types";
  export default function FullToolBar({
    isEditMode,
    activeTool,
  }: {
    activeTool: string | null,
    isEditMode:Dispatch<SetStateAction<Line|TextBox|Shape|null>>
  }) {
    const tools = ["pen", "text", "arrow", "line", "square", "diamond", "circle"];
    return (
      <div
        className={`toolbar-scroll absolute text-white left-3 top-15 flex flex-col rounded-2xl bg-[#1f1f2b] shadow-xl ${tools.includes(activeTool ?? "")||tools.includes(isEditMode ?? "") ? "p-3" : "hidden"} z-20`}
      >
        {(activeTool === "pen") && (
          <>
            <ColorSwatches activeTool={"pen"} isEditMode={isEditMode} />
            <FillToggle />
            <StrokeWidth />
            <OpacitySlider />
            <LayerControls />
          </>
        )}
        {(activeTool === "text" )&& (
          <>
            <ColorSwatches activeTool={"text"} isEditMode={isEditMode} />
            <FontSetting />
            <OpacitySlider />
            <LayerControls />
          </>
        )}
        {(activeTool === "arrow"  )&& (
          <>
            <ColorSwatches activeTool={"arrow"} />
            <StrokeWidth />
            <StrokeStyle />
            <ArrowSetting activeTool={"arrow"} />
            <OpacitySlider />
            <LayerControls />
          </>
        )}
        {(activeTool === "line" ) && (
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
        {(activeTool === "square"  )&& (
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
        {(activeTool === "diamond"  )&& (
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
        {(activeTool === "circle"  )&& (
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
