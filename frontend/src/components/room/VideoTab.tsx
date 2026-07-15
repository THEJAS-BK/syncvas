import { useWebRtcContext } from "../../context/WebRtcContext";
import VideoCard from "./VideoCard";
import OptionsFooter from "./OptionsFooter";
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

  return (
    <>
      <div className="grid h-full w-full  h-[90%]">
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
    </>
  );
}
