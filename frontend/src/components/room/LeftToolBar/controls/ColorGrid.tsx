import { Pipette } from "lucide-react";
import { useState } from "react";
export default function ColorGrid({
  isMostUsedColorsNeeded,
}: {
  isMostUsedColorsNeeded: boolean;
}) {
  const [selectedColor, setSelectedColor] = useState<string>("bg-red-500");

  const strokeColors = [
    "bg-yellow-400",
    "bg-lime-500",
    "bg-emerald-500",
    "bg-sky-500",
    "bg-indigo-500",
    "bg-violet-600",
    "bg-fuchsia-500",
    "bg-rose-500",
    "bg-stone-500",
    "bg-slate-600",
    "bg-zinc-600",
    "bg-neutral-600",
    "bg-orange-700",
    "bg-red-700",
    "bg-green-700",
    "bg-blue-700",
  ];

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
          <div className="w-8 h-8 bg-red-500"></div>
        </>
      )}

      <span className="mb-1 text-[12px]  text-white mt-4">Colors</span>
      <div className="grid grid-cols-5 gap-1 w-fit">
        {strokeColors.map((color) => (
          <div
            key={color}
            className={`w-8 h-8 rounded cursor-pointer ${color} ${
              selectedColor === color
                ? "border-2 border-purple-500"
                : "border border-transparent"
            }`}
            onClick={() => setSelectedColor(color)}
          />
        ))}
      </div>

      <span className="mb-1 text-[12px]  text-white mt-4">Shades</span>
      <div className="grid grid-cols-5 gap-1 w-fit">
        <div className="w-8 h-8 bg-red-500"></div>
        <div className="w-8 h-8 bg-blue-500"></div>
        <div className="w-8 h-8 bg-green-500"></div>
        <div className="w-8 h-8 bg-yellow-500"></div>
        <div className="w-8 h-8 bg-purple-500"></div>
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
