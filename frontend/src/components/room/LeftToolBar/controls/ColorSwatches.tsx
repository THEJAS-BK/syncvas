import React, { useState } from "react";
import ColorGrid from "./ColorGrid";
import { useToolSettings } from "../../../../context/ToolBarLeftContext";

export default function ColorSwatches({
  activeTool,
}: {
  activeTool: string | null;
}) {
  const [colorGrid, setColorGrid] = useState<string | null>(null);
  const toggle = (panel: string) => {
    setColorGrid((prev) => (prev === panel ? null : panel));
  };
  const {
    strokeColor,
    setStrokeColor,
    fillColor,
    setFillColor,
    strokeWidth,
    setStrokeWidth,
    opacity,
    setOpacity,
  } = useToolSettings();

  const strokeColors = ["#1f2937", "#f87171", "#22c55e", "#3b82f6", "#d97706"];
  const backgroundColors = [
    "transparent", // bg-transparent
    "#7f1d1d", // red-900
    "#14532d", // green-900
    "#1e3a8a", // blue-900
    "#422006", // yellow-950
  ];

  return (
    <div className=" flex flex-col z-20">
      <span className="mb-2 text-sm  text-gray-300 ">Strokes</span>
      <div className="flex items-center gap-1">
        {strokeColors.map((color) => (
          <div
            key={color}
            style={{ backgroundColor: color }}
            className={`w-6 h-6 rounded cursor-pointer ${
              strokeColor === color
                ? "border-2 border-purple-500"
                : "border border-transparent"
            }`}
            onClick={() => setStrokeColor(color)}
          />
        ))}
        <div className="flex gap-1">
          <div className="w-px h-7 bg-gray-600 align-center"></div>
          <div
            style={{ backgroundColor: strokeColor }}
            className="w-7 h-7 ml-px static rounded hover:scale-115"
            onClick={() => toggle("strokes")}
          ></div>
        </div>
      </div>
      {activeTool !== "text" && activeTool !== "arrow" && (
        <>
          <p className="mb-2 mt-2 text-sm  text-gray-300 ">Background</p>
          <div className="flex items-center gap-1 ">
            {backgroundColors.map((color) => (
              <div
                key={color}
                style={{ backgroundColor: color }}
                className={`w-6 h-6 rounded cursor-pointer${
                  fillColor === color
                    ? "border-2 border-purple-500"
                    : "border border-transparent"
                }`}
                onClick={() => setFillColor(color)}
              />
            ))}
            <div className="flex gap-1">
              <div className="w-px h-7 bg-gray-600 align-center"></div>
              <div
                style={{ backgroundColor: fillColor }}
                className="w-7 h-7 ml-px rounded  static hover:scale-115"
                onClick={() => toggle("background")}
              ></div>
            </div>
          </div>
        </>
      )}
      {colorGrid === "strokes" && <ColorGrid isMostUsedColorsNeeded={true} />}
      {colorGrid === "background" && (
        <ColorGrid isMostUsedColorsNeeded={false} />
      )}
    </div>
  );
}
