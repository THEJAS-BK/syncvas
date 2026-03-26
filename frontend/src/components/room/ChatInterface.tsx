import ChatBox from "./ChatBox";
import Button from "@mui/material/Button";
import { socket } from "../../services/socket";
import { useEffect, useState } from "react";

export default function ChatInterface() {
  const [message, setMessage] = useState("");
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Connected :", socket.id);
    });

    socket.on("message", (data) => {
      console.log("Message received from backend:", data);
    });

  });
  const handleMesSend = () => {
    socket.emit("message",message);
  };
  return (
    <div className="border flex-1 pb-4 min-h-screen flex flex-col justify-between">
      <div className="bg-blue-200 flex-1 px-2 py-6 flex flex-col">
        <ChatBox />
      </div>
      <div className="px-2 py-4">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder="text something"
        />
        <Button variant="contained" onClick={handleMesSend}>
          Send
        </Button>
      </div>
    </div>
  );
}
