import { ArrowDownToLine, ArrowUpToLine, ArrowDown, ArrowUp } from "lucide-react";
import React, { useState } from "react";

export default function LayerControls() {
  const [active, setActive] = useState("");

  function handleClick(action: string) {
    setActive(action);

    setTimeout(() => {
      setActive("");
    }, 100);
  }

  return (
    <div>
      <span className="mb-2 mt-2 ml-1 text-sm  text-gray-300 ">Layers</span>
      <div className="flex gap-3 mt-2">
        <div
          className={`icon-background ${
            active === "sendBack"
              ? "bg-[rgb(65,65,137)] border border-white"
              : "bg-[rgb(51,52,55)]"
          }`}
          onClick={() => handleClick("sendBack")}
        >
          <ArrowDownToLine className="icon" strokeWidth={3} />
        </div>

        <div
          className={`icon-background ${
            active === "backward"
              ? "bg-[rgb(65,65,137)] border border-white"
              : "bg-[rgb(51,52,55)]"
          }`}
          onClick={() => handleClick("backward")}
        >
         
          <ArrowDown className="icon" strokeWidth={3} />
        </div>

        <div
          className={`icon-background ${
            active === "forward"
              ? "bg-[rgb(65,65,137)] border border-white"
              : "bg-[rgb(51,52,55)]"
          }`}
          onClick={() => handleClick("forward")}
        >
         
          <ArrowUp className="icon" strokeWidth={3} />
        </div>

        <div
          className={`icon-background ${
            active === "bringFront"
              ? "bg-[rgb(65,65,137)] border border-white"
              : "bg-[rgb(51,52,55)]"
          }`}
          onClick={() => handleClick("bringFront")}
        >
          <ArrowUpToLine className="icon" strokeWidth={3} />
        </div>
      </div>
    </div>
  );
}
