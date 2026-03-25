import { time } from "node:console";
import { Server } from "socket.io";

let connections: { [key: string]: string[] } = {};
let messages: { [key: string]: any } = {};
let timeOnline: { [key: string]: Date } = {};

const setSocketConnection = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.ORIGIN,
      credentials: true,
    },
  });
  io.on("connection", (socket) => {
    socket.on("join", (path) => {
      if (!connections[path]) {
        connections[path] = [];
      }
      connections[path].push(socket.id);
      timeOnline[socket.id]=new Date();

      connections[path].forEach(ele=>{
        io.to(ele).emit("user-joined",socket.id,connections[path])
      })

      if(messages[path]!==undefined){
        for(let a=0;a<messages[path].length;a++){
          io.to(socket.id).emit("chat-message",messages[path][a]['data'],
            messages[path][a]['sender'],messages[path][a]['socket-id-sender']
          )
        }
      }

      console.log(connections[path]);
    });

    socket.on("signal", (toId, message) => {
      io.to(toId).emit("signal", message);
    });

    socket.on("chat-message", (data, sender) => {
      
    });

    socket.on("disconnect", () => {});
  });
  return io;
};

export { setSocketConnection };
