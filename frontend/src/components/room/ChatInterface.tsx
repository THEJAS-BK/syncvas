import ChatBox from "./ChatBox";
import Button from "@mui/material/Button";
import { socket } from "../../services/socket";
import { useEffect, useState } from "react";
import type { RecieveMessage } from "../../types/Chat";
import VideoTab from "../room/VideoTab";
import { useWebRtcContext } from "../../context/WebRtcContext";
import VideoOptions from "./VideoOptions";

export default function ChatInterface({
  roomId,
  cursorDash,
  floatChatInterface,
}: {
  cursorDash: boolean;
  roomId: string;
  floatChatInterface: boolean;
}) {
  const [inputText, setInputText] = useState<string>("");
  const [messages, setMessages] = useState<RecieveMessage[]>([]);

  const {
    localStream,
    remoteStreams,
    isReady,
    isVideoMuted,
    isAudioMuted,
    audioToggle,
    videoToggle,
  } = useWebRtcContext();

  useEffect(() => {
    const handleMessage = (data: RecieveMessage) => {
      setMessages((prev) => [...prev, data]);
    };
    socket.on("connect", () => console.log("Connected:", socket.id));
    socket.on("receive-message", handleMessage);
    socket.connect();

    return () => {
      socket.off("connect");
      socket.off("receive-message", handleMessage);
    };
  }, []);

  useEffect(() => {
    socket.emit("join-room", roomId);
    if (roomId) {
      console.log("user joined room ", roomId);
    }
  }, [roomId]);

  const handleMesSend = (): void => {
    socket.emit("send-message", roomId, inputText);
    setInputText("");
  };
  return (
    <div
      className={`border flex-1 pb-4  flex flex-col justify-between ${floatChatInterface ? "absolute right-0 w-[30%] h-[50%] " : "min-h-screen"}`}
    >
      {!cursorDash && (
        <>
          <div className="bg-blue-200 flex-1 px-2 py-6 flex flex-col">
            {messages.map((data, idx) => {
              return (
                <ChatBox
                  key={idx}
                  message={data.data}
                  isOwn={data.socketId === socket.id}
                />
              );
            })}
          </div>
          <div className="px-2 py-4">
            <input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              type="text"
              placeholder="text something"
            />
            <Button variant="contained" onClick={handleMesSend}>
              Send
            </Button>
          </div>
        </>
      )}

      {/* Open cursor */}
      {cursorDash && (
        <>
          <VideoTab
            roomId={roomId}
            localStream={localStream}
            remoteStreams={remoteStreams}
            isReady={isReady}
            isVideoMuted={isVideoMuted}
            isCursorOpen={true}
          />
        </>
      )}
    </div>
  );
}
