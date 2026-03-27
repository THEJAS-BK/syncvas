
import { Server } from "socket.io";
import { Message } from "../types/chat";

const setSocketConnection = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.ORIGIN,
      credentials: true,
    },
  });
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    

    socket.on("send_message", (data: Message) => {
      socket.broadcast.emit("receive_message", data);
    });

  });

  return io;
};

export { setSocketConnection };
