import VideoCard from "./VideoCard";

interface VideoTabProps {
roomId:string;
  localStream: React.MutableRefObject<MediaStream | null>;
  remoteStreams: { [socketId: string]: MediaStream };
  isReady: boolean;
}
export default function VideoTab({roomId,localStream,remoteStreams,isReady}:VideoTabProps) {
    return(
        <div className="border-2 w-full h-[80%] flex justify-evenly flex-wrap pt-5">
            {isReady &&localStream.current&&<VideoCard stream={localStream.current} muted />}
            {Object.entries(remoteStreams).map(([id,stream])=>{
               return <VideoCard key={id} stream={stream}/>
            })}
        </div>
    )
};
