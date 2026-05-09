import jwt from "jsonwebtoken"
import { Server } from "socket.io";
import User from "../models/user.model"
import { timeStamp } from "node:console";

let activeRooms=new Set <string>();


const setSocketConnection = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods:["GET", "POST"],
      credentials: true,
    },
  });

  io.use((socket,next)=>{
    const token=socket.handshake.auth.accesstoken;
    if(!token){
      return next(new Error("NO token provided"))
    }
    try{
      const decode=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET!)as any
      socket.data.userId=decode.userId;
      socket.data.name=decode.name;
      console.log("User connected:", socket.data.name);
      next();
    } catch (error) {
      return next(new Error("Invalid token"))
    }
  })

  io.on("connection",(socket)=>{
    console.log("user joined    ",socket.id);
    //creating the rooms
    socket.on("create-room",(roomId,callback)=>{
     if(activeRooms.has(roomId)){
      callback?.({success:false,message:"Room already exist"})
      return;
     }
     activeRooms.add(roomId)
     socket.join(roomId);
     callback?.({success:true})
    })
    
    //join rooms logic
    socket.on("join-room",  (roomId:string,callback)=>{
      if(!activeRooms.has(roomId)){
        callback?.({success:false,message:"Room dosent exist"})
        return;
      }
      socket.join(roomId);

      socket.to(roomId).emit("joined-user",{
        userId:socket.data.userId,
        name:socket.data.name,
        roomId,
        timeStamp:Date.now()
      })
      callback?.({success:true})
    })

    //send message
    socket.on("send-message", (roomId:string,data:string)=>{
      io.to(roomId).emit("receive-message",{
        roomId:roomId,
        userId:socket.id,
        name:socket.data.name,
        data,
        sentAt:Date.now()
      })
    })
  })
  return io;
};

export { setSocketConnection };
