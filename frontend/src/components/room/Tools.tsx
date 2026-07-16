//lucide react components
import {
  Circle,
  Diamond,
  Menu,
  Minus,
  MoveRight,
  Pencil,
  Square,
  TypeOutline,
} from "lucide-react";
import { Image, Eraser, MousePointer, Hand } from "lucide-react";
import { useEffect, useState } from "react";
import { useToolSettings } from "../../context/ToolBarLeftContext";

export default function Tools() {
  const {
    activeTool,
    setActiveTool,
  } = useToolSettings();


  return (
    <>
      <div className="flex items-center gap-1">
        <button
          onClick={() => setActiveTool("mouse")}
          className={activeTool === "mouse" ? "tool-btn-active" : "tool-btn"}
        >
          <MousePointer size={18} />
        </button>
        <button
          onClick={() => setActiveTool("pen")}
          className={activeTool === "pen" ? "tool-btn-active" : "tool-btn"}
        >
          <Pencil size={18} />
        </button>
        <button
          onClick={() => setActiveTool("text")}
          className={activeTool === "text" ? "tool-btn-active" : "tool-btn"}
        >
          <TypeOutline size={18} />
        </button>
        <button
          onClick={() => setActiveTool("hand")}
          className={activeTool === "hand" ? "tool-btn-active" : "tool-btn"}
        >
          <Hand size={18} />
        </button>
        <button
          onClick={() => {
            setActiveTool("eraser");
          }}
          className={activeTool === "eraser" ? "tool-btn-active" : "tool-btn"}
        >
          <Eraser size={18} />
        </button>

        <button
          className={activeTool === "arrow" ? "tool-btn-active" : "tool-btn"}
          onClick={() => setActiveTool("arrow")}
        >
          <MoveRight size={18} />
        </button>
        <button
          className={activeTool === "line" ? "tool-btn-active" : "tool-btn"}
          onClick={() => setActiveTool("line")}
        >
          <Minus size={18} />
        </button>
        <button
          className={activeTool === "square" ? "tool-btn-active" : "tool-btn"}
          onClick={() => setActiveTool("square")}
        >
          <Square size={18} />
        </button>
        <button
          className={activeTool === "diamond" ? "tool-btn-active" : "tool-btn"}
          onClick={() => setActiveTool("diamond")}
        >
          <Diamond size={18} />
        </button>
        <button
          className={activeTool === "circle" ? "tool-btn-active" : "tool-btn"}
          onClick={() => setActiveTool("circle")}
        >
          <Circle size={18} />
        </button>

        <button className="tool-btn">
          <label
            htmlFor="image-upload"
            className="flex items-center justify-center cursor-pointer"
          >
            <Image size={18} />
          </label>
        </button>

      
      </div>
    </>
  );
}
