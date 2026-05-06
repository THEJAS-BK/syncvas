import jwt from "jsonwebtoken"
import { Server } from "socket.io";

let activeRooms=new Set <string>();
let messages: Record<string, any> = {};
let timeOnline: Record<string, any> = {};

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
      console.log("User connected:", socket.data.userId);
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
     }
     activeRooms.add(roomId)
     socket.join(roomId);
     callback?.({success:true})
    })
    
    //join rooms logic
    socket.on("join-room",(roomId:string,callback)=>{
      if(!activeRooms.has(roomId)){
        callback?.({success:false,message:"Room dosent exist"})
        return;
      }
      socket.join(roomId);

      socket.to(roomId).emit("joined-user",{
        userId:socket.id,
        roomId,
        timeStamp:Date.now()
      })
      callback?.({success:true})
    })
  })
 

  return io;
};

export { setSocketConnection };
