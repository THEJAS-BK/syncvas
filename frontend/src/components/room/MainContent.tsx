import VideoTab from "./VideoTab";
import VideoOptions from "./VideoOptions";
import { useWebRTC } from "../../hooks/Webrtc";

export default function MainContent({roomId}:{roomId:string}) {
  const {localStream, remoteStreams, isReady,audioToggle,videoToggle,isAudioMuted,isVideoMuted} =useWebRTC(roomId);
  return (
    <div className=" w-[70%] flex flex-col">
      <VideoTab roomId={roomId} localStream={localStream} remoteStreams={remoteStreams} isReady={isReady} />
      <VideoOptions audioToggle={audioToggle} videoToggle={videoToggle} isAudioMuted={isAudioMuted} isVideoMuted={isVideoMuted} />
    </div>
  );
}
