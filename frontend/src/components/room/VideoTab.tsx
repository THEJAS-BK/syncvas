import { useWebRtcContext } from "../../context/WebRtcContext";
import VideoCard from "./VideoCard";
import OptionsFooter from "./OptionsFooter";
interface VideoTabProps {
  roomId: string;
  localStream: React.MutableRefObject<MediaStream | null>;
  remoteStreams: { [socketId: string]: MediaStream };
  isReady: boolean;
  isVideoMuted: boolean;
  openCursor: boolean;
}
export default function VideoTab({
  roomId,
  localStream,
  remoteStreams,
  isReady,
  isVideoMuted,
  openCursor,
}: VideoTabProps) {
  const participantCount =
    (isReady && localStream.current ? 1 : 0) +
    Object.keys(remoteStreams).length;

  const getTileSize = (count: number) => {
    if (count <= 1) return "w-full h-[90%] max-w-4xl";
    if (count <= 2) return "w-[48%] h-[90%]";
    if (count <= 4) return "w-[48%] h-[45%]";
    return "w-[32%] h-[45%]"; 
  };
  return (
    <>
     {!openCursor && (
        <div
          className={`bg-zinc-900 flex flex-wrap h-full w-full  items-center justify-center content-center gap-2 `}
        >
          {isReady && localStream.current && (
            <div className={getTileSize(participantCount)}>
              <VideoCard
                stream={localStream.current}
                isVideoMuted={isVideoMuted}
                openCursor={openCursor}
              />
            </div>
          )}
          {Object.entries(remoteStreams).map(([id, stream]) => (
            <div key={id} className={getTileSize(participantCount)}>
              <VideoCard
                stream={stream}
                isVideoMuted={isVideoMuted}
                openCursor={openCursor}
              />
            </div>
          ))}
        </div>
      )}

      {openCursor && (
        <div
          className={`p-2 flex flex-col flex-wrap h-full w-full  items-center justify-center content-center gap-2 `}
        >
          {isReady && localStream.current && (
            <div >
              <VideoCard
                stream={localStream.current}
                isVideoMuted={isVideoMuted}
                openCursor={openCursor}
              />
            </div>
          )}
          {Object.entries(remoteStreams).map(([id, stream]) => (
            <div key={id} >
              <VideoCard
                stream={stream}
                isVideoMuted={isVideoMuted}
                openCursor={openCursor}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
