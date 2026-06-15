import { useParams } from "react-router-dom";
import ChatInterface from "../components/room/ChatInterface";
import MainContent from "../components/room/MainContent";
import RoomNavbar from "../components/room/RoomNavbar";
import { useEffect, useRef, useState } from "react";
import { WebRtcProvider } from "../context/WebRtcContext";
import MultiCursor from "../components/room/Multicursor/MultiCursor";

//image upload function
import {handleImageUpload} from "../components/room/Multicursor/tools/imageUpload.ts"

//lucide react components
import { Pencil, TableOfContents, TypeOutline } from "lucide-react";
import { Image, Eraser, MousePointer, Hand } from "lucide-react";

type BoardImage = {
  id: string; // add this
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
  const [floatChatInterface, setFloatChatInterface] = useState(false);
  const images = useRef<BoardImage[]>([]);
  const [eraserMode, setEraserMode] = useState(false);
  const eraserRef = useRef(false);
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
        onChange={()=>{
          handleImageUpload(e,images,setRedrawVersion,roomId)
        }}
      />

      <WebRtcProvider roomId={roomId}>
        <div className="h-screen flex flex-col">
          {!openCursor && <RoomNavbar />}
          <main className="flex-1 flex static">
            {openCursor && (
              <button
                onClick={() => setIsHambergerMenuOpen(!isHambergerMenuOpen)}
                className="absolute text-white z-20 left-5 top-5 border border-white rounded"
              >
                <TableOfContents />
              </button>
            )}

            {isHambergerMenuOpen && (
              <div className="absolute top-16 left-0 bg-white shadow-lg z-20">
                <ul className="py-2">
                  <li className="px-4 py-2 hover:bg-gray-200">Option 1</li>
                  <li className="px-4 py-2 hover:bg-gray-200">Option 2</li>
                  <li className="px-4 py-2 hover:bg-gray-200">Option 3</li>
                </ul>
              </div>
            )}
            {/*center tools menu*/}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black border-2 border-grayscale-25 rounded text-white shadow-lg z-20 p-2">
              <div className="flex gap-4 shadow-lg">
                <span className="hover:bg-gray-500">
                  <MousePointer />
                </span>
                <span className="hover:bg-gray-500">  
                  <Pencil />
                </span>
                <span className="hover:bg-gray-500">
                  <TypeOutline />
                </span>
                <span className="hover:bg-gray-500">
                  <Hand />
                </span>
                <button onClick={()=>{
                  setEraserMode(!eraserMode)
                  eraserRef.current=!eraserRef.current
                }} className="hover:bg-gray-500">
                  <Eraser />
                </button>
                <span className="hover:bg-gray-500">
                  <label htmlFor="image-upload" className="hover:bg-gray-200">
                    <Image />
                  </label>
                </span>
                <button onClick={() => setOpenCursor(!openCursor)}>
                  VideoConf
                </button>
                <button
                  onClick={() => setFloatChatInterface(!floatChatInterface)}
                >
                  Float
                </button>
              </div>
            </div>
            {/* cursor interface not open*/}
            {!openCursor && (
              <MainContent
                floatChatInterface={floatChatInterface}
                roomId={roomId}
              />
            )}
            {openCursor && (
              <MultiCursor
                imageUpdate={redrawVersion}
                eraserRef={eraserRef}
                images={images}
                floatChatInterface={floatChatInterface}
              />
            )}
            <ChatInterface
              floatChatInterface={floatChatInterface}
              cursorDash={openCursor}
              roomId={roomId}
            />
          </main>
        </div>
      </WebRtcProvider>
    </>
  );
}
