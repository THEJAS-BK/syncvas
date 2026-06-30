import { Socket,Server } from "socket.io";


import type { AnswerPayload,OfferPayload, IceCandidatePayload } from "./types/webRtcTypes";

export function registerWebRtcHandler(socket: Socket, io: Server, activeRooms: Record<string, Set<string>>) {
    socket.on("offer", ({ to, offer }: OfferPayload) => {
      io.to(to).emit("receive-offer", { from: socket.id, offer });
    });

    socket.on("answer", ({ to, answer }: AnswerPayload) => {
      io.to(to).emit("receive-answer", { from: socket.id, answer });
    });

    socket.on("ice-candidates", ({ to, candidate }: IceCandidatePayload) => {
      io.to(to).emit("receive-ice-candidates", {
        from: socket.id,
        candidate,
      });
    });
}