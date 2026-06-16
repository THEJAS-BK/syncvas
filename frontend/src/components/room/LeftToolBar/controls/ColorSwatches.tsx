import React from "react";

export default function ColorSwatches({
  activeTool,
}: {
  activeTool: string | null;
}) {
  return (
    <div className=" flex flex-col z-20">
      <p>Strokes</p>
      <div className="grid grid-cols-5 gap-2">
        <div className="w-8 h-8 bg-red-500"></div>
        <div className="w-8 h-8 bg-blue-500"></div>
        <div className="w-8 h-8 bg-green-500"></div>
        <div className="w-8 h-8 bg-yellow-500"></div>
        <div className="w-8 h-8 bg-purple-500"></div>
      </div>
      {(activeTool !== "text" && activeTool !== "arrow") && (
        <>
          <p>Background</p>
          <div className="grid grid-cols-5 gap-2">
            <div className="w-8 h-8 bg-red-500"></div>
            <div className="w-8 h-8 bg-blue-500"></div>
            <div className="w-8 h-8 bg-green-500"></div>
            <div className="w-8 h-8 bg-yellow-500"></div>
            <div className="w-8 h-8 bg-purple-500"></div>
          </div>
        </>
      )}
    </div>
  );
}
