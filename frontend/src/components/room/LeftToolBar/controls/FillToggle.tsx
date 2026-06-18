import { Square, SquareDashedKanban, SquareMenu } from "lucide-react";
import React, { useState } from "react";

export default function FillToggle() {
  const [selectedIcon, setSelectedIcon] = useState<string>("hachure");
  return (
    <div>
      <p className="mb-2 mt-2 ml-1 text-sm font-medium text-gray-300 ">Fill</p>
      <div className="flex gap-2">
        <div
          onClick={() => setSelectedIcon("hachure")}
          className={`icon-background ${selectedIcon === "hachure" ? "bg-[rgb(65,65,137)]" : "bg-[rgb(51,52,55)]"} `}
        >
          <Square className="icon" />
        </div>
        <div
          onClick={() => setSelectedIcon("cross-hatch")}
          className={`icon-background ${selectedIcon === "cross-hatch" ? "bg-[rgb(65,65,137)]" : "bg-[rgb(51,52,55)]"}`}
        >
          <SquareMenu className="icon" />
        </div>
        <div
          onClick={() => setSelectedIcon("solid")}
          className={`icon-background ${selectedIcon === "solid" ? "bg-[rgb(65,65,137)]" : "bg-[rgb(51,52,55)]"} `}
        >
          <SquareDashedKanban className="icon" />
        </div>
      </div>
    </div>
  );
}
