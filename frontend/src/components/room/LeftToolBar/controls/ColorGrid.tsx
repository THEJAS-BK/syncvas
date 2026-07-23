import { Pipette } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useToolSettings } from "../../../../context/ToolBarLeftContext";

import { colorShades } from "../tools/colors";
export default function ColorGrid({
  isMostUsedColorsNeeded,
}: {
  isMostUsedColorsNeeded: boolean;
}) {
  const { strokeColor, setStrokeColor, shadeIdx, setShadeIdx, setFillColor } =
    useToolSettings();
  const [colorList, setColorList] = useState<{ char: string; color: string }[]>(
    [],
  );
  const [selectedChar, setSelectedChar] = useState<string>("");
  const [currentShade,setCurrentShade]=useState([""]);

  useEffect(()=>{
      setCurrentShade(colorShades[selectedChar] ?? [])
  },[selectedChar])

  useEffect(()=>{
  const val =Object.entries(colorShades).find(([char,ele])=>{
    return ele[ele.length-1]===strokeColor
  })
  if(!val)return
    const shades= colorShades[val[0]] ?? [];
    setCurrentShade(shades)
  },[strokeColor])



  useEffect(() => {
    const handleQuickColorChange = (e: KeyboardEvent) => {
      const shadeCodeMap: Record<string, number> = {
        Digit1: 0,
        Digit2: 1,
        Digit3: 2,
        Digit4: 3,
        Digit5: 4,
      };

      if (e.shiftKey && shadeCodeMap[e.code] !== undefined) {
        const index = shadeCodeMap[e.code];
        setShadeIdx(index);

        const shade = colorShades[selectedChar]?.[index];
        if (shade) setStrokeColor(shade);
        return;
      }

      const match = colorList.find((c) => c.char === e.key);
      if (!match) return;
      setStrokeColor(match.color);
      setSelectedChar(match.char);
    };

    window.addEventListener("keydown", handleQuickColorChange);
    return () => {
      window.removeEventListener("keydown", handleQuickColorChange);
    };
  }, [setStrokeColor, selectedChar]);

  useEffect(() => {
    const temp = Object.entries(colorShades).map(([char, shades]) => ({
      char,
      color: shades[shadeIdx],
    }));
    setColorList(temp);
  }, [setShadeIdx]);

  return (
    <div
      className={`absolute text-white left-[110%] w-[210px] top-5 flex flex-col justify-center rounded-2xl bg-[#1f1f2b] shadow-xl p-5 z-20`}
    >
      {isMostUsedColorsNeeded && (
        <>
          <p className="mb-2 text-sm font-medium text-white ">Stroke</p>
          <span className="mb-2 text-[12px]  text-white ">
            most Used custom colors
          </span>
          <div
            style={{ backgroundColor: strokeColor }}
            className="h-6 w-6 rounded cursor-pointer "
          ></div>
        </>
      )}

      <span className="mb-1 text-[12px]  text-white mt-4">Colors</span>
      <div className="grid grid-cols-5 gap-1 w-fit">
        {colorList.map((stroke) => (
          <div
            key={stroke.color}
            style={{ backgroundColor: stroke.color }}
            className={`w-7 h-7 rounded cursor-pointer ${
              strokeColor === stroke.color
                ? "border-2 border-purple-500"
                : "border border-transparent"
            }`}
            onClick={() => {
              if (!isMostUsedColorsNeeded) {
                setFillColor(stroke.color);
                setSelectedChar(stroke.char);
                return;
              }
              setStrokeColor(stroke.color);
              setSelectedChar(stroke.char);
            }}
          >
            <span className="text-sm flex items-end mt-2 ml-0.5">
              {stroke.char}
            </span>
          </div>
        ))}
      </div>

      <span className="mb-1 text-[12px]  text-white mt-4">Shades</span>
      <div className="grid grid-cols-5 gap-1 w-fit">
        {currentShade.map((color, idx) => (
          <div
            key={idx}
            style={{ backgroundColor: color }}
            className={`w-6 h-6 ${
              strokeColor === color
                ? "border-2 border-purple-500"
                : "border border-transparent"
            }`}
            onClick={() => {
              setShadeIdx(idx);
              if (!isMostUsedColorsNeeded) {
                setFillColor(color);
                return;
              }
              setStrokeColor(color);
            }}
          />
        ))}
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
