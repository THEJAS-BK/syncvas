import { X } from "lucide-react";
import ChatBox from "./ChatBox";
import Button from "@mui/material/Button";
import { socket } from "../../services/socket";
import { useEffect, useState } from "react";
import type { RecieveMessage } from "../../types/Chat";
import { useToolSettings } from "../../context/ToolBarLeftContext";

export default function ChatInterface({ onClose }: { onClose: () => void }) {
  const [inputText, setInputText] = useState<string>("");
  const [messages, setMessages] = useState<RecieveMessage[]>([]);
  const { roomId } = useToolSettings();

  useEffect(() => {
    if (!roomId) return;

    socket.emit("initial-state", roomId);

    const handleMessage = (data: RecieveMessage) => {
      setMessages((prev) => [...prev, data]);
    };
    const handleInitialState = (history: RecieveMessage[]) => {
      setMessages(history);
    };

    socket.on("receive-message", handleMessage);
    socket.on("initial-state", handleInitialState);

    return () => {
      socket.off("receive-message", handleMessage);
      socket.off("initial-state", handleInitialState);
    };
  }, [roomId]);

  const handleMesSend = (): void => {
    if (!inputText.trim()) return;
    socket.emit("send-message", roomId, inputText);
    setInputText("");
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute bottom-full left-0 mb-2 flex flex-col justify-between h-[500px] w-[320px] bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl overflow-hidden"
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-700">
        <span className="text-sm font-medium text-white">Chat</span>
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-white p-1 rounded-full hover:bg-zinc-800"
        >
          <X size={16} />
        </button>
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
          sx={{
            backgroundColor: "#2563eb",
            "&:hover": { backgroundColor: "#1d4ed8" },
          }}
        >
          Send
        </Button>
      </div>
    </div>
  );
}