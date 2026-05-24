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
        <div className="border-2 w-full h-[80%] flex justify-evenly flex-wrap pt-5">
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
