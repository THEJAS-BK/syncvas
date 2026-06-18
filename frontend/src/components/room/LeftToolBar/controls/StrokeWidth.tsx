import { Minus } from "lucide-react";
import React, { useState } from "react";

export default function StrokeWidth() {
  const [selectedIcon, setSelectedIcon] = useState<string>("thin");
  return (
    <div>
      <p className="mb-2 mt-2 ml-1 text-sm  text-gray-300 ">Stroke Width</p>
      <div className="flex gap-4">
        <div
          onClick={() => setSelectedIcon("thin")}
          className={`icon-background ${selectedIcon === "thin" ? "bg-[rgb(65,65,137)]" : "bg-[rgb(51,52,55)]"} `}
        >
          <Minus className="icon" strokeWidth={1.25} />
        </div>
        <div
          onClick={() => setSelectedIcon("bold")}
          className={`icon-background ${selectedIcon === "bold" ? "bg-[rgb(65,65,137)]" : "bg-[rgb(51,52,55)]"} `}
        >
          <Minus className="icon"  />
        </div>
        <div
          onClick={() => setSelectedIcon("extra-bold")}
          className={`icon-background ${selectedIcon === "extra-bold" ? "bg-[rgb(65,65,137)]" : "bg-[rgb(51,52,55)]"} `}
        >
          <Minus className="icon"  strokeWidth={3} />
        </div>
      </div>
    </div>
  );
}
