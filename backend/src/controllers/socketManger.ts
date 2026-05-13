import jwt from "jsonwebtoken";
import { Server } from "socket.io";

let activeRooms: Record<string, Set<string>> = {};

const setSocketConnection = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.accesstoken;
    if (!token) {
      return next(new Error("NO token provided"));
    }
    try {
      const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as any;
      socket.data.userId = decode.userId;
      socket.data.name = decode.name;
      console.log("User connected:", socket.data.name);
      next();
    } catch (error) {
      return next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log("user joined    ", socket.id);
    //creating the rooms
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
      socket.emit("existing-peers",[...activeRooms[roomId]]);
      socket.data.roomId = roomId;
      activeRooms[roomId].add(socket.id);
      socket.to(roomId).emit("joined-user", {
        userId: socket.data.userId,
        name: socket.data.name,
        roomId,
        timeStamp: Date.now(),
        socketId:socket.id
      });
      callback?.({ success: true });
    });

    //send message
    socket.on("send-message", (roomId: string, data: string) => {
      io.to(roomId).emit("receive-message", {
        roomId: roomId,
        userId: socket.data.userId,
        name: socket.data.name,
        data,
        sentAt: Date.now(),
        socketId:socket.id
      });
    });
    //!webrtc features
    socket.on("offer", ({ to, offer }) => {
      io.to(to).emit("receive-offer", { from: socket.id, offer });
    });

    socket.on("answer", ({ to, answer }) => {
      io.to(to).emit("receive-answer", { from: socket.id, answer });
    });

    socket.on("ice-candidates", ({ to, candidates }) => {
      io.to(to).emit("receive-ice-candidates", { from: socket.id, candidates });
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
  });

  return io;
};

export { setSocketConnection };
