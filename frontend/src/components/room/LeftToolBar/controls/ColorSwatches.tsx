import React, { useEffect, useRef, useState } from "react";
import ColorGrid from "./ColorGrid";
import { useToolSettings } from "../../../../context/ToolBarLeftContext";
import { useEditorState } from "../../../../context/EditerStateContext";

export default function ColorSwatches({
  activeTool,

}: {
  activeTool: string | null;
}) {
  const [colorGrid, setColorGrid] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggle = (panel: string) => {
    setColorGrid((prev) => (prev === panel ? null : panel));
  };

  useEffect(() => {
    if (!colorGrid) return; 

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setColorGrid(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [colorGrid]);

  const {
    strokeColor,
    setStrokeColor,
    fillColor,
    setFillColor,
  } = useToolSettings();

  const {setEditColor,editcolor} = useEditorState();

  const strokeColors = ["#1f2937", "#f87171", "#22c55e", "#3b82f6", "#d97706"];
  const backgroundColors = [
    "transparent",
    "#7f1d1d",
    "#14532d",
    "#1e3a8a",
    "#422006",
  ];

  return (
    <div ref={containerRef} className="flex flex-col z-20">
      <span className="mb-2 text-sm text-gray-300">Strokes</span>
      <div className="flex items-center gap-1"> 
        {strokeColors.map((color) => (
          <div
            key={color}
            style={{ backgroundColor: color }}
            className={`w-6 h-6 rounded cursor-pointer ${
              (strokeColor === color)
                ? "border-2 border-purple-500"
                : "border border-transparent"
            }`}
            onClick={() => {
              setStrokeColor(color);
              setEditColor(color);
            }}
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
          <p className="mb-2 mt-2 text-sm text-gray-300">Background</p>
          <div className="flex items-center gap-1">
            {backgroundColors.map((color) => (
              <div
                key={color}
                style={{ backgroundColor: color }}
                className={`w-6 h-6 rounded cursor-pointer ${
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
                className="w-7 h-7 ml-px rounded static hover:scale-115"
                onClick={() => toggle("background")}
              ></div>
            </div>
          </div>
        </>
      )}

      {colorGrid === "strokes" && <ColorGrid isMostUsedColorsNeeded={true} />}
      {colorGrid === "background" && <ColorGrid isMostUsedColorsNeeded={false} />}
    </div>
  );
}