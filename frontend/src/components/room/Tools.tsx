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
import { useState } from "react";
import { useToolSettings } from "../../context/ToolBarLeftContext";

interface ToolsProps {
  openCursor: boolean;
  setOpenCursor: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function Tools({ openCursor, setOpenCursor }: ToolsProps) {
  const {
    activeTool,
    setTabSize,
    setActiveTool,
    setToggleVideoTab,
    toggleVideoTab,
  } = useToolSettings();
  const [menuOpen, setMenuOpen] = useState(false);

  const [tab, setTab] = useState("");
  const handleTabClick = (tabName: string) => {
    setTab((prev) => (prev === tabName ? "" : tabName));
  };

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

        <div className="relative">
          <div
            onClick={() => setMenuOpen(!menuOpen)}
            className="tool-btn cursor-pointer"
          >
            <Menu size={18} />
          </div>
          {menuOpen && (
            <div className="absolute top-12 right-0 flex flex-col bg-[#1e1e2e] border border-white/10 rounded-lg shadow-xl min-w-[160px] z-30">
              <button
                className="px-3 py-2 text-sm text-left text-gray-200 hover:bg-white/10 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenCursor(!openCursor);
                  setMenuOpen(false);
                }}
              >
                Video conference
              </button>

              <div className="relative">
                <button
                  className="w-full px-3 py-2 text-sm text-left text-gray-200 hover:bg-white/10 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTabClick("small");
                  }}
                >
                  Video settings
                </button>

                {tab === "small" && (
                  <div className="absolute top-[110%] left-0 ml-1 flex flex-col bg-[#1e1e2e] border border-white/10 rounded-lg shadow-xl min-w-[120px] z-40">
                    <button
                      className="px-3 py-2 text-sm text-left text-gray-200 hover:bg-white/10 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setToggleVideoTab(!toggleVideoTab);
                      }}
                    >
                      close
                    </button>
                    <button
                      className="px-3 py-2 text-sm text-left text-gray-200 hover:bg-white/10 transition-colors"
                      onClick={() => setTabSize("small")}
                    >
                      small
                    </button>
                    <button
                      className="px-3 py-2 text-sm text-left text-gray-200 hover:bg-white/10 transition-colors"
                      onClick={() => setTabSize("normal")}
                    >
                      normal
                    </button>
                    <button
                      className="px-3 py-2 text-sm text-left text-gray-200 hover:bg-white/10 transition-colors"
                      onClick={() => setTabSize("large")}
                    >
                      large
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
