import { Server, Socket } from "socket.io";

export function registerRoomHandler(
  socket: Socket,
  io: Server,
  activeRooms: Record<string, Set<string>>,
) {
  socket.on("create-room", (roomId, callback) => {
    if (activeRooms[roomId]) {
      callback?.({ success: false, message: "Room already exist" });
      return;
    }
    socket.data.roomId = roomId;
    activeRooms[roomId] = new Set();
    activeRooms[roomId].add(socket.id);
    socket.join(roomId);
    callback?.({ success: true });
  });

  //join rooms logic
  socket.on("join-room", (roomId: string, callback) => {
    if (!activeRooms[roomId]) {
      callback?.({ success: false, message: "Room dosent exist" });
      return;
    }
    socket.join(roomId);
    socket.emit(
      "existing-peers",
      [...activeRooms[roomId]].filter((id) => id !== socket.id),
    );
    socket.data.roomId = roomId;
    activeRooms[roomId].add(socket.id);
    socket.to(roomId).emit("joined-user", {
      userId: socket.data.userId,
      name: socket.data.name,
      roomId,
      timeStamp: Date.now(),
      socketId: socket.id,
    });
    callback?.({ success: true });
  });

  //get username and userId
  socket.on("my-info", (callback) => {
    callback({
      userId: socket.data.userId,
      name: socket.data.name,
    });
  });

  socket.on("disconnect", () => {
    const roomId = socket.data.roomId;
    if (!roomId || !activeRooms[roomId]) {
      console.log("roomId not found in sockets");
      return;
    }
    activeRooms[roomId].delete(socket.id);
    socket.to(roomId).emit("user-left", socket.id);
    if (activeRooms[roomId].size === 0) {
      delete activeRooms[roomId];
    }
  });
 socket.on("get-participants", (roomId: string) => {
  const memberIds = activeRooms[roomId] ?? new Set<string>();
  const names = [...memberIds].map((id) => {
    const memberSocket = io.sockets.sockets.get(id);
    return memberSocket?.data.name ?? "Unknown";
  });
  socket.emit("participants-list", names);
});
}
