import ChatInterface from "./ChatInterface";
import MainContent from "./MainContent";
import RoomNavbar from "./RoomNavbar";

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
