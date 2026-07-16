import React, { useEffect, useRef, useState } from "react";
import { useToolSettings } from "../../context/ToolBarLeftContext";
import { LayoutGrid, Presentation, Settings } from "lucide-react";
import { Users } from "lucide-react";
interface HamberMenuProps {
  roomId: string;
  openCursor: boolean;
  setOpenCursor: React.Dispatch<React.SetStateAction<boolean>>;
  setIsHambergerMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function HamberMenu({
  roomId,
  openCursor,
  setOpenCursor,
  setIsHambergerMenuOpen,
}: HamberMenuProps) {
  const [followMenuOpen, setFollowMenuOpen] = useState(false);
  const [videoSettingsOpen, setVideoSettingsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const connectedUsers = ["Alice", "Bob", "Charlie"];

  const {
    viewMode,
    setViewMode,
    setTabSize,
    setToggleVideoTab,
    toggleVideoTab,
    setActiveTool
  } = useToolSettings();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Ignore clicks on the trigger — let its own onClick toggle handle it
      if (target.closest("[data-hamburger-trigger]")) {
        return;
      }

      if (menuRef.current && !menuRef.current.contains(target)) {
        setIsHambergerMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsHambergerMenuOpen]);

  return (
    <div
      ref={menuRef}
      className="absolute top-16 left-5 bg-[#1e1e2e] border border-white/10 rounded-lg shadow-xl min-w-[220px] z-20"
    >
      <ul className="py-1">
        {/* Room ID row */}
        <li className="px-4 py-3 flex items-center justify-between ">
          <div>
            <span className="text-xs text-gray-400">Room ID</span>
            <p className="text-sm text-gray-200 font-mono truncate">{roomId}</p>
          </div>
          <button
            title="Switch to video conference"
            className="p-2 rounded-md text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setOpenCursor(!openCursor);
              setIsHambergerMenuOpen(false);
            }}
          >
            <Presentation size={18} />
          </button>
        </li>

        {/* Video settings */}
        <li className="relative border-b border-white/10">
          <button
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-left text-gray-200 hover:bg-white/10 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setVideoSettingsOpen((prev) => !prev);
            }}
          >
         
            Video settings
          </button>

          {videoSettingsOpen && (
            <div className="absolute top-0 left-full ml-1 flex flex-col bg-[#1e1e2e] border border-white/10 rounded-lg shadow-xl min-w-[140px] z-40">
              <button
                className="px-3 py-2 text-sm text-left text-gray-200 hover:bg-white/10 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setToggleVideoTab(!toggleVideoTab);
                }}
              >
                {toggleVideoTab ? "Hide video tab" : "Show video tab"}
              </button>
              <button
                className="px-3 py-2 text-sm text-left text-gray-200 hover:bg-white/10 transition-colors"
                onClick={() => setTabSize("small")}
              >
                Small
              </button>
              <button
                className="px-3 py-2 text-sm text-left text-gray-200 hover:bg-white/10 transition-colors"
                onClick={() => setTabSize("normal")}
              >
                Normal
              </button>
              <button
                className="px-3 py-2 text-sm text-left text-gray-200 hover:bg-white/10 transition-colors"
                onClick={() => setTabSize("large")}
              >
                Large
              </button>
            </div>
          )}
        </li>

        {/* Actions */}
        <li
          className="px-4 py-2 text-sm text-gray-200 hover:bg-white/10 cursor-pointer transition-colors border-b border-white/10"
          onClick={() => { setActiveTool(null); setViewMode(!viewMode); }}
        >
          {viewMode ? "view only mode" : "draw mode"}
        </li>

        {!viewMode && (
          <li className="relative ">
            <div
              className="px-4 py-2 text-sm text-gray-200 hover:bg-white/10 cursor-pointer transition-colors border border-white/10"
              onClick={() => setFollowMenuOpen((prev) => !prev)}
            >
              Follow user camera
            </div>

            {followMenuOpen && (
              <div className="absolute top-0 left-full ml-1 flex flex-col bg-[#1e1e2e] border border-white/10 rounded-lg shadow-xl min-w-[160px] z-40">
                {connectedUsers.map((user) => (
                  <button
                    key={user}
                    className="px-3 py-2 text-sm text-left text-gray-200 hover:bg-white/10 transition-colors"
                    onClick={() => setFollowMenuOpen(false)}
                  >
                    {user}
                  </button>
                ))}
              </div>
            )}
          </li>
        )}
         <li className="px-4 py-2 text-sm text-gray-200 hover:bg-white/10 cursor-pointer transition-colors ">
          Board colors
        </li>

        <li className="px-4 py-2 text-sm text-gray-200 hover:bg-white/10 cursor-pointer transition-colors ">
          My Boards
        </li>
        <li className="px-4 py-2 text-sm text-gray-200 hover:bg-white/10 cursor-pointer transition-colors ">
          Save Board
        </li>
       
        <li className="px-4 py-2 text-sm text-red-400 hover:bg-white/10 cursor-pointer transition-colors">
          Exit room
        </li>
      </ul>
    </div>
  );
}
