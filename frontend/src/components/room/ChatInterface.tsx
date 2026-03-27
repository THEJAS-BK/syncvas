import ChatBox from "./ChatBox";
import Button from "@mui/material/Button";
import { socket } from "../../services/socket";
import { useEffect, useState } from "react";
import type { Message } from "../../types/Chat";
import { useParams } from "react-router-dom";

export default function ChatInterface() {
  const [inputText, setInputText] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const { roomId } = useParams();
  useEffect(() => {
    socket.connect();

    socket.emit("join_room", roomId);

    socket.on("connect", () => {
      console.log("Connected :", socket.id);
    });

    socket.on("receive_message", (data: Message) => {
     setMessages((prev) => [...prev, data]);
    });

     return () => {
    socket.off("receive_message");
    socket.off("connect");
  };
  },[roomId]);
  const handleMesSend = ():void => {
    const newMessage:Message={
      text:inputText,
      sender:socket.id||"unknown"
    }
    socket.emit("send_message", {
      message:newMessage,
      roomId
    });
    setInputText("")
  };
  return (
    <div className="border flex-1 pb-4 min-h-screen flex flex-col justify-between">
      <div className="bg-blue-200 flex-1 px-2 py-6 flex flex-col">
       {messages.map((mes,idx)=>{
         return(
          <ChatBox
          key={idx}
          message={mes}
          isOwn={mes.sender === socket.id}
      />   )
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
    </div>
  );
}
