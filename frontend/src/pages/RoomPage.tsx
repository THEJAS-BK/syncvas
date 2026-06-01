import { useParams } from "react-router-dom";
import ChatInterface from "../components/room/ChatInterface";
import MainContent from "../components/room/MainContent";
import RoomNavbar from "../components/room/RoomNavbar";
import { useRef, useState } from "react";
import { WebRtcProvider } from "../context/WebRtcContext";
import MultiCursor from "../components/room/Multicursor/MultiCursor";

type BoardImage = {
  id: string;   // add this
  image: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export default function RoomPage() {
  const { roomId } = useParams();
  const [openCursor, setOpenCursor] = useState(false);
  const [floatChatInterface, setFloatChatInterface] = useState(false);
  const images = useRef<BoardImage[]>([]);
  //redraw 
  const [redrawVersion, setRedrawVersion] = useState(0);

  if (!roomId) return <div>Not found</div>;

  return (
    <WebRtcProvider roomId={roomId}>
      <div className="h-screen flex flex-col">
        <RoomNavbar
          floatChatInterface={floatChatInterface}
          setFloatChatInterface={setFloatChatInterface}
          setCursorDash={setOpenCursor}
          cursorDash={openCursor}
          images={images}
          setRedrawVersion={setRedrawVersion}
        />
        <main className="flex-1 flex ">
          {/* cursor interface not open*/}
          {!openCursor && (
            <MainContent
              floatChatInterface={floatChatInterface}
              roomId={roomId}
            />
          )}
          {openCursor && (
            <MultiCursor imageUpdate={redrawVersion} images={images} floatChatInterface={floatChatInterface} />
          )}
          <ChatInterface
            floatChatInterface={floatChatInterface}
            cursorDash={openCursor}
            roomId={roomId}
          />
        </main>
      </div>
    </WebRtcProvider>
  );
}
