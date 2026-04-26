import { io, Socket } from "socket.io-client";

const URL = "http://localhost:8080";

export const socket: Socket = io(URL, {
  autoConnect: false,
  auth:{
    accesstoken: localStorage.getItem("accesstoken")
  }
});