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
    "bg-transparent",
    "bg-red-900",
    "bg-green-900",
    "bg-blue-900",
    "bg-yellow-950",
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
            className="w-7 h-7 ml-px  bg-purple-500 static rounded hover:scale-115"
            onClick={() => toggle("strokes")}
          >
            {colorGrid === "strokes" && (
              <ColorGrid isMostUsedColorsNeeded={true} />
            )}
          </div>
        </div>
      </div>
      {activeTool !== "text" && activeTool !== "arrow" && (
        <>
          <p className="mb-2 mt-2 text-sm  text-gray-300 ">Background</p>
          <div className="flex items-center gap-1 ">
            {backgroundColors.map((color) => (
              <div
                key={color}
                className={`w-6 h-6 rounded cursor-pointer ${color} ${
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
                className="w-7 h-7 ml-px rounded bg-purple-500 static hover:scale-115"
                onClick={() => toggle("background")}
              >
                {colorGrid === "background" && (
                  <ColorGrid isMostUsedColorsNeeded={false} />
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
