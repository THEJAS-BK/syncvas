import { useParams } from "react-router-dom";
import ChatInterface from "../components/room/ChatInterface";
import MainContent from "../components/room/MainContent";
import RoomNavbar from "../components/room/RoomNavbar";
import { useEffect, useState } from "react";

export default function RoomPage() {
  const {roomId}=useParams();

  const [openCursor, setOpenCursor] = useState(false);

  useEffect(()=>{
    console.log(openCursor);
    
  },[openCursor])

  if(!roomId) return <div>Not found</div>

  return (
    <div className="h-screen flex flex-col">
      <RoomNavbar setCursorDash={setOpenCursor} cursorDash={openCursor}  />
      <main className="flex-1 flex ">
        <MainContent roomId={roomId} />
        <ChatInterface cursorDash={openCursor} /> /!send to chatinterface local streams 
      </main>
    </div>
  );
}
