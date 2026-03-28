import { Server } from "socket.io";
import { generateRoomCode } from "../utils/helper";
const rooms:Record<string,any>={};

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
    //create room
    socket.on("create_room", (callback: (roomId: string) => void) => {
      const roomId = generateRoomCode();
  
      callback(roomId);
    });


    socket.on("send_message", ({ message, roomId }) => {
      io.to(roomId).emit("receive_message", message);
    });
  });

  return io;
};

export { setSocketConnection };
