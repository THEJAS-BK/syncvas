import React, { useState } from "react";
import ColorGrid from "./ColorGrid";
import type { fabClasses } from "@mui/material";

export default function ColorSwatches({
  activeTool,
}: {
  activeTool: string | null;
}) {
  const [colorGrid, setColorGrid] = useState<string | null>(null);
  const toggle = (panel: string) => {
    setColorGrid((prev) => (prev === panel ? null : panel));
  };

  const [selectedColor, setSelectedColor] = useState<string>("bg-red-500");

  const strokeColors = [
    "bg-gray-300",
    "bg-red-400",
    "bg-green-500",
    "bg-blue-500",
    "bg-amber-600",
  ];

  const [selectedBackgroundColor, setSelectedBackgroundColor] =
    useState<string>();

  const backgroundColors = [
    "bg-transparent",
    "bg-red-900",
    "bg-green-900",
    "bg-blue-900",
    "bg-yellow-950",
  ];

  return (
    <div className=" flex flex-col z-20">
      <span className="mb-2 text-sm font-medium text-gray-300 ">Strokes</span>
      <div className="grid grid-cols-6 place-items-center">
        {strokeColors.map((color) => (
          <div
            key={color}
            className={`w-6 h-6 rounded cursor-pointer ${color} ${
              selectedColor === color
                ? "border-2 border-purple-500"
                : "border border-transparent"
            }`}
            onClick={() => setSelectedColor(color)}
          />
        ))}
        <div
          className="w-7 h-7 ml-px  bg-purple-500 static rounded hover:scale-115"
          onClick={() => toggle("strokes")}
        >
          {colorGrid === "strokes" && (
            <ColorGrid isMostUsedColorsNeeded={true} />
          )}
        </div>
      </div>
      {activeTool !== "text" && activeTool !== "arrow" && (
        <>
          <p className="mb-2 mt-2 text-sm font-medium text-gray-300 ">
            Background
          </p>
          <div className="grid grid-cols-6 place-items-center">
            {backgroundColors.map((color) => (
              <div
                key={color}
                className={`w-6 h-6 rounded cursor-pointer ${color} ${
                  selectedBackgroundColor === color
                    ? "border-2 border-purple-500"
                    : "border border-transparent"
                }`}
                onClick={() => setSelectedBackgroundColor(color)}
              />
            ))}
            <div
              className="w-7 h-7 ml-px rounded bg-purple-500 static hover:scale-115"
              onClick={() => toggle("background")}
            >
              {colorGrid === "background" && (
                <ColorGrid isMostUsedColorsNeeded={false} />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
