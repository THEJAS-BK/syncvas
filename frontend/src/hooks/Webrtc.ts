import { useEffect, useRef, useState } from "react";
import { socket } from "../services/socket";

const ICE_CONFIG = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export const useWebRTC = (roomId: string) => {
  const pendingCandidates = useRef<Record<string, RTCIceCandidateInit[]>>({});
  const [remoteStreams, setRemoteStreams] = useState<{
    [socketId: string]: MediaStream;
  }>({});
  const [isReady, setIsReady] = useState(false);
  const localStream = useRef<MediaStream | null>(null);
  const peerConnections = useRef<{ [socketId: string]: RTCPeerConnection }>({});

  const createPC = (remoteId: string) => {
    const pc = new RTCPeerConnection(ICE_CONFIG);

    localStream.current
      ?.getTracks()
      .forEach((track) => pc.addTrack(track, localStream.current!));

    pc.onicecandidate = ({ candidate }) => {
      if (candidate) socket.emit("ice-candidates", { to: remoteId, candidate });
    };

    pc.ontrack = ({ streams }) => {
      setRemoteStreams((prev) => ({ ...prev, [remoteId]: streams[0] }));
    };

    peerConnections.current[remoteId] = pc;
    return pc;
  };

  useEffect(() => {
    const init = async () => {
      if (localStream.current) return; // guard against StrictMode double invoke

      localStream.current = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setIsReady(true); // trigger re-render so local video shows up

      const join = () =>
        socket.emit("join-room", roomId, (res: any) => {
          if (!res.success) console.error(res.message);
        });

      if (socket.connected) {
        join();
      } else {
        socket.connect();
        socket.once("connect", join);
      }
    };

    init();

    socket.on("existing-peers", async (peers: string[]) => {
      for (const peerId of peers) {
        const pc = createPC(peerId);
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("offer", { to: peerId, offer });
      }
    });

    socket.on("joined-user", ({ socketId }: { socketId: string }) =>
      createPC(socketId),
    );

    socket.on("receive-offer", async ({ from, offer }) => {
      let pc = peerConnections.current[from];

      if (!pc) {
        pc = createPC(from);
      }

      await pc.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("answer", { to: from, answer });
    });

    socket.on("receive-answer", async ({ from, answer }: any) => {
      await peerConnections.current[from].setRemoteDescription(answer);
    });

    socket.on("receive-ice-candidates", async ({ from, candidate }) => {
      const pc = peerConnections.current[from];

      if (!pc.remoteDescription) {
        if (!pendingCandidates.current[from]) {
          pendingCandidates.current[from] = [];
        }

        pendingCandidates.current[from].push(candidate);
        return;
      }

      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    });

    socket.on("user-left", (socketId: string) => {
      peerConnections.current[socketId]?.close();
      delete peerConnections.current[socketId];
      setRemoteStreams((prev) => {
        const updated = { ...prev };
        delete updated[socketId];
        return updated;
      });
    });

    return () => {
      localStream.current?.getTracks().forEach((t) => t.stop());
      localStream.current = null; // reset so re-mount reinitializes
      setIsReady(false);
      Object.values(peerConnections.current).forEach((pc) => pc.close());
      peerConnections.current = {};
      socket.off("existing-peers");
      socket.off("joined-user");
      socket.off("receive-offer");
      socket.off("receive-answer");
      socket.off("receive-ice-candidates");
      socket.off("user-left");
    };
  }, [roomId]);

  return { localStream, remoteStreams, isReady };
};
