import React, { useEffect, useState } from "react";
import { useToolSettings } from "../../context/ToolBarLeftContext";
import {Menu} from "lucide-react"
interface HamberMenuProps {
  roomId: string;
  openCursor:boolean;
  setOpenCursor:React.Dispatch<React.SetStateAction<boolean>>
}

export default function HamberMenu({ roomId,openCursor,setOpenCursor }: HamberMenuProps) {
  const [followMenuOpen, setFollowMenuOpen] = useState(false);

  const connectedUsers = ["Alice", "Bob", "Charlie"];

  const { viewMode, setViewMode } = useToolSettings();

   const {
    setTabSize,
    setToggleVideoTab,
    toggleVideoTab,
  } = useToolSettings();
  const [menuOpen, setMenuOpen] = useState(false);



  const [tab, setTab] = useState("");
  const handleTabClick = (tabName: string) => {
    setTab((prev) => (prev === tabName ? "" : tabName));
  };


  return (
    <div className="absolute top-16 left-5 bg-[#1e1e2e] border border-white/10 rounded-lg shadow-xl overflow-hidden min-w-[220px] z-20">
      {/* Room ID */}
      <div className="px-4 py-3 border-b border-white/10">
        <span className="text-xs text-gray-400">Room ID</span>
        <p className="text-sm text-gray-200 font-mono truncate">{roomId}</p>
      </div>
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

      {/* Actions */}
      <ul className="py-1">
       

        <li
          className="px-4 py-2 text-sm text-gray-200 hover:bg-white/10 cursor-pointer transition-colors"
          onClick={() => setViewMode(!viewMode)}
        >
          {viewMode ? " View only" : " Edit mode"}
        </li>

        {!viewMode && (
          <li className="relative">
            <div
              className="px-4 py-2 text-sm text-gray-200 hover:bg-white/10 cursor-pointer transition-colors"
              onClick={() => setFollowMenuOpen(!followMenuOpen)}
            >
              Follow user camera
            </div>

            {followMenuOpen && (
              <div className="absolute top-0 left-full ml-1 flex flex-col bg-[#1e1e2e] border border-white/10 rounded-lg shadow-xl min-w-[160px] z-40">
                {connectedUsers.map((user) => (
                  <button
                    key={user}
                    className="px-3 py-2 text-sm text-left text-gray-200 hover:bg-white/10 transition-colors"
                    onClick={() => {
                      setFollowMenuOpen(false);
                    }}
                  >
                    {user}
                  </button>
                ))}
              </div>
            )}
          </li>
        )}
         <li className="px-4 py-2 text-sm text-gray-200 hover:bg-white/10 cursor-pointer transition-colors">
          My Boards
        </li>
        <li className="px-4 py-2 text-sm text-gray-200 hover:bg-white/10 cursor-pointer transition-colors">
          Save Board
        </li>
        <li className="px-4 py-2 text-sm text-red-400 hover:bg-white/10 cursor-pointer transition-colors">
          Exit
        </li>
      </ul>
    </div>
  );
}
