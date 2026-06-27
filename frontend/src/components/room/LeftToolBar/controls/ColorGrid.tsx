import { Pipette } from "lucide-react";
import { useState } from "react";
import { useToolSettings } from "../../../../context/ToolBarLeftContext";
export default function ColorGrid({
  isMostUsedColorsNeeded,
}: {
  isMostUsedColorsNeeded: boolean;
}) {

 const strokeColors = [
  "#facc15", // yellow-400
  "#84cc16", // lime-500
  "#10b981", // emerald-500
  "#0ea5e9", // sky-500
  "#6366f1", // indigo-500
  "#7c3aed", // violet-600
  "#d946ef", // fuchsia-500
  "#f43f5e", // rose-500
  "#78716c", // stone-500
  "#475569", // slate-600
  "#52525b", // zinc-600
  "#525252", // neutral-600
  "#c2410c", // orange-700
  "#b91c1c", // red-700
  "#15803d", // green-700
  "#1d4ed8", // blue-700
];

  const {strokeColor,setStrokeColor}=useToolSettings();

  return (
    <div
      className={`absolute text-white left-[150%] w-[210px] top-0 flex flex-col justify-center rounded-2xl bg-[#1f1f2b] shadow-xl p-5 z-20`}
    >
      {isMostUsedColorsNeeded && (
        <>
          <p className="mb-2 text-sm font-medium text-white ">Stroke</p>
          <span className="mb-2 text-[12px]  text-white ">
            most Used custom colors
          </span>
          <div style={{backgroundColor:strokeColor}} className="w-6 h-6"></div>
        </>
      )}

      <span className="mb-1 text-[12px]  text-white mt-4">Colors</span>
      <div className="grid grid-cols-5 gap-1 w-fit">
        {strokeColors.map((color) => (
          <div
            key={color}
            style={{backgroundColor:color}}
            className={`w-6 h-6 rounded cursor-pointer ${
              strokeColor === color
                ? "border-2 border-purple-500"
                : "border border-transparent"
            }`}
            onClick={() => setStrokeColor(color)}
          />
        ))}
      </div>

      <span className="mb-1 text-[12px]  text-white mt-4">Shades</span>
      <div className="grid grid-cols-5 gap-1 w-fit">
        <div className="w-6 h-6 bg-red-500"></div>
        <div className="w-6 h-6 bg-blue-500"></div>
        <div className="w-6 h-6 bg-green-500"></div>
        <div className="w-6 h-6 bg-yellow-500"></div>
        <div className="w-6 h-6 bg-purple-500"></div>
      </div>

      <span className="mb-1 text-[12px]  text-white mt-4">Hex Code</span>
      <div className="flex w-full border border-gray-500 focus:outline-none ">
        <input
          className="text-white bg-[#1f1f2b] w-[80%]"
          type="text"
          name=""
          placeholder="#tyfd32"
          id=""
        />
        <Pipette className="bg-white z-20 w-6 h-fit flex-1" />
      </div>
    </div>
  );
}
