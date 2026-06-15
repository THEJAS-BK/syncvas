import { useParams } from "react-router-dom";
import ChatInterface from "../components/room/ChatInterface";
import MainContent from "../components/room/MainContent";
import RoomNavbar from "../components/room/RoomNavbar";
import { useEffect, useRef, useState } from "react";
import { WebRtcProvider } from "../context/WebRtcContext";
import MultiCursor from "../components/room/Multicursor/MultiCursor";

//lucide react components
import { Pencil, TableOfContents, TypeOutline } from "lucide-react";
import { Image, Eraser, MousePointer, Hand } from "lucide-react";
import { socket } from "../services/socket";

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result as string;
      const id = crypto.randomUUID();

      const imageData = {
        id,
        image: base64,
        x: 100,
        y: 100,
        width: 400,
        height: 300,
        rotation: 0,
      };

      images.current?.push(imageData);
      setRedrawVersion((v) => v + 1);

      socket.emit("image-upload", { roomId, ...imageData });
    };

    reader.readAsDataURL(file);
  };
  return (
    <>
      {/*image upload*/}
      <input
        type="file"
        id="image-upload"
        className="hidden"
        accept="image/*"
        onChange={handleImageUpload}
      />

      <WebRtcProvider roomId={roomId}>
        <div className="h-screen flex flex-col">
          {!openCursor && <RoomNavbar />}
          <main className="flex-1 flex static">
            {openCursor && (
              <button
                onClick={() => setIsHambergerMenuOpen(!isHambergerMenuOpen)}
                className="absolute text-white z-20"
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
            <div className="absolute top-10 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white shadow-lg z-20">
              <div className="flex gap-4 shadow-lg">
                <span>
                  <MousePointer />
                </span>
                <span>
                  <Pencil />
                </span>
                <span>
                  <TypeOutline />
                </span>
                <span>
                  <Hand />
                </span>
                <span>
                  <Eraser />
                </span>
                <span>
                  <label htmlFor="image-upload">
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
