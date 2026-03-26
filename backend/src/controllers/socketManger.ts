
import { Server } from "socket.io";


const setSocketConnection = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.ORIGIN,
      credentials: true,
    },
  });
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    

    socket.on("message", (data) => {
      socket.broadcast.emit("message", data);
    });

  });

  return io;
};

export { setSocketConnection };
