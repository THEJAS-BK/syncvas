import React, { createContext, useContext } from "react";
import { useWebRTC } from "../hooks/Webrtc";

const WebRtcContext = createContext<ReturnType<typeof useWebRTC> | null>(null);

export function WebRtcProvider({
  roomId,
  children,
}: {
  roomId: string;
  children: React.ReactNode;
}) {
  const webrtc = useWebRTC(roomId);

 return(
     <WebRtcContext.Provider value={webrtc}>{children}</WebRtcContext.Provider>
 )
}

export function useWebRtcContext() {
  const ctx = useContext(WebRtcContext);
  if (!ctx) throw new Error("No web context provided");
  return ctx;
}
