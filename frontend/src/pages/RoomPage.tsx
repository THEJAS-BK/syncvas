import { useParams } from "react-router-dom";
import ChatInterface from "../components/room/ChatInterface";
import MainContent from "../components/room/MainContent";
import RoomNavbar from "../components/room/RoomNavbar";
import { useEffect, useRef, useState } from "react";
import { WebRtcProvider } from "../context/WebRtcContext";
import { ToolSettingsProvider } from "../context/ToolBarLeftContext.tsx";
import MultiCursor from "../components/room/Multicursor/MultiCursor";

//image upload function
import { handleImageUpload } from "../components/room/Multicursor/tools/imageUpload.ts";

import { Menu, TableOfContents } from "lucide-react";

import Tools from "../components/room/Tools.tsx";
import ToolBarContainer from "../components/room/LeftToolBar/ToolBarContainer.tsx";
import HamberMenu from "../components/room/HamberMenu.tsx";
import type { FaLessThanEqual } from "react-icons/fa";

type BoardImage = {
  id: string;
  image: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number | 0;
};

export default function RoomPage() {
  const { roomId } = useParams();
  const [openCursor, setOpenCursor] = useState(false);
  const images = useRef<BoardImage[]>([]);

  //redraw
  const [redrawVersion, setRedrawVersion] = useState(0);

  if (!roomId) return <div>Not found</div>;

  //hambergerMenu
  const [isHambergerMenuOpen, setIsHambergerMenuOpen] = useState(false);
  return (
    <>
      {/*image upload*/}
      <input
        type="file"
        id="image-upload"
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          handleImageUpload(e, images, setRedrawVersion, roomId);
        }}
      />

      <WebRtcProvider roomId={roomId}>
        <ToolSettingsProvider>
          <div className="h-screen flex flex-col overflow-hidden">
            <main className="flex-1 flex static">
              {openCursor && (
                <>
                  <button
                    onClick={() => setIsHambergerMenuOpen(!isHambergerMenuOpen)}
                    className="absolute text-white z-20 left-5 top-5  bg-slate-800 p-2 rounded"
                  >
                    <Menu />
                  </button>
                  <ToolBarContainer />
                </>
              )}

              {isHambergerMenuOpen && <HamberMenu roomId={roomId} />}
              {/*center tools menu*/}
                {openCursor && (
              <div className="absolute top-10 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black border-2 border-grayscale-25 rounded text-white shadow-lg z-20 p-2">

                  <Tools
                    openCursor={openCursor}
                    setOpenCursor={setOpenCursor}
                  />
              </div>
                )}

              {/* cursor interface not open*/}
              {!openCursor && (
                <>
                  <MainContent
                    roomId={roomId}
                    openCursor={openCursor}
                    setOpenCursor={setOpenCursor}
                  />
                </>
              )}

              {openCursor && (
                <MultiCursor
                  roomId={roomId}
                  imageUpdate={redrawVersion}
                  images={images}
                  openCursor={openCursor}
                  setOpenCursor={setOpenCursor}
                />
              )}
            </main>
          </div>
        </ToolSettingsProvider>
      </WebRtcProvider>
    </>
  );
}
