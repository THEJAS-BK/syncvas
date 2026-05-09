import ChatBox from "./ChatBox";
import Button from "@mui/material/Button";
import { socket } from "../../services/socket";
import { useEffect, useState } from "react";
import type { RecieveMessage } from "../../types/Chat";
import { useParams } from "react-router-dom";

export default function ChatInterface() {
  const [inputText, setInputText] = useState<string>("");
  const [messages,setMessages]= useState<RecieveMessage[]>([])
  const { roomId } = useParams();
useEffect(() => {
  const handleMessage = (data: RecieveMessage) => {
    console.log("received", data);
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

    const printMess=()=>{
      messages.map((data,idx)=>{
        console.log(data.roomId,idx)
      })
      
    }

  useEffect(()=>{
    socket.emit("join-room",roomId)
    if(roomId){
      console.log("user joined room ",roomId)
    }
  },[roomId])

  const handleMesSend = ():void => {
    console.log("sent")
    socket.emit("send-message", roomId,inputText);
    setInputText("")
  };
  return (
    <div className="border flex-1 pb-4 min-h-screen flex flex-col justify-between">
      <div className="bg-blue-200 flex-1 px-2 py-6 flex flex-col">
       {messages.map((data,idx)=>{
         return(
          <ChatBox
          key={idx}
          message={data.data}
          isOwn={data.userId ===socket.id}
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

      <button onClick={printMess}>Print Messages</button>
    </div>
  );
}
