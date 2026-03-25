
import { Server } from "socket.io";

let connections: { [key: string]: string[]|any } = {};
let messages: { [key: string]: any } = {};
let timeOnline: { [key: string]: Date } = {};

const setSocketConnection = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.ORIGIN,
      credentials: true,
    },
  });
 
  return io;
};

export { setSocketConnection };
