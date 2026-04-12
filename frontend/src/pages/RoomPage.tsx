import ChatInterface from "../components/room/ChatInterface";
import MainContent from "../components/room/MainContent";
import RoomNavbar from "../components/room/RoomNavbar";

export default function RoomPage() {
  return (
    <div className="h-screen flex flex-col">
      <RoomNavbar  />
      <main className="flex-1 flex ">
        <MainContent/>
        <ChatInterface/>
      </main>
    </div>
  );
}
