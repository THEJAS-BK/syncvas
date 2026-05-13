import { useParams } from "react-router-dom";
import ChatInterface from "../components/room/ChatInterface";
import MainContent from "../components/room/MainContent";
import RoomNavbar from "../components/room/RoomNavbar";

export default function RoomPage() {
  const {roomId}=useParams();

  if(!roomId) return <div>Not found</div>

  return (
    <div className="h-screen flex flex-col">
      <RoomNavbar  />
      <main className="flex-1 flex ">
        <MainContent roomId={roomId} />
        <ChatInterface/>
      </main>
    </div>
  );
}
