import VideoTab from "./VideoTab";
import { useWebRtcContext } from "../../context/WebRtcContext";

export default function MainContent({ roomId,floatChatInterface }: { roomId: string,floatChatInterface:boolean }) {
  const {
    localStream,
    remoteStreams,
    isReady,
    isVideoMuted,
  } =useWebRtcContext();
  return (
    <>
      <div className={`flex flex-col ${floatChatInterface ? 'w-full' : 'w-[70%]'}`}>
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
