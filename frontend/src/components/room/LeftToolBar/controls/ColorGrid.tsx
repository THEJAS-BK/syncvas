import { Pipette } from "lucide-react";

export default function ColorGrid({
  isMostUsedColorsNeeded,
}: {
  isMostUsedColorsNeeded: boolean;
}) {
  return (
    <div className="bg-gray-900 text-white absolute left-[105%] top-3">
      {isMostUsedColorsNeeded && (
        <>
          <span>most Used custom colors</span>
          <div className="w-7 h-7 bg-red-500"></div>
        </>
      )}

      <span>Colors</span>
      <div className="grid grid-cols-5 gap-2">
        <div className="w-7 h-7 bg-red-500"></div>
        <div className="w-7 h-7 bg-blue-500"></div>
        <div className="w-7 h-7 bg-green-500"></div>
        <div className="w-7 h-7 bg-yellow-500"></div>
        <div className="w-7 h-7 bg-purple-500"></div>
        <div className="w-7 h-7 bg-red-500"></div>
        <div className="w-7 h-7 bg-blue-500"></div>
        <div className="w-7 h-7 bg-green-500"></div>
        <div className="w-7 h-7 bg-yellow-500"></div>
        <div className="w-7 h-7 bg-purple-500"></div>
        <div className="w-7 h-7 bg-red-500"></div>
        <div className="w-7 h-7 bg-blue-500"></div>
        <div className="w-7 h-7 bg-green-500"></div>
        <div className="w-7 h-7 bg-yellow-500"></div>
        <div className="w-7 h-7 bg-purple-500"></div>
        <div className="w-7 h-7 bg-red-500"></div>
        <div className="w-7 h-7 bg-blue-500"></div>
        <div className="w-7 h-7 bg-green-500"></div>
        <div className="w-7 h-7 bg-yellow-500"></div>
        <div className="w-7 h-7 bg-purple-500"></div>
      </div>

      <span>Shades</span>
      <div className="grid grid-cols-5 gap-1">
        <div className="w-7 h-7 bg-red-500"></div>
        <div className="w-7 h-7 bg-blue-500"></div>
        <div className="w-7 h-7 bg-green-500"></div>
        <div className="w-7 h-7 bg-yellow-500"></div>
        <div className="w-7 h-7 bg-purple-500"></div>
      </div>

      <span>Hex Code</span>
      <div className="flex">
        <input
          className="text-white"
          type="text"
          name=""
          placeholder="#tyfd32"
          id=""
        />
        <Pipette />
      </div>
    </div>
  );
}
