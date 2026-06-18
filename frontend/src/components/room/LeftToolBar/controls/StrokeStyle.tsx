import React, { useState } from "react";
import { Ellipsis, GripHorizontal, Minus } from "lucide-react";
export default function StrokeStyle() {
    const [selectedIcon,setSelectedIcon]=useState<string>("solid")

  return (
    <div>
      <span className="mb-2 text-sm font-medium text-gray-300 ">Stroke style</span>
      <div className="flex space-x-2">
        <div
          onClick={() => setSelectedIcon("solid")}
          className={`icon-background ${selectedIcon === "solid" ? "bg-[rgb(65,65,137)]" : "bg-[rgb(51,52,55)]"} `}
        >
          <Minus strokeWidth={3} />
        </div>
        <div
          onClick={() => setSelectedIcon("dashed")}
          className={`icon-background ${selectedIcon === "dashed" ? "bg-[rgb(65,65,137)]" : "bg-[rgb(51,52,55)]"} `}
        >
          <Ellipsis strokeWidth={3} />
        </div>
        <div
          onClick={() => setSelectedIcon("dotted")}
          className={`icon-background ${selectedIcon === "dotted" ? "bg-[rgb(65,65,137)]" : "bg-[rgb(51,52,55)]"} `}
        >
          <GripHorizontal strokeWidth={3} />
        </div>
      </div>
    </div>
  );
}
