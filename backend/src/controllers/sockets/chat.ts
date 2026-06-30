import { Server, Socket } from "socket.io";

export function registerChatInterfaceHandler(socket: Socket, io: Server) {
  socket.on("send-message", (roomId: string, data: string) => {
    io.to(roomId).emit("receive-message", {
      roomId: roomId,
      userId: socket.data.userId,
      name: socket.data.name,
      data,
      sentAt: Date.now(),
      socketId: socket.id,
    });
  });
}
