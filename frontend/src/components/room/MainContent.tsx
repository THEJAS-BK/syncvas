import VideoTab from "./VideoTab";
import VideoOptions from "./VideoOptions";
import { useWebRtcContext } from "../../context/WebRtcContext";

export default function MainContent({ roomId }: { roomId: string }) {
  const {
    localStream,
    remoteStreams,
    isReady,
    audioToggle,
    videoToggle,
    isAudioMuted,
    isVideoMuted,
  } =useWebRtcContext();
  return (
    <>
      <div className=" w-[70%] flex flex-col">
        <VideoTab
          roomId={roomId}
          localStream={localStream}
          remoteStreams={remoteStreams}
          isReady={isReady}
          isVideoMuted={isVideoMuted}
        />
      </div>
    </>
  );
}
