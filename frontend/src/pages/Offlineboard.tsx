import { useState } from "react";
import { Menu, TableOfContents } from "lucide-react";
import { ToolSettingsProvider } from "../context/ToolBarLeftContext.tsx";
import OfflineMultiCursor from "../components/home/OfflineMulticursor.tsx";
import OfflineTools from "../components/home/OfflineTools.tsx";
import ToolBarContainer from "../components/room/LeftToolBar/ToolBarContainer.tsx";
import OfflineHamberMenu from "../components/home/OfflineHamberMenu.tsx";

export default function Offlineboard() {
  const [isHambergerMenuOpen, setIsHambergerMenuOpen] = useState(false);

  return (
    <main className="flex-1 flex static">
      <button
        onClick={() => setIsHambergerMenuOpen(!isHambergerMenuOpen)}
        className="absolute text-white z-20 left-5 top-5 border border-white rounded"
      >
        <TableOfContents />
      </button>

      <button
        onClick={() => setIsHambergerMenuOpen(!isHambergerMenuOpen)}
        className="absolute text-white z-20 left-5 top-5  bg-slate-800 p-2 rounded"
      >
        <Menu />
      </button>

      {isHambergerMenuOpen && <OfflineHamberMenu />}

      <ToolSettingsProvider>
        <ToolBarContainer />
        <div className="absolute top-10 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black border-2 border-grayscale-25 rounded text-white shadow-lg z-20 p-2">
          <OfflineTools />
        </div>
        <OfflineMultiCursor />
      </ToolSettingsProvider>
    </main>
  );
}
