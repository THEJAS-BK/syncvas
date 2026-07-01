import { useWebRtcContext } from "../../context/WebRtcContext";
import VideoCard from "./VideoCard";
import VideoOptions from "./VideoOptions";
interface VideoTabProps {
  roomId: string;
  localStream: React.MutableRefObject<MediaStream | null>;
  remoteStreams: { [socketId: string]: MediaStream };
  isReady: boolean;
  isVideoMuted: boolean;
  isCursorOpen: boolean;
}
export default function VideoTab({
  roomId,
  localStream,
  remoteStreams,
  isReady,
  isVideoMuted,
  isCursorOpen,
}: VideoTabProps) {
  const { audioToggle, videoToggle, isAudioMuted } = useWebRtcContext();
  const participantCount =
    (isReady && localStream.current ? 1 : 0) +
    Object.keys(remoteStreams).length;
  const gridClass =
    participantCount <= 1
      ? "grid-cols-1 grid-rows-1"
      : participantCount === 2
        ? "grid-cols-2 grid-rows-1"
        : participantCount === 3
          ? "grid-cols-2 grid-rows-2"
          : participantCount === 4
            ? "grid-cols-2 grid-rows-2"
            : "grid-cols-3 grid-rows-3";
  return (
    <>
      <div className={`grid ${gridClass} h-[80%] gap-4 `}>
        {isReady && localStream.current && (
          <VideoCard
            stream={localStream.current}
            isVideoMuted={isVideoMuted}
            isCursorOpen={isCursorOpen}
          />
        )}
        {Object.entries(remoteStreams).map(([id, stream]) => {
          return (
            <VideoCard
              key={id}
              stream={stream}
              isVideoMuted={isVideoMuted}
              isCursorOpen={isCursorOpen}
            />
          );
        })}
      </div>
      <VideoOptions
        audioToggle={audioToggle}
        videoToggle={videoToggle}
        isAudioMuted={isAudioMuted}
        isVideoMuted={isVideoMuted}
      />
    </>
  );
}
