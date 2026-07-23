import { Server, Socket } from "socket.io";

export function registerFollowUserCamera(socket: Socket, io: Server) {
  socket.on(
    "camera-update",
    (camera: { x: number; y: number; scale: number }, roomId: string) => {
      socket.to(roomId).emit("camera-update", {
        socketId: socket.id,
        camera,
      });
    },
  );
}
