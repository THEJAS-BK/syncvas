import jwt from "jsonwebtoken";
import { Server } from "socket.io";

let activeRooms: Record<string, Set<string>> = {};

type Stroke = {
  userId: string;
  color: string;
  width:number;
  opacity:number;
  points: { x: number; y: number }[];
};

type ImageElement = {
  id: string;
  image: string;
  userId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number | 0;
};

type CanvasElement =
  | {
      id: string;
      type: "textbox";
      x: number;
      y: number;
      text: string;
      fontSize: number;
      color: string;
      userId: string;
      rotation?:number  
    }
  | {
      id: string;
      type: "shape";
      shapeType: "square" | "circle" | "diamond";
      x: number;
      y: number;
      width: number;
      height: number;
      color: string;
      filled: boolean;
      userId: string;
    }
  | {
      id: string;
      type: "line";
      lineType: "arrow" | "straight";
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      cpx?: number;
      cpy?: number;
      color: string;
      userId: string;
    };

const roomElements: Record<string, CanvasElement[]> = {};
//store room state
const roomBoards: Record<string, Stroke[]> = {};
const roomImages: Record<string, ImageElement[]> = {};

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

    //send message
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
    //!webrtc features
    socket.on("offer", ({ to, offer }) => {
      io.to(to).emit("receive-offer", { from: socket.id, offer });
    });

    socket.on("answer", ({ to, answer }) => {
      io.to(to).emit("receive-answer", { from: socket.id, answer });
    });

    socket.on("ice-candidates", ({ to, candidate }) => {
      io.to(to).emit("receive-ice-candidates", {
        from: socket.id,
        candidate,
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
    //!canvas code

    //intial state of the board
    socket.on("board-state", (roomId) => {
      socket.emit("board-state", roomBoards[roomId] ?? []);
      socket.emit("image-state", roomImages[roomId] ?? []);
      socket.emit("element-state", roomElements[roomId] ?? []);
    });

    //image upload Handler
    socket.on("image-upload", (data) => {
      roomImages[data.roomId] ??= [];
      const imageData: ImageElement = {
        id: data.id,
        image: data.image,
        userId: socket.data.userId,
        x: data.x,
        y: data.y,
        width: data.width,
        height: data.height,
        rotation: data.rotation || 0,
      };

      roomImages[data.roomId]!.push(imageData);
      socket.to(data.roomId).emit("image-upload", imageData);
    });
    //get username and userId
    socket.on("my-info", (callback) => {
      callback({
        userId: socket.data.userId,
        name: socket.data.name,
      });
    });

    socket.on("stroke-start", (data) => {
      socket.to(data.roomId).emit("stroke-start", data);
    });

    socket.on("stroke-points", (data) => {
      socket.to(data.roomId).emit("stroke-points", data);
    });

    socket.on("stroke-end", (data) => {
      roomBoards[data.roomId] ??= [];
      roomBoards[data.roomId]!.push(data.strokes);
      socket.to(data.roomId).emit("stroke-end", data);
    });

    socket.on("stroke-delete", (data) => {
      const threshold = 10;
      roomBoards[data.roomId] = (roomBoards[data.roomId] ?? []).filter(
        (stroke) => {
          const isNear = stroke.points.some((p) => {
            const dx = p.x - data.point.x;
            const dy = p.y - data.point.y;
            return dx * dx + dy * dy <= threshold * threshold;
          });
          return !isNear;
        },
      );
      socket.to(data.roomId).emit("stroke-delete", data.point);
    });

    //image handlers

    socket.on("move-image", (data) => {
      const image = roomImages[data.roomId]?.find((img) => img.id == data.id);
      if (image) {
        image.x = data.x;
        image.y = data.y;
        image.rotation = data.rotation || 0;
      }
      socket.to(data.roomId).emit("move-image", image);
    });

    socket.on("rotate-image", (data) => {
      const image = roomImages[data.roomId]?.find((img) => img.id === data.id);
      if (image) {
        image.rotation = data.rotation || 0;
      }
      socket.to(data.roomId).emit("rotate-image", image);
    });

    socket.on("resize-image", (data) => {
      const image = roomImages[data.roomId]?.find((img) => img.id === data.id);
      if (image) {
        image.width = data.width;
        image.height = data.height;
      }
      socket.to(data.roomId).emit("resize-image", image);
    });
    socket.on("delete-image", (data) => {
      roomImages[data.roomId] = (roomImages[data.roomId] ?? []).filter(
        (img) => img.id !== data.id,
      );
      socket.to(data.roomId).emit("delete-image", data.id);
    });

    //textbox

    // add (covers both textbox and shape)
    socket.on("element-add", (data) => {
      roomElements[data.roomId] ??= [];
      const element: CanvasElement = {
        ...data.element,
        userId: socket.data.userId,
      };
      roomElements[data.roomId]!.push(element);
      socket.to(data.roomId).emit("element-add", element);
    });

    // update (covers textbox edit/font-size-change, shape move)
    socket.on("element-update", (data) => {
      const el = roomElements[data.roomId]?.find((e) => e.id === data.id);
      if (el) Object.assign(el, data.changes);
      socket
        .to(data.roomId)
        .emit("element-update", { id: data.id, changes: data.changes });
    });

    // delete (covers both)
    socket.on("element-delete", (data) => {
      roomElements[data.roomId] = (roomElements[data.roomId] ?? []).filter(
        (e) => e.id !== data.id,
      );
      socket.to(data.roomId).emit("element-delete", data.id);
    });
  });

  return io;
};

export { setSocketConnection };
