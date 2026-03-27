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

    //join room
    socket.on("join_room", (roomId: string) => {
      socket.join(roomId);
    });
    //leave
    socket.on("leave_room", (roomId: string) => {
      socket.leave(roomId);
    });

    socket.on("send_message", ({ message, roomId }) => {
      io.to(roomId).emit("receive_message", message);
    });
  });

  return io;
};

export { setSocketConnection };
