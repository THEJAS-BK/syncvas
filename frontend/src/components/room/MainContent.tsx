import VideoTab from "./VideoTab";
import { useWebRtcContext } from "../../context/WebRtcContext";
import { useEffect, type Dispatch, type SetStateAction } from "react";

export default function MainContent({
  roomId,
}: {
  roomId: string;
}) {
  const { localStream, remoteStreams, isReady, isVideoMuted } =
    useWebRtcContext();
  return (
    <>
      <div
        className={`flex flex-col w-[70%] bg-gray-950`}
        style={{ scrollBehavior: "auto", overflow: "auto" }}
      >
        <VideoTab
          roomId={roomId}
          localStream={localStream}
          remoteStreams={remoteStreams}
          isReady={isReady}
          isVideoMuted={isVideoMuted}
          isCursorOpen={false}
        />
      </div>
    </>
  );
}
