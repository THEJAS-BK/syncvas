import React, { useState } from "react";
import ColorGrid from "./ColorGrid";
import type { fabClasses } from "@mui/material";

export default function ColorSwatches({
  activeTool,
}: {
  activeTool: string | null;
}) {
 const [colorGrid,setColorGrid]=useState<string | null>(null)
 const toggle=(panel:string)=>{
  setColorGrid(prev=>prev===panel?null:panel)
 }
  return (
    <div className=" flex flex-col z-20">
      <p>Strokes</p>
      <div className="grid grid-cols-5 gap-2">
        <div className="w-8 h-8 bg-red-500"></div>
        <div className="w-8 h-8 bg-blue-500"></div>
        <div className="w-8 h-8 bg-green-500"></div>
        <div className="w-8 h-8 bg-yellow-500"></div>
        <div
          className="w-8 h-8 bg-purple-500 static"
          onClick={() => toggle("strokes")}
        >
          {colorGrid === "strokes" && <ColorGrid isMostUsedColorsNeeded={true} />}
        </div>
      </div>
      {activeTool !== "text" && activeTool !== "arrow" && (
        <>
          <p>Background</p>
          <div className="grid grid-cols-5 gap-2">
            <div className="w-8 h-8 bg-red-500"></div>
            <div className="w-8 h-8 bg-blue-500"></div>
            <div className="w-8 h-8 bg-green-500"></div>
            <div className="w-8 h-8 bg-yellow-500"></div>
            <div className="w-8 h-8 bg-purple-500 static" onClick={() => toggle("background")}>
              {colorGrid === "background" && <ColorGrid isMostUsedColorsNeeded={false} />}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
