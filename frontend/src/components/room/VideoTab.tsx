import VideoCard from "./VideoCard";
import { useWebRTC } from "../../hooks/Webrtc";
export default function VideoTab({roomId}:{roomId:string}) {
    const { localStream, remoteStreams,isReady } = useWebRTC(roomId);
    return(
        <div className="border-2 w-full h-[80%] flex justify-evenly flex-wrap pt-5">
            {isReady &&localStream.current&&<VideoCard stream={localStream.current} muted />}
            {Object.entries(remoteStreams).map(([id,stream])=>{
               return <VideoCard key={id} stream={stream}/>
            })}
        </div>
    )
};
