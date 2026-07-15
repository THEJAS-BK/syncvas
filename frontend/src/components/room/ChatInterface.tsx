import ChatBox from "./ChatBox";
import Button from "@mui/material/Button";
import { socket } from "../../services/socket";
import { useEffect, useState } from "react";
import type { RecieveMessage } from "../../types/Chat";

export default function ChatInterface({
  roomId,
}: {
  roomId: string|null;
}) {
  const [inputText, setInputText] = useState<string>("");
  const [messages, setMessages] = useState<RecieveMessage[]>([]);


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
 <div className="absolute bottom-full left-0 mb-2 flex flex-col justify-between h-[500px] w-[320px] bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl overflow-hidden">
  <div className="px-3 py-2 border-b border-zinc-700 text-sm font-medium text-white">
    Chat
  </div>

  <div className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-2 bg-zinc-900">
    {messages.map((data, idx) => (
      <ChatBox
        key={idx}
        message={data.data}
        isOwn={data.socketId === socket.id}
      />
    ))}
  </div>

  <div className="flex items-center gap-2 px-3 py-3 border-t border-zinc-700 bg-zinc-800">
    <input
      value={inputText}
      onChange={(e) => setInputText(e.target.value)}
      type="text"
      placeholder="Type a message..."
      onKeyDown={(e) => e.key === "Enter" && handleMesSend()}
      className="flex-1 bg-zinc-700 text-white placeholder-zinc-400 text-sm rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
    />
    <Button
      variant="contained"
      onClick={handleMesSend}
      sx={{ backgroundColor: "#2563eb", "&:hover": { backgroundColor: "#1d4ed8" } }}
    >
      Send
    </Button>
  </div>
</div>
  );
}
