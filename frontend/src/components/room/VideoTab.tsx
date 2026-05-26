import { useWebRtcContext } from "../../context/WebRtcContext";
import VideoCard from "./VideoCard";
import VideoOptions from "./VideoOptions";
interface VideoTabProps {
roomId:string;
  localStream: React.MutableRefObject<MediaStream | null>;
  remoteStreams: { [socketId: string]: MediaStream };
  isReady: boolean;
  isVideoMuted:boolean
}
export default function VideoTab({roomId,localStream,remoteStreams,isReady,isVideoMuted}:VideoTabProps) {
    const {audioToggle,videoToggle,isAudioMuted}=useWebRtcContext();
    return(
       <>
        <div className="grid grid-cols-[repeat(auto-fit),minmax(250px,1fr)] h-[80%] gap-4">
            {isReady &&localStream.current&&<VideoCard stream={localStream.current} isVideoMuted={isVideoMuted} />}
            {Object.entries(remoteStreams).map(([id,stream])=>{
               return <VideoCard key={id} stream={stream} isVideoMuted={isVideoMuted} />
            })}
        </div>
                   <VideoOptions
          audioToggle={audioToggle}
          videoToggle={videoToggle}
          isAudioMuted={isAudioMuted}
          isVideoMuted={isVideoMuted}
       />
       </>
    )
};
