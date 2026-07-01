import VideoTab from "./VideoTab";
import { useWebRtcContext } from "../../context/WebRtcContext";
import { useEffect, type Dispatch, type SetStateAction } from "react";

export default function MainContent({
  roomId,
  setFloatChatInterface,
  floatChatInterface,
}: {
  roomId: string;
  setFloatChatInterface: Dispatch<SetStateAction<boolean>>;
  floatChatInterface: boolean;
}) {
  const { localStream, remoteStreams, isReady, isVideoMuted } =
    useWebRtcContext();
  useEffect(() => {
    setFloatChatInterface(false);
  });
  return (
    <>
      <div
        className={`flex flex-col ${floatChatInterface ? "w-full" : "w-[70%]"} bg-gray-950`}
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
