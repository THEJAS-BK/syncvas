import VideoTab from "./VideoTab";
import { useWebRtcContext } from "../../context/WebRtcContext";
import ChatInterface from "./ChatInterface";
import NavBar from "../home/NavBar";
import OptionsFooter from "./OptionsFooter";

export default function MainContent({ roomId }: { roomId: string }) {
  const { localStream, remoteStreams, isReady, isVideoMuted } =
    useWebRtcContext();
  const { audioToggle, videoToggle, isAudioMuted } = useWebRtcContext();

  return (
    <>
      <div
        className={`flex flex-col w-full`}
        style={{ scrollBehavior: "auto", overflow: "auto" }}
      >
        <NavBar />
        <div className="flex-1 h-full w-full flex">
          <VideoTab
            roomId={roomId}
            localStream={localStream}
            remoteStreams={remoteStreams}
            isReady={isReady}
            isVideoMuted={isVideoMuted}
            isCursorOpen={false}
          />
        </div>
        <OptionsFooter
          audioToggle={audioToggle}
          videoToggle={videoToggle}
          isAudioMuted={isAudioMuted}
          isVideoMuted={isVideoMuted}
        />
      </div>
    </>
  );
}
