import {
  MessagesSquare,
  Mic,
  MicOff,
  Presentation,
  SquareArrowRightExit,
  Users,
  Video,
  VideoOff,
} from "lucide-react";
import { useState } from "react";
import ChatInterface from "./ChatInterface";
import { useToolSettings } from "../../context/ToolBarLeftContext";
import ParticipantList from "./ParticipantList";
interface VideoOptionsProp {
  audioToggle: () => void;
  videoToggle: () => void;
  isAudioMuted: boolean;
  isVideoMuted: boolean;
  openCursor: boolean;
  setOpenCursor: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function OptionsFooter({
  audioToggle,
  videoToggle,
  isAudioMuted,
  isVideoMuted,
  openCursor,
  setOpenCursor,
}: VideoOptionsProp) {
  const [tab, setTab] = useState("");
  const { roomId } = useToolSettings();
  const handleTabClick = (tabName: string) => {
    setTab((prev) => (prev === tabName ? "" : tabName));
  };

  return (
    <>
      {openCursor && (
        <div className="flex flex-1 gap-3  rounded-full px-3 py-2">
          <button
            onClick={audioToggle}
            className=" hover:bg-gray-400 text-white p-2 rounded-full"
          >
            {isAudioMuted ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          <button
            onClick={videoToggle}
            className=" hover:bg-gray-400 text-white p-2 rounded-full"
          >
            {isVideoMuted ? <VideoOff size={20} /> : <Video size={20} />}
          </button>
          <button
            onClick={() => setOpenCursor(!openCursor)}
            className=" hover:bg-gray-400 text-white p-2 rounded-full"
          >
            <Presentation size={20} />
          </button>
        </div>
      )}

      {!openCursor && (
        <div className="flex justify-between items-center w-full px-6 bg-zinc-800 ">
          <div className="flex gap-3  rounded-full px-3 py-2">
            <button
              onClick={audioToggle}
              className=" hover:bg-gray-400 text-white p-2 rounded-full"
            >
              {isAudioMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <button
              onClick={videoToggle}
              className=" hover:bg-gray-400 text-white p-2 rounded-full"
            >
              {isVideoMuted ? <VideoOff size={20} /> : <Video size={20} />}
            </button>
          </div>

          <div className="flex gap-3  rounded-full px-3 py-2">
            <button
              onClick={() => setOpenCursor(!openCursor)}
              className=" hover:bg-gray-400 text-white p-2 rounded-full"
            >
              <Presentation size={20} />
            </button>
            <button
              onClick={() => handleTabClick("chat")}
              className="relative hover:bg-gray-400 text-white p-2 rounded-full"
            >
              <MessagesSquare size={20} />
              {tab === "chat" && <ChatInterface roomId={roomId} />}
            </button>

            <button
              onClick={() => handleTabClick("participants")}
              className="relative hover:bg-gray-400 text-white p-2 rounded-full"
            >
              <Users size={20} />
              {tab === "participants" && <ParticipantList roomId={roomId} />}
            </button>
          </div>

          {/* Right group: exit */}
          <div className="flex bg-red-600 rounded-full px-3 py-2">
            <button className="bg-red-500 hover:bg-red-400 text-white p-2 rounded-full">
              <SquareArrowRightExit size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
