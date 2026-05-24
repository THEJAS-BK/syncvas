import { useParams } from "react-router-dom";
import ChatInterface from "../components/room/ChatInterface";
import MainContent from "../components/room/MainContent";
import RoomNavbar from "../components/room/RoomNavbar";
import { useState } from "react";
import { WebRtcProvider } from "../context/WebRtcContext";
import MultiCursor from "../components/room/MultiCursor";

export default function RoomPage() {
  const {roomId}=useParams();
  const [openCursor, setOpenCursor] = useState(false);
  if(!roomId) return <div>Not found</div>

  return (
   <WebRtcProvider roomId={roomId}>
     <div className="h-screen flex flex-col">
      <RoomNavbar setCursorDash={setOpenCursor} cursorDash={openCursor}  />
      <main className="flex-1 flex ">
        {/* cursor interface not open*/}
       {!openCursor&&(
         <MainContent roomId={roomId} />
       )}
        {openCursor&&(
          <MultiCursor/>
        )}

        <ChatInterface cursorDash={openCursor} roomId={roomId} /> 
      </main>
    </div>
   </WebRtcProvider>
  );
}
