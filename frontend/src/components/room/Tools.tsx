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
import { useState,  } from "react";
import { useToolSettings } from "../../context/ToolBarLeftContext";

interface ToolsProps {
  openCursor: boolean;
  setOpenCursor: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function Tools({
  openCursor,
  setOpenCursor,
}: ToolsProps) {
  const { activeTool, setActiveTool,setToggleVideoTab,toggleVideoTab } = useToolSettings();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="flex gap-4 shadow-lg">
        <button
          onClick={() => setActiveTool("mouse")}
          className={activeTool === "mouse" ? "tool-btn-active" : "tool-btn"}
        >
          <MousePointer />
        </button>
        <button
          onClick={() => setActiveTool("pen")}
          className={activeTool === "pen" ? "tool-btn-active" : "tool-btn "}
        >
          <Pencil />
        </button>
        <button
          onClick={() => setActiveTool("text")}
          className={activeTool === "text" ? "tool-btn-active" : "tool-btn"}
        >
          <TypeOutline />
        </button>
        <button
          onClick={() => setActiveTool("hand")}
          className={activeTool === "hand" ? "tool-btn-active" : "tool-btn"}
        >
          <Hand />
        </button>
        <button
          onClick={() => {
            setActiveTool("eraser");
          }}
          className={activeTool === "eraser" ? "tool-btn-active" : "tool-btn"}
        >
          <Eraser />
        </button>

        <button>
          <MoveRight
            onClick={() => setActiveTool("arrow")}
            className={activeTool === "arrow" ? "tool-btn-active" : "tool-btn"}
          />
        </button>
        <button>
          <Minus
            onClick={() => setActiveTool("line")}
            className={activeTool === "line" ? "tool-btn-active" : "tool-btn"}
          />
        </button>
        <button>
          <Square
            onClick={() => setActiveTool("square")}
            className={activeTool === "square" ? "tool-btn-active" : "tool-btn"}
          />
        </button>
        <button>
          <Diamond
            onClick={() => setActiveTool("diamond")}
            className={
              activeTool === "diamond" ? "tool-btn-active" : "tool-btn"
            }
          />
        </button>
        <button>
          <Circle
            onClick={() => setActiveTool("circle")}
            className={activeTool === "circle" ? "tool-btn-active" : "tool-btn"}
          />
        </button>

        <button className="hover:bg-gray-500">
          <label htmlFor="image-upload" className="hover:bg-gray-200">
            <Image />
          </label>
        </button>
        <div onClick={() => setMenuOpen(!menuOpen)}>
          <Menu />
          {menuOpen && (
            <div className="absolute top-12 right-0 flex flex-col bg-black border border-white overflow-hidden">
              <button className="p-1 border border-white" onClick={(e) => {
                e.stopPropagation();
                setOpenCursor(!openCursor);
                setMenuOpen(false)
              }}>
                video conference
              </button>
              <button
              className="p-1 border border-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setToggleVideoTab(!toggleVideoTab);
                }}
              >
                close camera
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
